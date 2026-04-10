import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EmpleadosService } from './empleados.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('empleados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los empleados' })
  @ApiResponse({ status: 200, description: 'Lista de empleados obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.empleadosService.findAll();
  }
}
