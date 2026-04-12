import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

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
      
      // Mapear y filtrar solo los campos que existen en el modelo de la base de datos
      const patientData = {
        Nombre: createPatientDto.Nombre,
        Numero_Cedula: createPatientDto.Numero_Cedula,
        Fecha_Nacimiento: createPatientDto.Fecha_Nacimiento ? new Date(createPatientDto.Fecha_Nacimiento) : new Date(),
        Fecha_Ingreso: createPatientDto.Fecha_Ingreso ? new Date(createPatientDto.Fecha_Ingreso) : new Date(),
        Telefono_Contacto_Emergencia: createPatientDto.Telefono_Contacto_Emergencia || '',
        Nombre_Contacto_Emergencia: createPatientDto.Nombre_Contacto_Emergencia || '',
        Catalogo_Nivel_Asistencia_idNivel: parseInt(createPatientDto.Catalogo_Nivel_Asistencia_idNivel) || 1,
        Activo: createPatientDto.Activo !== undefined ? createPatientDto.Activo : true,
        // Incluir datos anidados
        Medicamentos: createPatientDto.Medicamentos ? {
          create: createPatientDto.Medicamentos.map((med: any) => ({
            Nombre_Medicamento: med.Nombre_Medicamento,
            Dosis: med.Dosis,
            Frecuencia: med.Frecuencia,
            Indicaciones: med.Indicaciones,
            Activo: med.Activo
          }))
        } : undefined,
        Cuidados: createPatientDto.Cuidados ? {
          create: createPatientDto.Cuidados.map((care: any) => ({
            Detalle: care.Detalle,
            Catalogo_Cuidado_Especial_idCuidado: care.Catalogo_Cuidado_Especial_idCuidado
          }))
        } : undefined,
        Paquetes: createPatientDto.Paquetes ? {
          create: createPatientDto.Paquetes.map((pkg: any) => ({
            Fecha_Asignacion: new Date(pkg.Fecha_Asignacion),
            Activo: pkg.Activo,
            Catalogo_Paquete_idPaquete: pkg.Catalogo_Paquete_idPaquete
          }))
        } : undefined
      };

      const result = await this.prisma.paciente.create({
        data: patientData,
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
      
      // Manejo específico para error de constraint único
      if (error.code === 'P2002' && error.meta?.target?.includes('Numero_Cedula')) {
        throw new Error('Ya existe un paciente con este número de cédula');
      }
      
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
