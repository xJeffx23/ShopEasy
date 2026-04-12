import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MantenimientosService } from './mantenimientos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('mantenimientos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mantenimientos')
export class MantenimientosController {
  constructor(private readonly mantenimientosService: MantenimientosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los mantenimientos' })
  @ApiResponse({ status: 200, description: 'Lista de mantenimientos obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.mantenimientosService.findAll();
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Obtener mantenimientos por habitación' })
  @ApiResponse({ status: 200, description: 'Mantenimientos de la habitación obtenidos exitosamente' })
  @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByRoom(@Param('roomId') roomId: string) {
    return this.mantenimientosService.findByRoom(parseInt(roomId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un mantenimiento por ID' })
  @ApiResponse({ status: 200, description: 'Mantenimiento obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Mantenimiento no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.mantenimientosService.findOne(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo mantenimiento' })
  @ApiResponse({ status: 201, description: 'Mantenimiento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createMantenimientoDto: any) {
    return this.mantenimientosService.create(createMantenimientoDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un mantenimiento' })
  @ApiResponse({ status: 200, description: 'Mantenimiento actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Mantenimiento no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateMantenimientoDto: any) {
    return this.mantenimientosService.update(parseInt(id), updateMantenimientoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un mantenimiento' })
  @ApiResponse({ status: 200, description: 'Mantenimiento eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Mantenimiento no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.mantenimientosService.remove(parseInt(id));
  }
}
