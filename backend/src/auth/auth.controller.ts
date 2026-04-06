import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

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
    cambiarContrasena(@Request() req, @Body() dto: ChangePasswordDto) {
        return this.authService.cambiarContrasena(req.user.idUsuario, dto);
    }
}