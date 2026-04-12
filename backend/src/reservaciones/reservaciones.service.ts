import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ReservacionesService {
  constructor(private prisma: PrismaService) {}

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

  async create(data: any) {
    try {
      console.log('Creating reservation with data:', data);
      
      // Sincronización simple: actualizar estado de habitación directamente
      if (data.Catalogo_Estado_Reservacion_idEstado === 1) { // Activa
        await this.prisma.habitacion.update({
          where: { idHabitacion: data.Habitacion_idHabitacion },
          data: { Catalogo_Estado_Habitacion_idEstado: 2 } // Reservada
        });
      }
      
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
      
      return result;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  }

  async update(id: number, data: any) {
    try {
      // Sincronización simple: actualizar estado de habitación según estado de reservación
      if (data.Catalogo_Estado_Reservacion_idEstado) {
        const reservation = await this.prisma.reservacion.findUnique({
          where: { idReservacion: id },
          select: { Habitacion_idHabitacion: true }
        });
        
        if (reservation) {
          let roomStatusId: number;
          switch (data.Catalogo_Estado_Reservacion_idEstado) {
            case 1: // Activa
              roomStatusId = 2; // Reservada
              break;
            case 2: // Finalizada
            case 3: // Cancelada
              roomStatusId = 1; // Disponible
              break;
            default:
              roomStatusId = 1; // Disponible
          }
          
          await this.prisma.habitacion.update({
            where: { idHabitacion: reservation.Habitacion_idHabitacion },
            data: { Catalogo_Estado_Habitacion_idEstado: roomStatusId }
          });
        }
      }
      
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

      return result;
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  }

  async remove(id: number) {
    return this.prisma.reservacion.delete({
      where: { idReservacion: id }
    });
  }
}
