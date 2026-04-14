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
   * Obtener reservaciones de un paciente específico
   */
  async findByPaciente(idPaciente: number) {
    return this.prisma.reservacion.findMany({
      where: { Paciente_idPaciente: idPaciente },
      include: {
        Habitacion: {
          include: {
            Tipo: true
          }
        },
        Tipo_Estancia: true,
        Estado: true
      },
      orderBy: { Fecha_Registro: 'desc' }
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

      // Crear la reservación - extraer IDs para usar connect
      const {
        Paciente_idPaciente,
        Habitacion_idHabitacion,
        Catalogo_Tipo_Estancia_idEstancia,
        Catalogo_Estado_Reservacion_idEstado,
        Empleado_idEmpleado_Registra,
        ...restData
      } = data;

      const result = await this.prisma.reservacion.create({
        data: {
          ...restData,
          Paciente: { connect: { idPaciente: Paciente_idPaciente } },
          Habitacion: { connect: { idHabitacion: Habitacion_idHabitacion } },
          Tipo_Estancia: { connect: { idCatalogo_Tipo_Estancia: Catalogo_Tipo_Estancia_idEstancia } },
          Estado: { connect: { idCatalogo_Estado_Reservacion: Catalogo_Estado_Reservacion_idEstado || 1 } },
          Empleado: { connect: { idEmpleado: Empleado_idEmpleado_Registra } }
        },
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

  /**
   * Crear solicitud de reservación desde el portal de paciente
   */
  async crearSolicitudPaciente(idPaciente: number, data: any) {
    try {
      console.log('Creating patient reservation request:', { idPaciente, data });

      // Validar que el paciente no tenga otra reservación activa
      const reservacionExistente = await this.prisma.reservacion.findFirst({
        where: {
          Paciente_idPaciente: idPaciente,
          Activo: true,
          Catalogo_Estado_Reservacion_idEstado: 1 // Activa
        }
      });

      if (reservacionExistente) {
        throw new BadRequestException(
          'Ya tienes una reservación activa. Debes esperar a que finalice para solicitar otra.'
        );
      }

      // Validar disponibilidad de la habitación
      const disponibilidad = await this.getDisponibilidadHabitacion(data.Habitacion_idHabitacion);

      if (!disponibilidad.disponible) {
        throw new BadRequestException(
          `La habitación ${disponibilidad.numeroHabitacion} no está disponible en este momento.`
        );
      }

      // Parsear fechas de forma segura
      const parseFecha = (fechaStr: string): Date => {
        if (!fechaStr) return new Date();
        const [year, month, day] = fechaStr.split('-').map(Number);
        // Validar que el año sea razonable (entre 2020 y 2100)
        if (year < 2020 || year > 2100) {
          throw new BadRequestException(`Año inválido: ${year}. Debe estar entre 2020 y 2100.`);
        }
        return new Date(year, month - 1, day, 12, 0, 0);
      };

      // Crear la reservación con estado "Pendiente" (4) para que el personal la apruebe
      // O "Activa" (1) si se quiere aprobar automáticamente
      const reservacionData = {
        Paciente_idPaciente: idPaciente,
        Habitacion_idHabitacion: data.Habitacion_idHabitacion,
        Catalogo_Tipo_Estancia_idEstancia: data.Catalogo_Tipo_Estancia_idEstancia,
        Catalogo_Estado_Reservacion_idEstado: 1, // Activa (aprobar automáticamente)
        Empleado_idEmpleado_Registra: 1, // Empleado por defecto (sistema)
        Fecha_Inicio: parseFecha(data.Fecha_Inicio),
        Fecha_Fin: data.Fecha_Fin ? parseFecha(data.Fecha_Fin) : null,
        Fecha_Registro: new Date(),
        Observaciones: data.Observaciones || 'Reservación solicitada desde portal de paciente',
        Activo: true
      };

      const result = await this.prisma.reservacion.create({
        data: reservacionData,
        include: {
          Paciente: true,
          Habitacion: {
            include: {
              Tipo: true
            }
          },
          Tipo_Estancia: true,
          Estado: true
        }
      });

      // Actualizar estado de habitación
      await this.actualizarEstadoHabitacion(data.Habitacion_idHabitacion);

      return result;
    } catch (error) {
      console.error('Error creating patient reservation:', error);
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


  /**
   * Cancelar reservación desde el portal del paciente
   */
  async cancelarReservacionPaciente(idPaciente: number, idReservacion: number) {
    // Verificar que la reservación existe y pertenece al paciente
    const reservacion = await this.prisma.reservacion.findFirst({
      where: {
        idReservacion: idReservacion,
        Paciente_idPaciente: idPaciente
      }
    });

    if (!reservacion) {
      throw new BadRequestException("Reservación no encontrada o no te pertenece");
    }

    // Solo se pueden cancelar reservaciones activas o pendientes
    if (reservacion.Catalogo_Estado_Reservacion_idEstado !== 1 && 
        reservacion.Catalogo_Estado_Reservacion_idEstado !== 4) {
      throw new BadRequestException("Solo se pueden cancelar reservaciones activas o pendientes");
    }

    // Actualizar estado a Cancelada (3)
    const result = await this.prisma.reservacion.update({
      where: { idReservacion: idReservacion },
      data: { Catalogo_Estado_Reservacion_idEstado: 3 },
      include: {
        Habitacion: true,
        Estado: true
      }
    });

    // Actualizar estado de la habitación
    await this.actualizarEstadoHabitacion(reservacion.Habitacion_idHabitacion);

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