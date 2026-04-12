import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HabitacionesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.habitacion.findMany({
      include: {
        Tipo: true,
        Estado: true,
        Limpiezas: {
          include: { Empleado: true },
          orderBy: { Fecha_Limpieza: 'desc' },
          take: 5,
        },
        Mantenimientos: {
          include: { Empleado: true },
          orderBy: { Fecha_Mantenimiento: 'desc' },
          take: 5,
        },
        Reservaciones: {
          where: { Activo: true, Catalogo_Estado_Reservacion_idEstado: 1 },
          include: { Paciente: true },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.habitacion.findUnique({
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
          where: { Activo: true },
          include: { Paciente: true },
        },
      },
    });
  }

  // Verificar si la habitación tiene reservación activa
  private async tieneReservacionActiva(idHabitacion: number): Promise<{ tiene: boolean; paciente?: string }> {
    const reservacion = await this.prisma.reservacion.findFirst({
      where: {
        Habitacion_idHabitacion: idHabitacion,
        Activo: true,
        Catalogo_Estado_Reservacion_idEstado: 1,
      },
      include: { Paciente: true },
    });

    return {
      tiene: !!reservacion,
      paciente: reservacion?.Paciente?.Nombre,
    };
  }

  async create(createRoomDto: any) {
    try {
      const data = {
        ...createRoomDto,
        Catalogo_Estado_Habitacion_idEstado: 1,
      };

      const result = await this.prisma.habitacion.create({
        data,
        include: {
          Tipo: true,
          Estado: true,
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
      if (updateRoomDto.Catalogo_Estado_Habitacion_idEstado) {
        await this.validarCambioEstado(id, updateRoomDto.Catalogo_Estado_Habitacion_idEstado);
      }

      const result = await this.prisma.habitacion.update({
        where: { idHabitacion: id },
        data: updateRoomDto,
        include: {
          Tipo: true,
          Estado: true,
          Reservaciones: {
            where: { Activo: true, Catalogo_Estado_Reservacion_idEstado: 1 },
            include: { Paciente: true },
          },
        },
      });
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error updating room:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const { tiene, paciente } = await this.tieneReservacionActiva(id);
      if (tiene) {
        throw new BadRequestException(
          `No se puede eliminar la habitación. El paciente "${paciente}" tiene una reservación activa.`
        );
      }

      const tieneHistorial = await this.prisma.reservacion.findFirst({
        where: { Habitacion_idHabitacion: id },
      });

      if (tieneHistorial) {
        throw new BadRequestException(
          'No se puede eliminar la habitación porque tiene historial de reservaciones.'
        );
      }

      const result = await this.prisma.habitacion.delete({
        where: { idHabitacion: id },
      });
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  async updateStatus(id: number, statusId: number) {
    try {
      await this.validarCambioEstado(id, statusId);

      const result = await this.prisma.habitacion.update({
        where: { idHabitacion: id },
        data: { Catalogo_Estado_Habitacion_idEstado: statusId },
        include: {
          Tipo: true,
          Estado: true,
          Reservaciones: {
            where: { Activo: true, Catalogo_Estado_Reservacion_idEstado: 1 },
            include: { Paciente: true },
          },
        },
      });
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error updating room status:', error);
      throw error;
    }
  }

  private async validarCambioEstado(idHabitacion: number, nuevoEstado: number) {
    const { tiene, paciente } = await this.tieneReservacionActiva(idHabitacion);
    const habitacion = await this.prisma.habitacion.findUnique({
      where: { idHabitacion },
    });

    if (!habitacion) {
      throw new BadRequestException('Habitación no encontrada');
    }

    const estadoActual = habitacion.Catalogo_Estado_Habitacion_idEstado;

    switch (nuevoEstado) {
      case 1: // Disponible
        if (tiene) {
          throw new BadRequestException(
            `No se puede marcar como disponible. El paciente "${paciente}" tiene una reservación activa.`
          );
        }
        break;

      case 2: // Reservada
        if (estadoActual !== 2) {
          throw new BadRequestException(
            'Para reservar una habitación, debe crear una reservación desde el módulo de Reservaciones.'
          );
        }
        break;

      case 3: // Mantenimiento
        if (tiene) {
          throw new BadRequestException(
            `No se puede poner en mantenimiento. El paciente "${paciente}" está hospedado.`
          );
        }
        break;

      case 4: // Cerrada
        if (tiene) {
          throw new BadRequestException(
            `No se puede cerrar la habitación. El paciente "${paciente}" está hospedado.`
          );
        }
        break;

      default:
        throw new BadRequestException('Estado de habitación no válido');
    }
  }

  async findDisponibles() {
    return this.prisma.habitacion.findMany({
      where: {
        Catalogo_Estado_Habitacion_idEstado: 1,
      },
      include: {
        Tipo: true,
      },
    });
  }
}