import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('reportes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
    constructor(private readonly reportesService: ReportesService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Obtener datos del dashboard' })
    @ApiResponse({ status: 200, description: 'Datos del dashboard obtenidos exitosamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    getDashboard() {
        return this.reportesService.getDashboardData();
    }

    @Get()
    @ApiOperation({ summary: 'Obtener datos de reportes completos' })
    @ApiResponse({ status: 200, description: 'Datos de reportes obtenidos exitosamente' })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    getReports() {
        return this.reportesService.getReportsData();
    }
}