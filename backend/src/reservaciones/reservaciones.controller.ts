import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReservacionesService } from './reservaciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reservaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reservaciones')
export class ReservacionesController {
  constructor(private readonly reservacionesService: ReservacionesService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reservaciones' })
  @ApiResponse({ status: 200, description: 'Lista de reservaciones obtenida exitosamente' })
  findAll() {
    return this.reservacionesService.findAll();
  }

  @Get('disponibilidad')
  @ApiOperation({ summary: 'Obtener habitaciones con disponibilidad' })
  @ApiResponse({ status: 200, description: 'Lista de habitaciones con su disponibilidad' })
  getHabitacionesConDisponibilidad() {
    return this.reservacionesService.getHabitacionesConDisponibilidad();
  }

  @Get('disponibilidad/:habitacionId')
  @ApiOperation({ summary: 'Obtener disponibilidad de una habitación específica' })
  @ApiResponse({ status: 200, description: 'Disponibilidad de la habitación' })
  getDisponibilidadHabitacion(@Param('habitacionId') habitacionId: string) {
    return this.reservacionesService.getDisponibilidadHabitacion(parseInt(habitacionId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reservación por ID' })
  @ApiResponse({ status: 200, description: 'Reservación obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.reservacionesService.findOne(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reservación' })
  @ApiResponse({ status: 201, description: 'Reservación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o habitación no disponible' })
  create(@Body() createReservacionDto: any) {
    return this.reservacionesService.create(createReservacionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reservación' })
  @ApiResponse({ status: 200, description: 'Reservación actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Reservación no encontrada' })
  update(@Param('id') id: string, @Body() updateReservacionDto: any) {
    return this.reservacionesService.update(parseInt(id), updateReservacionDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de una reservación' })
  @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente' })
  updateStatus(@Param('id') id: string, @Body() statusDto: { status: number }) {
    return this.reservacionesService.update(parseInt(id), {
      Catalogo_Estado_Reservacion_idEstado: statusDto.status
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una reservación' })
  @ApiResponse({ status: 200, description: 'Reservación eliminada exitosamente' })
  remove(@Param('id') id: string) {
    return this.reservacionesService.remove(parseInt(id));
  }
}