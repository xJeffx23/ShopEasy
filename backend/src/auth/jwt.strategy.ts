import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'patitos_secret',
        });
    }

    async validate(payload: any) {
        const usuario = await this.prisma.usuario.findUnique({
            where: { idUsuario: payload.sub },
            include: { Empleado: { include: { Perfil: true } } },
        });
        if (!usuario || !usuario.Activo) throw new UnauthorizedException();
        return {
            idUsuario: usuario.idUsuario,
            Nombre_usuario: usuario.Nombre_usuario,
            Cambio_Contrasena: usuario.Cambio_Contrasena,
            perfil: usuario.Empleado.Perfil.Nombre_Perfil,
            idEmpleado: usuario.Empleado_idEmpleado,
        };
    }
}