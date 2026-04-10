import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReservacionesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.reservacion.findMany({
      include: {
        Paciente: true,
        Habitacion: true
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.reservacion.findUnique({
      where: { idReservacion: id },
      include: {
        Paciente: true,
        Habitacion: true
      }
    });
  }

  async create(data: any) {
    try {
      console.log('Creating reservation with data:', data);
      
      // Usar directamente los datos del frontend - ya vienen formateados correctamente
      const result = await this.prisma.reservacion.create({
        data: data,
        include: {
          Paciente: true,
          Habitacion: true
        }
      });
      return result;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  async update(id: number, data: any) {
    return this.prisma.reservacion.update({
      where: { idReservacion: id },
      data,
      include: {
        Paciente: true,
        Habitacion: true
      }
    });
  }

  async remove(id: number) {
    return this.prisma.reservacion.delete({
      where: { idReservacion: id }
    });
  }
}
