import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) { }

  // Helper para parsear fechas en varios formatos
  private parseDate(dateValue: any): Date {
    if (!dateValue) return new Date();
    
    // Si ya es un Date válido
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      return dateValue;
    }
    
    const dateString = String(dateValue);
    
    // Formato DD/MM/YYYY
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const parsed = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(parsed.getTime())) return parsed;
    }
    
    // Formato ISO o YYYY-MM-DD
    const isoDate = new Date(dateString);
    if (!isNaN(isoDate.getTime())) return isoDate;
    
    // Fallback
    return new Date();
  }

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

      const patientData = {
        Nombre: createPatientDto.Nombre,
        Numero_Cedula: createPatientDto.Numero_Cedula,
        Fecha_Nacimiento: this.parseDate(createPatientDto.Fecha_Nacimiento),
        Fecha_Ingreso: this.parseDate(createPatientDto.Fecha_Ingreso),
        Telefono_Contacto_Emergencia: createPatientDto.Telefono_Contacto_Emergencia || '',
        Nombre_Contacto_Emergencia: createPatientDto.Nombre_Contacto_Emergencia || '',
        Catalogo_Nivel_Asistencia_idNivel: parseInt(createPatientDto.Catalogo_Nivel_Asistencia_idNivel) || 1,
        Activo: createPatientDto.Activo !== undefined ? createPatientDto.Activo : true,
        Medicamentos: createPatientDto.Medicamentos?.length ? {
          create: createPatientDto.Medicamentos.map((med: any) => ({
            Nombre_Medicamento: med.Nombre_Medicamento,
            Dosis: med.Dosis,
            Frecuencia: med.Frecuencia,
            Indicaciones: med.Indicaciones,
            Activo: med.Activo
          }))
        } : undefined,
        Cuidados: createPatientDto.Cuidados?.length ? {
          create: createPatientDto.Cuidados.map((care: any) => ({
            Detalle: care.Detalle,
            Catalogo_Cuidado_Especial_idCuidado: care.Catalogo_Cuidado_Especial_idCuidado
          }))
        } : undefined,
        Paquetes: createPatientDto.Paquetes?.length ? {
          create: createPatientDto.Paquetes.map((pkg: any) => ({
            Fecha_Asignacion: new Date(pkg.Fecha_Asignacion),
            Activo: pkg.Activo,
            Catalogo_Paquete_idPaquete: pkg.Catalogo_Paquete_idPaquete
          }))
        } : undefined
      };

      const paciente = await this.prisma.paciente.create({
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

      // Crear usuario automáticamente para el paciente
      try {
        const hashedPassword = await bcrypt.hash('123', 10);
        
        // Generar username a partir del nombre
        const nombreParts = paciente.Nombre.toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s]/g, '')
          .split(' ')
          .filter(p => p.length > 0);
        
        let username = nombreParts[0] || 'paciente';
        
        // Verificar si el username ya existe
        const existingUser = await this.prisma.usuario_Paciente.findFirst({
          where: { Nombre_usuario: username }
        });
        
        if (existingUser) {
          username = `${username}${Math.floor(Math.random() * 100)}`;
        }

        const email = `${username}@patitos.cr`;

        await this.prisma.usuario_Paciente.create({
          data: {
            Nombre_usuario: username,
            Contrasena: hashedPassword,
            Email: email,
            Cambio_Contrasena: true,
            Paciente_idPaciente: paciente.idPaciente,
          },
        });

        console.log(`Usuario de paciente creado: ${username} con contraseña: 123`);
      } catch (userError) {
        console.error('Error creating patient user:', userError);
        // No fallar si no se puede crear el usuario
      }

      return paciente;
    } catch (error) {
      console.error('Error creating patient:', error);

      if (error.code === 'P2002' && error.meta?.target?.includes('Numero_Cedula')) {
        throw new BadRequestException('Ya existe un paciente con este número de cédula');
      }

      throw new BadRequestException(error.message || 'Error al crear paciente');
    }
  }

  async update(id: number, updatePatientDto: any) {
    try {
      const updateData: any = {};

      if (updatePatientDto.Nombre !== undefined) {
        updateData.Nombre = updatePatientDto.Nombre;
      }
      if (updatePatientDto.Numero_Cedula !== undefined) {
        updateData.Numero_Cedula = updatePatientDto.Numero_Cedula;
      }
      if (updatePatientDto.Fecha_Nacimiento !== undefined) {
        updateData.Fecha_Nacimiento = this.parseDate(updatePatientDto.Fecha_Nacimiento);
      }
      if (updatePatientDto.Fecha_Ingreso !== undefined) {
        updateData.Fecha_Ingreso = this.parseDate(updatePatientDto.Fecha_Ingreso);
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
    // Soft delete
    return this.prisma.paciente.update({
      where: { idPaciente: id },
      data: { Activo: false },
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
