import { Module } from '@nestjs/common';
import { HabitacionesController } from './habitaciones.controller';
import { HabitacionesService } from './habitaciones.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [HabitacionesController],
  providers: [HabitacionesService, PrismaService],
})
export class HabitacionesModule {}
