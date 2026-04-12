import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LimpiezasService } from './limpiezas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('limpiezas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('limpiezas')
export class LimpiezasController {
  constructor(private readonly limpiezasService: LimpiezasService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las limpiezas' })
  @ApiResponse({ status: 200, description: 'Lista de limpiezas obtenida exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.limpiezasService.findAll();
  }

  @Get('room/:roomId')
  @ApiOperation({ summary: 'Obtener limpiezas por habitación' })
  @ApiResponse({ status: 200, description: 'Limpiezas de la habitación obtenidas exitosamente' })
  @ApiResponse({ status: 404, description: 'Habitación no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findByRoom(@Param('roomId') roomId: string) {
    return this.limpiezasService.findByRoom(parseInt(roomId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una limpieza por ID' })
  @ApiResponse({ status: 200, description: 'Limpieza obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Limpieza no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.limpiezasService.findOne(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva limpieza' })
  @ApiResponse({ status: 201, description: 'Limpieza creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createLimpiezaDto: any) {
    return this.limpiezasService.create(createLimpiezaDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una limpieza' })
  @ApiResponse({ status: 200, description: 'Limpieza actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Limpieza no encontrada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateLimpiezaDto: any) {
    return this.limpiezasService.update(parseInt(id), updateLimpiezaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una limpieza' })
  @ApiResponse({ status: 200, description: 'Limpieza eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Limpieza no encontrada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.limpiezasService.remove(parseInt(id));
  }
}
