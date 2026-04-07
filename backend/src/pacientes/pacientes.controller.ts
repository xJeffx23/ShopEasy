import { Controller, Get, UseGuards } from '@nestjs/common';
import { PacientesService } from './pacientes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Get()
  findAll() {
    return this.pacientesService.findAll();
  }
}
