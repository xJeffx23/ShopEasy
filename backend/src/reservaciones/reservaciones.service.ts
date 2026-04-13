import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReservacionesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.reservacion.findMany({
      include: {
        Paciente: true,
        Habitacion: {
          include: {
            Tipo: true
          }
        },
        Tipo_Estancia: true,
        Estado: true,
        Empleado: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.reservacion.findUnique({
      where: { idReservacion: id },
      include: {
        Paciente: true,
        Habitacion: {
          include: {
            Tipo: true
          }
        },
        Tipo_Estancia: true,
        Estado: true,
        Empleado: true
      }
    });
  }

  /**
   * Obtener disponibilidad de una habitación
   * Retorna: { disponible: boolean, ocupacionActual: number, capacidad: number }
   */
  async getDisponibilidadHabitacion(habitacionId: number) {
    const habitacion = await this.prisma.habitacion.findUnique({
      where: { idHabitacion: habitacionId },
      include: {
        Tipo: true,
        Estado: true,
        Reservaciones: {
          where: {
            Activo: true,
            Catalogo_Estado_Reservacion_idEstado: 1 // Solo reservaciones activas
          }
        }
      }
    });

    if (!habitacion) {
      throw new BadRequestException('Habitación no encontrada');
    }

    const ocupacionActual = habitacion.Reservaciones.length;
    const capacidad = habitacion.Capacidad;
    const disponible = ocupacionActual < capacidad &&
      habitacion.Catalogo_Estado_Habitacion_idEstado !== 3 && // No en mantenimiento
      habitacion.Catalogo_Estado_Habitacion_idEstado !== 4;   // No cerrada

    return {
      idHabitacion: habitacion.idHabitacion,
      numeroHabitacion: habitacion.Numero_Habitacion,
      tipo: habitacion.Tipo?.Nombre_Tipo,
      tipoId: habitacion.Catalogo_Tipo_Habitacion_idTipo,
      capacidad,
      ocupacionActual,
      espaciosDisponibles: Math.max(0, capacidad - ocupacionActual),
      disponible,
      estadoId: habitacion.Catalogo_Estado_Habitacion_idEstado,
      estado: habitacion.Estado?.Descripcion_Estado
    };
  }

  /**
   * Obtener todas las habitaciones con su disponibilidad
   */
  async getHabitacionesConDisponibilidad() {
    const habitaciones = await this.prisma.habitacion.findMany({
      include: {
        Tipo: true,
        Estado: true,
        Reservaciones: {
          where: {
            Activo: true,
            Catalogo_Estado_Reservacion_idEstado: 1 // Solo reservaciones activas
          },
          include: {
            Paciente: true
          }
        }
      }
    });

    return habitaciones.map(hab => {
      const ocupacionActual = hab.Reservaciones.length;
      const capacidad = hab.Capacidad;
      const disponible = ocupacionActual < capacidad &&
        hab.Catalogo_Estado_Habitacion_idEstado !== 3 &&
        hab.Catalogo_Estado_Habitacion_idEstado !== 4;

      return {
        idHabitacion: hab.idHabitacion,
        numeroHabitacion: hab.Numero_Habitacion,
        piso: hab.Piso,
        tipo: hab.Tipo?.Nombre_Tipo,
        tipoId: hab.Catalogo_Tipo_Habitacion_idTipo,
        costoPorDia: hab.Tipo?.Costo_Por_Dia,
        capacidad,
        ocupacionActual,
        espaciosDisponibles: Math.max(0, capacidad - ocupacionActual),
        disponible,
        estadoId: hab.Catalogo_Estado_Habitacion_idEstado,
        estado: hab.Estado?.Descripcion_Estado,
        pacientesActuales: hab.Reservaciones.map(r => ({
          id: r.Paciente?.idPaciente,
          nombre: r.Paciente?.Nombre
        }))
      };
    });
  }

  async create(data: any) {
    try {
      console.log('Creating reservation with data:', data);

      // Validar disponibilidad antes de crear
      const disponibilidad = await this.getDisponibilidadHabitacion(data.Habitacion_idHabitacion);

      if (!disponibilidad.disponible) {
        throw new BadRequestException(
          `La habitación ${disponibilidad.numeroHabitacion} no está disponible. ` +
          `Ocupación: ${disponibilidad.ocupacionActual}/${disponibilidad.capacidad}`
        );
      }

      // Validar que el paciente no tenga otra reservación activa
      const reservacionExistente = await this.prisma.reservacion.findFirst({
        where: {
          Paciente_idPaciente: data.Paciente_idPaciente,
          Activo: true,
          Catalogo_Estado_Reservacion_idEstado: 1 // Activa
        }
      });

      if (reservacionExistente) {
        throw new BadRequestException(
          'El paciente ya tiene una reservación activa. Debe finalizarla o cancelarla primero.'
        );
      }

      // Crear la reservación
      const result = await this.prisma.reservacion.create({
        data: data,
        include: {
          Paciente: true,
          Habitacion: {
            include: {
              Tipo: true
            }
          },
          Tipo_Estancia: true,
          Estado: true,
          Empleado: true
        }
      });

      // Actualizar estado de habitación según nueva ocupación
      await this.actualizarEstadoHabitacion(data.Habitacion_idHabitacion);

      return result;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  async update(id: number, data: any) {
    try {
      const reservacionAnterior = await this.prisma.reservacion.findUnique({
        where: { idReservacion: id },
        select: {
          Habitacion_idHabitacion: true,
          Catalogo_Estado_Reservacion_idEstado: true
        }
      });

      const result = await this.prisma.reservacion.update({
        where: { idReservacion: id },
        data,
        include: {
          Paciente: true,
          Habitacion: {
            include: {
              Tipo: true
            }
          },
          Tipo_Estancia: true,
          Estado: true,
          Empleado: true
        }
      });

      // Si cambió el estado de la reservación, actualizar estado de habitación
      if (reservacionAnterior && data.Catalogo_Estado_Reservacion_idEstado) {
        await this.actualizarEstadoHabitacion(reservacionAnterior.Habitacion_idHabitacion);
      }

      return result;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }

  async remove(id: number) {
    const reservacion = await this.prisma.reservacion.findUnique({
      where: { idReservacion: id },
      select: { Habitacion_idHabitacion: true }
    });

    const result = await this.prisma.reservacion.delete({
      where: { idReservacion: id }
    });

    // Actualizar estado de habitación
    if (reservacion) {
      await this.actualizarEstadoHabitacion(reservacion.Habitacion_idHabitacion);
    }

    return result;
  }


  private async actualizarEstadoHabitacion(habitacionId: number) {
    const habitacion = await this.prisma.habitacion.findUnique({
      where: { idHabitacion: habitacionId },
      include: {
        Reservaciones: {
          where: {
            Activo: true,
            Catalogo_Estado_Reservacion_idEstado: 1
          }
        }
      }
    });

    if (!habitacion) return;

    // No cambiar si está en mantenimiento o cerrada
    if (habitacion.Catalogo_Estado_Habitacion_idEstado === 3 ||
      habitacion.Catalogo_Estado_Habitacion_idEstado === 4) {
      return;
    }

    const ocupacionActual = habitacion.Reservaciones.length;
    const nuevoEstado = ocupacionActual > 0 ? 2 : 1; // 2 = Reservada, 1 = Disponible

    await this.prisma.habitacion.update({
      where: { idHabitacion: habitacionId },
      data: { Catalogo_Estado_Habitacion_idEstado: nuevoEstado }
    });
  }
}