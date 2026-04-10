import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReservacionesService } from './reservaciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reservaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservaciones')
export class ReservacionesController {
  constructor(private readonly reservacionesService: ReservacionesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reservaciones' })
  @ApiResponse({ status: 200, description: 'Lista de reservaciones obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.reservacionesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reservación por ID' })
  @ApiResponse({ status: 200, description: 'Reservación encontrada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.reservacionesService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reservación' })
  @ApiResponse({ status: 201, description: 'Reservación creada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createReservacionDto: any) {
    return this.reservacionesService.create(createReservacionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reservación' })
  @ApiResponse({ status: 200, description: 'Reservación actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateReservacionDto: any) {
    return this.reservacionesService.update(+id, updateReservacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una reservación' })
  @ApiResponse({ status: 200, description: 'Reservación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.reservacionesService.remove(+id);
  }
}
