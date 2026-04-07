import { Controller, Get, UseGuards } from '@nestjs/common';
import { HabitacionesService } from './habitaciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('habitaciones')
export class HabitacionesController {
  constructor(private readonly habitacionesService: HabitacionesService) {}

  @Get()
  findAll() {
    return this.habitacionesService.findAll();
  }
}
