import { Module } from '@nestjs/common';
import { MantenimientosController } from './mantenimientos.controller';
import { MantenimientosService } from './mantenimientos.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [MantenimientosController],
  providers: [MantenimientosService, PrismaService],
  exports: [MantenimientosService],
})
export class MantenimientosModule {}
