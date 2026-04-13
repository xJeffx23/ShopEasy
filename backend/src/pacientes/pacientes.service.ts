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
    try {
      // Construir objeto de datos limpio, convirtiendo fechas
      const updateData: any = {};

      if (updatePatientDto.Nombre !== undefined) {
        updateData.Nombre = updatePatientDto.Nombre;
      }

      if (updatePatientDto.Numero_Cedula !== undefined) {
        updateData.Numero_Cedula = updatePatientDto.Numero_Cedula;
      }

      if (updatePatientDto.Fecha_Nacimiento !== undefined) {
        // Convertir fecha a formato ISO-8601 DateTime
        updateData.Fecha_Nacimiento = new Date(updatePatientDto.Fecha_Nacimiento);
      }

      if (updatePatientDto.Fecha_Ingreso !== undefined) {
        updateData.Fecha_Ingreso = new Date(updatePatientDto.Fecha_Ingreso);
      }

      if (updatePatientDto.Telefono_Contacto_Emergencia !== undefined) {
        updateData.Telefono_Contacto_Emergencia = updatePatientDto.Telefono_Contacto_Emergencia;
      }

      if (updatePatientDto.Nombre_Contacto_Emergencia !== undefined) {
        updateData.Nombre_Contacto_Emergencia = updatePatientDto.Nombre_Contacto_Emergencia;
      }

      if (updatePatientDto.Catalogo_Nivel_Asistencia_idNivel !== undefined) {
        updateData.Catalogo_Nivel_Asistencia_idNivel = parseInt(updatePatientDto.Catalogo_Nivel_Asistencia_idNivel);
      }

      if (updatePatientDto.Activo !== undefined) {
        updateData.Activo = updatePatientDto.Activo;
      }

      console.log('Updating patient with data:', updateData);

      return this.prisma.paciente.update({
        where: { idPaciente: id },
        data: updateData,
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
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
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