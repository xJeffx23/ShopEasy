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
}
