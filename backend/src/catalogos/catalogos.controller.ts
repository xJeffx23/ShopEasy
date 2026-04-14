import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogosService } from './catalogos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('catalogos')
@Controller('catalogos')
export class CatalogosController {
  constructor(private readonly catalogosService: CatalogosService) {}

  @Get('tipos-estancia')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener tipos de estancia' })
  getTiposEstancia() {
    return this.catalogosService.getTiposEstancia();
  }

  @Get('tipos-habitacion')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener tipos de habitación' })
  getTiposHabitacion() {
    return this.catalogosService.getTiposHabitacion();
  }

  @Get('estados-habitacion')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estados de habitación' })
  getEstadosHabitacion() {
    return this.catalogosService.getEstadosHabitacion();
  }

  @Get('estados-reservacion')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estados de reservación' })
  getEstadosReservacion() {
    return this.catalogosService.getEstadosReservacion();
  }

  @Get('niveles-asistencia')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener niveles de asistencia' })
  getNivelesAsistencia() {
    return this.catalogosService.getNivelesAsistencia();
  }

  @Get('perfiles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfiles de usuario' })
  getPerfiles() {
    return this.catalogosService.getPerfiles();
  }
}
