import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HabitacionesService } from './habitaciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('habitaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('habitaciones')
export class HabitacionesController {
  constructor(private readonly habitacionesService: HabitacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las habitaciones' })
  @ApiResponse({ status: 200, description: 'Lista de habitaciones obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.habitacionesService.findAll();
  }
}
