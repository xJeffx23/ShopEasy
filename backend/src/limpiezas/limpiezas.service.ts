import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LimpiezasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.limpieza_Habitacion.findMany({
      include: {
        Habitacion: true,
        Empleado: true,
      },
      orderBy: {
        Fecha_Limpieza: 'desc',
      },
    });
  }

  async findByRoom(roomId: number) {
    return this.prisma.limpieza_Habitacion.findMany({
      where: {
        Habitacion_idHabitacion: roomId,
      },
      include: {
        Habitacion: true,
        Empleado: true,
      },
      orderBy: {
        Fecha_Limpieza: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.limpieza_Habitacion.findUnique({
      where: { idLimpieza_Habitacion: id },
      include: {
        Habitacion: true,
        Empleado: true,
      },
    });
  }

  async create(createLimpiezaDto: any) {
    try {
      const result = await this.prisma.limpieza_Habitacion.create({
        data: {
          Fecha_Limpieza: new Date(createLimpiezaDto.Fecha_Limpieza),
          Observaciones: createLimpiezaDto.Observaciones || null,
          Habitacion_idHabitacion: createLimpiezaDto.Habitacion_idHabitacion,
          Empleado_idEmpleado: createLimpiezaDto.Empleado_idEmpleado,
        },
        include: {
          Habitacion: true,
          Empleado: true,
        },
      });
      return result;
    } catch (error) {
      console.error('Error creating limpieza:', error);
      throw error;
    }
  }

  async update(id: number, updateLimpiezaDto: any) {
    try {
      const result = await this.prisma.limpieza_Habitacion.update({
        where: { idLimpieza_Habitacion: id },
        data: updateLimpiezaDto,
        include: {
          Habitacion: true,
          Empleado: true,
        },
      });
      return result;
    } catch (error) {
      console.error('Error updating limpieza:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.prisma.limpieza_Habitacion.delete({
        where: { idLimpieza_Habitacion: id },
      });
      return result;
    } catch (error) {
      console.error('Error deleting limpieza:', error);
      throw error;
    }
  }
}
