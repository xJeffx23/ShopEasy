import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { Nombre_usuario: dto.Nombre_usuario },
      include: { Empleado: { include: { Perfil: true } } },
    });

    if (!usuario || !usuario.Activo)
      throw new UnauthorizedException('Credenciales inválidas');

    // Temporal: aceptar texto plano para pruebas
    const passwordValido = dto.Contrasena === usuario.Contrasena;
    if (!passwordValido)
      throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: usuario.idUsuario,
      username: usuario.Nombre_usuario,
      perfil: usuario.Empleado.Perfil.Nombre_Perfil,
      idEmpleado: usuario.Empleado_idEmpleado,
    };

    return {
      access_token: this.jwtService.sign(payload),
      Cambio_Contrasena: usuario.Cambio_Contrasena,
      perfil: usuario.Empleado.Perfil.Nombre_Perfil,
      nombre: usuario.Empleado.Nombre,
    };
  }

  async cambiarContrasena(idUsuario: number, dto: ChangePasswordDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario },
    });

    if (!usuario) throw new UnauthorizedException();

    const passwordValido = await bcrypt.compare(
      dto.contrasenaActual,
      usuario.Contrasena,
    );
    if (!passwordValido)
      throw new BadRequestException('La contraseña actual es incorrecta');

    const nuevaHash = await bcrypt.hash(dto.contrasenaNueva, 10);

    await this.prisma.usuario.update({
      where: { idUsuario },
      data: {
        Contrasena: nuevaHash,
        Cambio_Contrasena: false,
      },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }

  async loginPaciente(dto: LoginDto) {
    const usuario = await this.prisma.usuario_Paciente.findUnique({
      where: { Nombre_usuario: dto.Nombre_usuario },
      include: { Paciente: true },
    });

    if (!usuario || !usuario.Activo)
      throw new UnauthorizedException('Credenciales inválidas');

    const passwordValido = await bcrypt.compare(
      dto.Contrasena,
      usuario.Contrasena,
    );
    if (!passwordValido)
      throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: usuario.idUsuario_Paciente,
      username: usuario.Nombre_usuario,
      tipo: 'paciente',
      idPaciente: usuario.Paciente_idPaciente,
    };

    return {
      access_token: this.jwtService.sign(payload),
      Cambio_Contrasena: usuario.Cambio_Contrasena,
      nombre: usuario.Paciente.Nombre,
    };
  }
}
