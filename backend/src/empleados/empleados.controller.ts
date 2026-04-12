import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards } from '@nestjs/common';
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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  @ApiResponse({ status: 200, description: 'Empleado obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: string) {
    return this.empleadosService.findOne(parseInt(id));
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo empleado' })
  @ApiResponse({ status: 201, description: 'Empleado creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createEmployeeDto: any) {
    return this.empleadosService.create(createEmployeeDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un empleado' })
  @ApiResponse({ status: 200, description: 'Empleado actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(@Param('id') id: string, @Body() updateEmployeeDto: any) {
    return this.empleadosService.update(parseInt(id), updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un empleado' })
  @ApiResponse({ status: 200, description: 'Empleado eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: string) {
    return this.empleadosService.remove(parseInt(id));
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Cambiar estado de un empleado' })
  @ApiResponse({ status: 200, description: 'Estado del empleado actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Empleado no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  updateStatus(@Param('id') id: string, @Body() statusDto: { status: boolean }) {
    return this.empleadosService.updateStatus(parseInt(id), statusDto.status);
  }
}
