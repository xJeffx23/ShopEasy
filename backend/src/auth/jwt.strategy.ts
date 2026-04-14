import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma.service';

interface JwtPayload {
  sub: number;
  username: string;
  tipo?: string;        // 'paciente' o 'empleado'
  perfil?: string;      // Para empleados
  idEmpleado?: number;  // Para empleados
  idPaciente?: number;  // Para pacientes
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'shopEasy-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    // Si es paciente
    if (payload.tipo === 'paciente') {
      const usuarioPaciente = await this.prisma.usuario_Paciente.findUnique({
        where: { idUsuario_Paciente: payload.sub },
        include: { Paciente: true },
      });

      if (!usuarioPaciente) {
        throw new UnauthorizedException('Usuario paciente no encontrado');
      }

      return {
        idUsuario: usuarioPaciente.idUsuario_Paciente,
        Nombre_usuario: usuarioPaciente.Nombre_usuario,
        tipo: 'paciente',
        idPaciente: usuarioPaciente.Paciente_idPaciente,
        nombrePaciente: usuarioPaciente.Paciente?.Nombre,
      };
    }

    // Si es empleado (comportamiento original)
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario: payload.sub },
      include: { Empleado: { include: { Perfil: true } } },
    });

    if (!usuario || !usuario.Activo) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    return {
      idUsuario: usuario.idUsuario,
      Nombre_usuario: usuario.Nombre_usuario,
      Cambio_Contrasena: usuario.Cambio_Contrasena,
      tipo: 'empleado',
      perfil: usuario.Empleado?.Perfil?.Nombre_Perfil,
      idEmpleado: usuario.Empleado_idEmpleado,
    };
  }
}
