import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) { }

  async findAll() {
    return this.prisma.paciente.findMany({
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

  async findOne(id: number) {
    return this.prisma.paciente.findUnique({
      where: { idPaciente: id },
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

  async create(createPatientDto: any) {
    try {
      console.log('Creating patient with data:', createPatientDto);

      // Usar directamente los datos del frontend - ya vienen formateados correctamente
      const result = await this.prisma.paciente.create({
        data: createPatientDto,
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
      return result;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  async update(id: number, updatePatientDto: any) {
    return this.prisma.paciente.update({
      where: { idPaciente: id },
      data: updatePatientDto,
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

  async remove(id: number) {
    return this.prisma.paciente.delete({
      where: { idPaciente: id },
    });
  }

  async updateStatus(id: number, status: boolean) {
    return this.prisma.paciente.update({
      where: { idPaciente: id },
      data: { Activo: status },
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
