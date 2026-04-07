import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.paciente.findMany({
      where: { Activo: true },
      include: {
        Nivel_Asistencia: true,
        Medicamentos: { where: { Activo: true } },
        Cuidados: { include: { Tipo_Cuidado: true } },
        Paquetes: {
          where: { Activo: true },
          include: { Paquete: true },
        },
        Reservaciones: {
          where: { Activo: true },
          include: { Habitacion: true },
        },
      },
    });
  }
}
