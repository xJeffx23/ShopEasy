import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

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
      const result = await this.prisma.empleado.create({
        data: createEmployeeDto,
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
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async update(id: number, updateEmployeeDto: any) {
    try {
      const result = await this.prisma.empleado.update({
        where: { idEmpleado: id },
        data: updateEmployeeDto,
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
    try {
      const result = await this.prisma.empleado.delete({
        where: { idEmpleado: id },
      });
      return result;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  }

  async updateStatus(id: number, status: boolean) {
    try {
      const result = await this.prisma.empleado.update({
        where: { idEmpleado: id },
        data: { Activo: status },
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
      console.error('Error updating employee status:', error);
      throw error;
    }
  }
}
