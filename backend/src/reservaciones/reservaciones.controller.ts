import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
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
  findAll() {
    return this.reservacionesService.findAll();
  }

  @Get('pacientes-disponibles')
  @ApiOperation({ summary: 'Obtener pacientes disponibles para reservar' })
  getPacientesDisponibles() {
    return this.reservacionesService.getPacientesDisponibles();
  }

  @Get('habitaciones-disponibles')
  @ApiOperation({ summary: 'Obtener habitaciones disponibles para reservar' })
  getHabitacionesDisponibles() {
    return this.reservacionesService.getHabitacionesDisponibles();
  }

  @Get('empleados-activos')
  @ApiOperation({ summary: 'Obtener empleados activos' })
  getEmpleadosActivos() {
    return this.reservacionesService.getEmpleadosActivos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reservación por ID' })
  findOne(@Param('id') id: string) {
    return this.reservacionesService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reservación' })
  @ApiResponse({ status: 201, description: 'Reservación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  create(@Body() createReservacionDto: any) {
    return this.reservacionesService.create(createReservacionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reservación' })
  @ApiResponse({ status: 200, description: 'Reservación actualizada' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  update(@Param('id') id: string, @Body() updateReservacionDto: any) {
    return this.reservacionesService.update(+id, updateReservacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una reservación' })
  remove(@Param('id') id: string) {
    return this.reservacionesService.remove(+id);
  }
}