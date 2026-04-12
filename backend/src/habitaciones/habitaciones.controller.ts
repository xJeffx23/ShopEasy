import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una habitación por ID' })
  @ApiResponse({ status: 200, description: 'Habitación obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.habitacionesService.findOne(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva habitación' })
  @ApiResponse({ status: 201, description: 'Habitación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createRoomDto: any) {
    return this.habitacionesService.create(createRoomDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una habitación' })
  @ApiResponse({ status: 200, description: 'Habitación actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateRoomDto: any) {
    return this.habitacionesService.update(parseInt(id), updateRoomDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una habitación' })
  @ApiResponse({ status: 200, description: 'Habitación eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.habitacionesService.remove(parseInt(id));
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de una habitación' })
  @ApiResponse({ status: 200, description: 'Estado de la habitación actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  updateStatus(@Param('id') id: string, @Body() statusDto: { statusId: number }) {
    return this.habitacionesService.updateStatus(parseInt(id), statusDto.statusId);
  }
}
