import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class HabitacionesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.habitacion.findMany({
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

  async create(createRoomDto: any) {
    try {
      const result = await this.prisma.habitacion.create({
        data: createRoomDto,
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
      const result = await this.prisma.habitacion.update({
        where: { idHabitacion: id },
        data: updateRoomDto,
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
      console.error('Error updating room:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.prisma.habitacion.delete({
        where: { idHabitacion: id },
      });
      return result;
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }

  async updateStatus(id: number, statusId: number) {
    try {
      const result = await this.prisma.habitacion.update({
        where: { idHabitacion: id },
        data: { Catalogo_Estado_Habitacion_idEstado: statusId },
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
      console.error('Error updating room status:', error);
      throw error;
    }
  }
}
