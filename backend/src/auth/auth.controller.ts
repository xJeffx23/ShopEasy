import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): { idUsuario: number } => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: { idUsuario: number } }>();
    return request.user;
  },
);

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login empleados
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Login pacientes
  @Post('login/paciente')
  loginPaciente(@Body() dto: LoginDto) {
    return this.authService.loginPaciente(dto);
  }

  // Cambio de contraseña (requiere estar autenticado)
  @UseGuards(JwtAuthGuard)
  @Post('cambiar-contrasena')
  cambiarContrasena(
    @CurrentUser() user: { idUsuario: number },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.cambiarContrasena(user.idUsuario, dto);
  }
}
