import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('pacientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pacientes' })
  @ApiResponse({ status: 200, description: 'Lista de pacientes obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.pacientesService.findAll();
  }
}
