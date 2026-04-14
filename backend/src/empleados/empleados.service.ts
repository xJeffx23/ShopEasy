import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.empleado.findMany({
      include: {
        Departamento: true,
        Perfil: true,
        Usuario: {
          select: {
            idUsuario: true,
            Nombre_usuario: true,
            Email: true,
            Activo: true,
            Fecha_Creacion: true,
            Cambio_Contrasena: true,
            Empleado_idEmpleado: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.empleado.findUnique({
      where: { idEmpleado: id },
      include: {
        Departamento: true,
        Perfil: true,
        Usuario: {
          select: {
            idUsuario: true,
            Nombre_usuario: true,
            Email: true,
            Activo: true,
            Fecha_Creacion: true,
            Cambio_Contrasena: true,
            Empleado_idEmpleado: true,
          },
        },
      },
    });
  }

  async create(createEmployeeDto: any) {
    try {
      console.log('Creating employee with data:', createEmployeeDto);

      // Crear el empleado
      const empleado = await this.prisma.empleado.create({
        data: {
          Nombre: createEmployeeDto.Nombre,
          Numero_Cedula: createEmployeeDto.Numero_Cedula || `EMP${Date.now()}`,
          Fecha_Ingreso: createEmployeeDto.Fecha_Ingreso ? new Date(createEmployeeDto.Fecha_Ingreso) : new Date(),
          Telefono: createEmployeeDto.Telefono || '',
          Email: createEmployeeDto.Email || '',
          Catalogo_Departamento_idDepartamento: createEmployeeDto.Catalogo_Departamento_idDepartamento || 1,
          Catalogo_Perfil_Usuario_idPerfil: createEmployeeDto.Catalogo_Perfil_Usuario_idPerfil || 4,
          Activo: createEmployeeDto.Activo !== undefined ? createEmployeeDto.Activo : true,
        },
        include: {
          Departamento: true,
          Perfil: true,
        },
      });

      // Crear usuario automáticamente
      const hashedPassword = await bcrypt.hash('123', 10);
      
      // Generar username a partir del nombre
      const nombreParts = createEmployeeDto.Nombre.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .split(' ');
      let username = nombreParts[0];
      
      // Verificar si el username ya existe
      const existingUser = await this.prisma.usuario.findFirst({
        where: { Nombre_usuario: username }
      });
      
      if (existingUser) {
        username = `${username}${Math.floor(Math.random() * 100)}`;
      }

      // Email para el usuario
      const userEmail = createEmployeeDto.Email || `${username}@patitos.cr`;

      await this.prisma.usuario.create({
        data: {
          Nombre_usuario: username,
          Contrasena: hashedPassword,
          Email: userEmail,
          Activo: true,
          Cambio_Contrasena: true,
          Fecha_Creacion: new Date(),
          Empleado_idEmpleado: empleado.idEmpleado,
        },
      });

      console.log(`Usuario creado: ${username} con contraseña: 123`);

      return this.findOne(empleado.idEmpleado);
    } catch (error) {
      console.error('Error creating employee:', error);
      
      if (error.code === 'P2002') {
        if (error.meta?.target?.includes('Numero_Cedula')) {
          throw new BadRequestException('Ya existe un empleado con este número de cédula');
        }
        if (error.meta?.target?.includes('Email')) {
          throw new BadRequestException('Ya existe un usuario con este email');
        }
        if (error.meta?.target?.includes('Nombre_usuario')) {
          throw new BadRequestException('Ya existe un usuario con este nombre de usuario');
        }
      }
      
      throw new BadRequestException(error.message || 'Error al crear empleado');
    }
  }

  async update(id: number, updateEmployeeDto: any) {
    try {
      const updateData: any = {};

      if (updateEmployeeDto.Nombre !== undefined) {
        updateData.Nombre = updateEmployeeDto.Nombre;
      }
      if (updateEmployeeDto.Numero_Cedula !== undefined) {
        updateData.Numero_Cedula = updateEmployeeDto.Numero_Cedula;
      }
      if (updateEmployeeDto.Fecha_Ingreso !== undefined) {
        updateData.Fecha_Ingreso = new Date(updateEmployeeDto.Fecha_Ingreso);
      }
      if (updateEmployeeDto.Telefono !== undefined) {
        updateData.Telefono = updateEmployeeDto.Telefono;
      }
      if (updateEmployeeDto.Email !== undefined) {
        updateData.Email = updateEmployeeDto.Email;
      }
      if (updateEmployeeDto.Catalogo_Departamento_idDepartamento !== undefined) {
        updateData.Catalogo_Departamento_idDepartamento = updateEmployeeDto.Catalogo_Departamento_idDepartamento;
      }
      if (updateEmployeeDto.Catalogo_Perfil_Usuario_idPerfil !== undefined) {
        updateData.Catalogo_Perfil_Usuario_idPerfil = updateEmployeeDto.Catalogo_Perfil_Usuario_idPerfil;
      }
      if (updateEmployeeDto.Activo !== undefined) {
        updateData.Activo = updateEmployeeDto.Activo;
      }

      const result = await this.prisma.empleado.update({
        where: { idEmpleado: id },
        data: updateData,
        include: {
          Departamento: true,
          Perfil: true,
          Usuario: {
            select: {
              idUsuario: true,
              Nombre_usuario: true,
              Email: true,
              Activo: true,
              Fecha_Creacion: true,
              Cambio_Contrasena: true,
              Empleado_idEmpleado: true,
            },
          },
        },
      });
      return result;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  async remove(id: number) {
    return this.prisma.empleado.update({
      where: { idEmpleado: id },
      data: { Activo: false },
    });
  }

  async updateStatus(id: number, activo: boolean) {
    return this.prisma.empleado.update({
      where: { idEmpleado: id },
      data: { Activo: activo },
      include: {
        Departamento: true,
        Perfil: true,
      },
    });
  }
}
