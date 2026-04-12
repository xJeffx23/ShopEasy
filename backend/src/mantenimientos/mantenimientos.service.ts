import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MantenimientosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.mantenimiento_Habitacion.findMany({
      include: {
        Habitacion: true,
        Empleado: true,
      },
      orderBy: {
        Fecha_Mantenimiento: 'desc',
      },
    });
  }

  async findByRoom(roomId: number) {
    return this.prisma.mantenimiento_Habitacion.findMany({
      where: {
        Habitacion_idHabitacion: roomId,
      },
      include: {
        Habitacion: true,
        Empleado: true,
      },
      orderBy: {
        Fecha_Mantenimiento: 'desc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.mantenimiento_Habitacion.findUnique({
      where: { idMantenimiento_Habitacion: id },
      include: {
        Habitacion: true,
        Empleado: true,
      },
    });
  }

  async create(createMantenimientoDto: any) {
    try {
      const result = await this.prisma.mantenimiento_Habitacion.create({
        data: {
          Fecha_Mantenimiento: new Date(createMantenimientoDto.Fecha_Mantenimiento),
          Descripcion_Reparacion: createMantenimientoDto.Descripcion_Reparacion,
          Actualizacion_Mobiliario: createMantenimientoDto.Actualizacion_Mobiliario || null,
          Completado: createMantenimientoDto.Completado || false,
          Habitacion_idHabitacion: createMantenimientoDto.Habitacion_idHabitacion,
          Empleado_idEmpleado: createMantenimientoDto.Empleado_idEmpleado,
        },
        include: {
          Habitacion: true,
          Empleado: true,
        },
      });
      return result;
    } catch (error) {
      console.error('Error creating mantenimiento:', error);
      throw error;
    }
  }

  async update(id: number, updateMantenimientoDto: any) {
    try {
      const result = await this.prisma.mantenimiento_Habitacion.update({
        where: { idMantenimiento_Habitacion: id },
        data: updateMantenimientoDto,
        include: {
          Habitacion: true,
          Empleado: true,
        },
      });
      return result;
    } catch (error) {
      console.error('Error updating mantenimiento:', error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const result = await this.prisma.mantenimiento_Habitacion.delete({
        where: { idMantenimiento_Habitacion: id },
      });
      return result;
    } catch (error) {
      console.error('Error deleting mantenimiento:', error);
      throw error;
    }
  }
}
