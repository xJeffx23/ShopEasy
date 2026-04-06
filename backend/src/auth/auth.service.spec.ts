import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
  usuario: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  usuario_Paciente: {
    findUnique: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock_token_jwt'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ─── LOGIN EMPLEADO ───────────────────────────────────

  describe('login()', () => {
    it('debe retornar token cuando credenciales son válidas', async () => {
      const passwordHash = await bcrypt.hash('123456', 10);

      mockPrismaService.usuario.findUnique.mockResolvedValue({
        idUsuario: 1,
        Nombre_usuario: 'admin',
        Contrasena: passwordHash,
        Activo: true,
        Cambio_Contrasena: false,
        Empleado_idEmpleado: 1,
        Empleado: {
          Nombre: 'Administrador',
          Perfil: { Nombre_Perfil: 'Gerencia' },
        },
      });

      const result = await service.login({
        Nombre_usuario: 'admin',
        Contrasena: '123456',
      });

      expect(result.access_token).toBe('mock_token_jwt');
      expect(result.perfil).toBe('Gerencia');
      expect(result.nombre).toBe('Administrador');
    });

    it('debe lanzar UnauthorizedException si usuario no existe', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ Nombre_usuario: 'noexiste', Contrasena: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException si contraseña es incorrecta', async () => {
      const passwordHash = await bcrypt.hash('correcta', 10);

      mockPrismaService.usuario.findUnique.mockResolvedValue({
        idUsuario: 1,
        Nombre_usuario: 'admin',
        Contrasena: passwordHash,
        Activo: true,
        Empleado: { Nombre: 'Admin', Perfil: { Nombre_Perfil: 'Gerencia' } },
      });

      await expect(
        service.login({ Nombre_usuario: 'admin', Contrasena: 'incorrecta' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException si usuario está inactivo', async () => {
      mockPrismaService.usuario.findUnique.mockResolvedValue({
        idUsuario: 1,
        Nombre_usuario: 'admin',
        Activo: false,
      });

      await expect(
        service.login({ Nombre_usuario: 'admin', Contrasena: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── CAMBIO DE CONTRASEÑA ─────────────────────────────

  describe('cambiarContrasena()', () => {
    it('debe cambiar contraseña correctamente', async () => {
      const passwordHash = await bcrypt.hash('actual123', 10);

      mockPrismaService.usuario.findUnique.mockResolvedValue({
        idUsuario: 1,
        Contrasena: passwordHash,
      });
      mockPrismaService.usuario.update.mockResolvedValue({});

      const result: { message: string } = await service.cambiarContrasena(1, {
        contrasenaActual: 'actual123',
        contrasenaNueva: 'nueva456',
      });

      expect(result.message).toBe('Contraseña actualizada correctamente');
      expect(mockPrismaService.usuario.update).toHaveBeenCalledWith({
        where: { idUsuario: 1 },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        data: expect.objectContaining({ Cambio_Contrasena: false }),
      });
    });

    it('debe lanzar BadRequestException si contraseña actual es incorrecta', async () => {
      const passwordHash = await bcrypt.hash('correcta', 10);

      mockPrismaService.usuario.findUnique.mockResolvedValue({
        idUsuario: 1,
        Contrasena: passwordHash,
      });

      await expect(
        service.cambiarContrasena(1, {
          contrasenaActual: 'incorrecta',
          contrasenaNueva: 'nueva456',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── LOGIN PACIENTE ───────────────────────────────────

  describe('loginPaciente()', () => {
    it('debe retornar token para paciente válido', async () => {
      const passwordHash = await bcrypt.hash('pass123', 10);

      mockPrismaService.usuario_Paciente.findUnique.mockResolvedValue({
        idUsuario_Paciente: 1,
        Nombre_usuario: 'paciente01',
        Contrasena: passwordHash,
        Activo: true,
        Cambio_Contrasena: false,
        Paciente_idPaciente: 5,
        Paciente: { Nombre: 'Juan Pérez' },
      });

      const result = await service.loginPaciente({
        Nombre_usuario: 'paciente01',
        Contrasena: 'pass123',
      });

      expect(result.access_token).toBe('mock_token_jwt');
      expect(result.nombre).toBe('Juan Pérez');
    });

    it('debe lanzar UnauthorizedException si paciente no existe', async () => {
      mockPrismaService.usuario_Paciente.findUnique.mockResolvedValue(null);

      await expect(
        service.loginPaciente({
          Nombre_usuario: 'noexiste',
          Contrasena: '123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
