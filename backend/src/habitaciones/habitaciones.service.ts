import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// Estados de habitación
const ESTADO_DISPONIBLE = 1;
const ESTADO_RESERVADA = 2;
const ESTADO_MANTENIMIENTO = 3;
const ESTADO_CERRADA = 4;

// Nombres de estados para mensajes de error
const NOMBRES_ESTADO: Record<number, string> = {
  1: 'Disponible',
  2: 'Reservada',
  3: 'En mantenimiento',
  4: 'Cerrada'
};

@Injectable()
export class HabitacionesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    const habitaciones = await this.prisma.habitacion.findMany({
      include: {
        Tipo: true,
        Estado: true,
        Limpiezas: {
          include: { Empleado: true },
          orderBy: { Fecha_Limpieza: 'desc' },
          take: 5 // Solo las últimas 5 limpiezas
        },
        Mantenimientos: {
          include: { Empleado: true },
          orderBy: { Fecha_Mantenimiento: 'desc' },
          take: 5 // Solo los últimos 5 mantenimientos
        },
        Reservaciones: {
          where: {
            Activo: true,
            Catalogo_Estado_Reservacion_idEstado: 1 // Solo activas
          },
          include: { Paciente: true },
        },
      },
    });

    // Agregar información de ocupación a cada habitación
    return habitaciones.map(hab => ({
      ...hab,
      ocupacionActual: hab.Reservaciones.length,
      espaciosDisponibles: Math.max(0, hab.Capacidad - hab.Reservaciones.length),
      estaLlena: hab.Reservaciones.length >= hab.Capacidad,
      pacientesActuales: hab.Reservaciones.map(r => ({
        id: r.Paciente?.idPaciente,
        nombre: r.Paciente?.Nombre
      }))
    }));
  }

  async findOne(id: number) {
    const habitacion = await this.prisma.habitacion.findUnique({
      where: { idHabitacion: id },
      include: {
        Tipo: true,
        Estado: true,
        Limpiezas: {
          include: { Empleado: true },
          orderBy: { Fecha_Limpieza: 'desc' },
        },
        Mantenimientos: {
          include: { Empleado: true },
          orderBy: { Fecha_Mantenimiento: 'desc' },
        },
        Reservaciones: {
          where: {
            Activo: true,
            Catalogo_Estado_Reservacion_idEstado: 1
          },
          include: { Paciente: true },
        },
      },
    });

    if (!habitacion) {
      throw new BadRequestException('Habitación no encontrada');
    }

    return {
      ...habitacion,
      ocupacionActual: habitacion.Reservaciones.length,
      espaciosDisponibles: Math.max(0, habitacion.Capacidad - habitacion.Reservaciones.length),
      estaLlena: habitacion.Reservaciones.length >= habitacion.Capacidad,
      pacientesActuales: habitacion.Reservaciones.map(r => ({
        id: r.Paciente?.idPaciente,
        nombre: r.Paciente?.Nombre
      }))
    };
  }

  async create(createRoomDto: any) {
    try {
      // Validar que el número de habitación no exista
      const existente = await this.prisma.habitacion.findUnique({
        where: { Numero_Habitacion: createRoomDto.Numero_Habitacion }
      });

      if (existente) {
        throw new BadRequestException(
          `Ya existe una habitación con el número ${createRoomDto.Numero_Habitacion}`
        );
      }

      // Validar capacidad
      if (createRoomDto.Capacidad < 1) {
        throw new BadRequestException('La capacidad debe ser al menos 1');
      }

      const result = await this.prisma.habitacion.create({
        data: {
          ...createRoomDto,
          Catalogo_Estado_Habitacion_idEstado: createRoomDto.Catalogo_Estado_Habitacion_idEstado || ESTADO_DISPONIBLE
        },
        include: {
          Tipo: true,
          Estado: true,
          Limpiezas: {
            include: { Empleado: true },
            orderBy: { Fecha_Limpieza: 'desc' },
          },
          Mantenimientos: {
            include: { Empleado: true },
            orderBy: { Fecha_Mantenimiento: 'desc' },
          },
          Reservaciones: {
            where: { Activo: true },
            include: { Paciente: true },
          },
        },
      });
      return result;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async update(id: number, updateRoomDto: any) {
    try {
      // Si se intenta cambiar el estado, usar updateStatus que tiene validaciones
      if (updateRoomDto.Catalogo_Estado_Habitacion_idEstado) {
        const { Catalogo_Estado_Habitacion_idEstado, ...restData } = updateRoomDto;

        // Primero actualizar el estado con validaciones
        await this.updateStatus(id, Catalogo_Estado_Habitacion_idEstado);

        // Si hay más datos, actualizar el resto
        if (Object.keys(restData).length > 0) {
          await this.prisma.habitacion.update({
            where: { idHabitacion: id },
            data: restData
          });
        }
      } else {
        await this.prisma.habitacion.update({
          where: { idHabitacion: id },
          data: updateRoomDto
        });
      }

      // Retornar la habitación actualizada con toda la información
      return this.findOne(id);
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      // Verificar si tiene reservaciones activas
      const habitacion = await this.prisma.habitacion.findUnique({
        where: { idHabitacion: id },
        include: {
          Reservaciones: {
            where: {
              Activo: true,
              Catalogo_Estado_Reservacion_idEstado: 1
            }
          }
        }
      });

      if (!habitacion) {
        throw new BadRequestException('Habitación no encontrada');
      }

      if (habitacion.Reservaciones.length > 0) {
        throw new BadRequestException(
          `No se puede eliminar la habitación ${habitacion.Numero_Habitacion} porque tiene ${habitacion.Reservaciones.length} reservación(es) activa(s). ` +
          'Finalice o cancele las reservaciones primero.'
        );
      }

      const result = await this.prisma.habitacion.delete({
        where: { idHabitacion: id },
      });
      return result;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  /**
   * Cambia el estado de una habitación con validaciones de negocio
   * 
   * Reglas:
   * - Reservada → Disponible: Solo si no tiene reservaciones activas
   * - Reservada → Mantenimiento/Cerrada: No permitido (tiene pacientes)
   * - Disponible → Reservada: Solo automático por sistema al crear reservación
   * - Disponible → Mantenimiento/Cerrada: Siempre permitido
   * - Mantenimiento/Cerrada → Disponible: Siempre permitido
   */
  async updateStatus(id: number, nuevoEstadoId: number) {
    try {
      const habitacion = await this.prisma.habitacion.findUnique({
        where: { idHabitacion: id },
        include: {
          Estado: true,
          Reservaciones: {
            where: {
              Activo: true,
              Catalogo_Estado_Reservacion_idEstado: 1 // Solo activas
            }
          }
        }
      });

      if (!habitacion) {
        throw new BadRequestException('Habitación no encontrada');
      }

      const estadoActual = habitacion.Catalogo_Estado_Habitacion_idEstado;
      const tieneReservacionesActivas = habitacion.Reservaciones.length > 0;
      const nombreEstadoActual = NOMBRES_ESTADO[estadoActual] || 'Desconocido';
      const nombreNuevoEstado = NOMBRES_ESTADO[nuevoEstadoId] || 'Desconocido';

      // Validar transiciones de estado

      // Si está RESERVADA
      if (estadoActual === ESTADO_RESERVADA) {
        // No puede cambiar a Mantenimiento o Cerrada si tiene reservaciones
        if ((nuevoEstadoId === ESTADO_MANTENIMIENTO || nuevoEstadoId === ESTADO_CERRADA) && tieneReservacionesActivas) {
          throw new BadRequestException(
            `No se puede cambiar la habitación ${habitacion.Numero_Habitacion} a "${nombreNuevoEstado}" ` +
            `porque tiene ${habitacion.Reservaciones.length} paciente(s) alojado(s). ` +
            'Finalice o traslade las reservaciones primero.'
          );
        }

        // No puede cambiar a Disponible si tiene reservaciones
        if (nuevoEstadoId === ESTADO_DISPONIBLE && tieneReservacionesActivas) {
          throw new BadRequestException(
            `No se puede cambiar la habitación ${habitacion.Numero_Habitacion} a "Disponible" ` +
            `porque tiene ${habitacion.Reservaciones.length} reservación(es) activa(s). ` +
            'El estado se actualizará automáticamente cuando finalicen las reservaciones.'
          );
        }
      }

      // Si está DISPONIBLE y se quiere poner RESERVADA manualmente
      if (estadoActual === ESTADO_DISPONIBLE && nuevoEstadoId === ESTADO_RESERVADA) {
        throw new BadRequestException(
          'El estado "Reservada" se asigna automáticamente al crear una reservación. ' +
          'Use el módulo de Reservaciones para asignar pacientes a esta habitación.'
        );
      }

      // Si está en MANTENIMIENTO o CERRADA
      if (estadoActual === ESTADO_MANTENIMIENTO || estadoActual === ESTADO_CERRADA) {
        // No puede cambiar a Reservada directamente
        if (nuevoEstadoId === ESTADO_RESERVADA) {
          throw new BadRequestException(
            `No se puede cambiar directamente a "Reservada". ` +
            'Primero cambie a "Disponible" y luego cree una reservación.'
          );
        }
      }

      // Si pasó todas las validaciones, actualizar el estado
      const result = await this.prisma.habitacion.update({
        where: { idHabitacion: id },
        data: { Catalogo_Estado_Habitacion_idEstado: nuevoEstadoId },
        include: {
          Tipo: true,
          Estado: true,
          Limpiezas: {
            include: { Empleado: true },
            orderBy: { Fecha_Limpieza: 'desc' },
          },
          Mantenimientos: {
            include: { Empleado: true },
            orderBy: { Fecha_Mantenimiento: 'desc' },
          },
          Reservaciones: {
            where: { Activo: true },
            include: { Paciente: true },
          },
        },
      });

      return {
        ...result,
        ocupacionActual: result.Reservaciones.length,
        espaciosDisponibles: Math.max(0, result.Capacidad - result.Reservaciones.length),
        mensaje: `Estado cambiado de "${nombreEstadoActual}" a "${nombreNuevoEstado}"`
      };
    } catch (error) {
      console.error('Error updating room status:', error);
      throw error;
    }
  }

  /**
   * Método interno para actualizar estado desde el sistema (sin validaciones manuales)
   * Usado por ReservacionesService para sincronizar estados automáticamente
   */
  async actualizarEstadoInterno(id: number, nuevoEstadoId: number) {
    return this.prisma.habitacion.update({
      where: { idHabitacion: id },
      data: { Catalogo_Estado_Habitacion_idEstado: nuevoEstadoId }
    });
  }
}