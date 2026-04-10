import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class EmpleadosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.empleado.findMany({
      where: { Activo: true },
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
}
