import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReservacionesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.reservacion.findMany({
      where: { Activo: true },
      include: {
        Paciente: true,
        Habitacion: {
          include: { Tipo: true }
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
          include: { Tipo: true }
        },
        Tipo_Estancia: true,
        Estado: true,
        Empleado: true
      }
    });
  }

  // Obtener pacientes disponibles para reservación (activos y sin reservación activa)
  async getPacientesDisponibles() {
    const pacientesConReservacionActiva = await this.prisma.reservacion.findMany({
      where: {
        Activo: true,
        Catalogo_Estado_Reservacion_idEstado: 1
      },
      select: { Paciente_idPaciente: true }
    });

    const idsConReservacion = pacientesConReservacionActiva.map(r => r.Paciente_idPaciente);

    return this.prisma.paciente.findMany({
      where: {
        Activo: true,
        idPaciente: { notIn: idsConReservacion }
      },
      select: {
        idPaciente: true,
        Nombre: true,
        Numero_Cedula: true
      }
    });
  }

  // Obtener habitaciones disponibles para reservación
  async getHabitacionesDisponibles() {
    return this.prisma.habitacion.findMany({
      where: {
        Catalogo_Estado_Habitacion_idEstado: 1 // Solo disponibles
      },
      include: { Tipo: true }
    });
  }

  // Obtener empleados activos
  async getEmpleadosActivos() {
    return this.prisma.empleado.findMany({
      where: { Activo: true },
      select: {
        idEmpleado: true,
        Nombre: true,
        Numero_Cedula: true
      }
    });
  }

  async create(data: any) {
    try {
      // Validar que el paciente esté activo
      const paciente = await this.prisma.paciente.findUnique({
        where: { idPaciente: data.Paciente_idPaciente }
      });

      if (!paciente || !paciente.Activo) {
        throw new BadRequestException('El paciente no existe o no está activo');
      }

      // Validar que el paciente no tenga reservación activa
      const reservacionExistente = await this.prisma.reservacion.findFirst({
        where: {
          Paciente_idPaciente: data.Paciente_idPaciente,
          Activo: true,
          Catalogo_Estado_Reservacion_idEstado: 1
        }
      });

      if (reservacionExistente) {
        throw new BadRequestException(
          `El paciente "${paciente.Nombre}" ya tiene una reservación activa`
        );
      }

      // Validar que la habitación esté disponible
      const habitacion = await this.prisma.habitacion.findUnique({
        where: { idHabitacion: data.Habitacion_idHabitacion }
      });

      if (!habitacion) {
        throw new BadRequestException('La habitación no existe');
      }

      if (habitacion.Catalogo_Estado_Habitacion_idEstado !== 1) {
        throw new BadRequestException(
          'La habitación no está disponible. Solo puede asignar habitaciones con estado "Disponible"'
        );
      }

      // Actualizar estado de habitación a Reservada
      await this.prisma.habitacion.update({
        where: { idHabitacion: data.Habitacion_idHabitacion },
        data: { Catalogo_Estado_Habitacion_idEstado: 2 }
      });

      const result = await this.prisma.reservacion.create({
        data: {
          ...data,
          Activo: true,
          Catalogo_Estado_Reservacion_idEstado: 1 // Siempre inicia como Activa
        },
        include: {
          Paciente: true,
          Habitacion: {
            include: { Tipo: true }
          },
          Tipo_Estancia: true,
          Estado: true,
          Empleado: true
        }
      });

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  async update(id: number, data: any) {
    try {
      const reservacionActual = await this.prisma.reservacion.findUnique({
        where: { idReservacion: id },
        include: { Habitacion: true, Paciente: true }
      });

      if (!reservacionActual) {
        throw new BadRequestException('Reservación no encontrada');
      }

      // Si se está cambiando la habitación
      if (data.Habitacion_idHabitacion && data.Habitacion_idHabitacion !== reservacionActual.Habitacion_idHabitacion) {
        // Validar que la nueva habitación esté disponible
        const nuevaHabitacion = await this.prisma.habitacion.findUnique({
          where: { idHabitacion: data.Habitacion_idHabitacion }
        });

        if (!nuevaHabitacion || nuevaHabitacion.Catalogo_Estado_Habitacion_idEstado !== 1) {
          throw new BadRequestException('La nueva habitación no está disponible');
        }

        // Liberar habitación anterior
        await this.prisma.habitacion.update({
          where: { idHabitacion: reservacionActual.Habitacion_idHabitacion },
          data: { Catalogo_Estado_Habitacion_idEstado: 1 }
        });

        // Reservar nueva habitación
        await this.prisma.habitacion.update({
          where: { idHabitacion: data.Habitacion_idHabitacion },
          data: { Catalogo_Estado_Habitacion_idEstado: 2 }
        });
      }

      // Si se está cambiando el estado de la reservación
      if (data.Catalogo_Estado_Reservacion_idEstado) {
        const nuevoEstado = data.Catalogo_Estado_Reservacion_idEstado;
        const estadoActual = reservacionActual.Catalogo_Estado_Reservacion_idEstado;

        // Si cambia de Activa a Finalizada o Cancelada, liberar habitación
        if (estadoActual === 1 && (nuevoEstado === 2 || nuevoEstado === 3)) {
          await this.prisma.habitacion.update({
            where: { idHabitacion: reservacionActual.Habitacion_idHabitacion },
            data: { Catalogo_Estado_Habitacion_idEstado: 1 }
          });
        }

        // Si cambia de Finalizada/Cancelada a Activa, validar y reservar habitación
        if ((estadoActual === 2 || estadoActual === 3) && nuevoEstado === 1) {
          const habitacion = await this.prisma.habitacion.findUnique({
            where: { idHabitacion: reservacionActual.Habitacion_idHabitacion }
          });

          if (habitacion?.Catalogo_Estado_Habitacion_idEstado !== 1) {
            throw new BadRequestException(
              'No se puede reactivar la reservación. La habitación ya no está disponible.'
            );
          }

          await this.prisma.habitacion.update({
            where: { idHabitacion: reservacionActual.Habitacion_idHabitacion },
            data: { Catalogo_Estado_Habitacion_idEstado: 2 }
          });
        }
      }

      const result = await this.prisma.reservacion.update({
        where: { idReservacion: id },
        data,
        include: {
          Paciente: true,
          Habitacion: {
            include: { Tipo: true }
          },
          Tipo_Estancia: true,
          Estado: true,
          Empleado: true
        }
      });

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error updating reservation:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const reservacion = await this.prisma.reservacion.findUnique({
        where: { idReservacion: id }
      });

      if (!reservacion) {
        throw new BadRequestException('Reservación no encontrada');
      }

      // Si la reservación está activa, liberar la habitación
      if (reservacion.Catalogo_Estado_Reservacion_idEstado === 1) {
        await this.prisma.habitacion.update({
          where: { idHabitacion: reservacion.Habitacion_idHabitacion },
          data: { Catalogo_Estado_Habitacion_idEstado: 1 }
        });
      }

      // Soft delete
      return this.prisma.reservacion.update({
        where: { idReservacion: id },
        data: { Activo: false }
      });
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error deleting reservation:', error);
      throw error;
    }
  }
}