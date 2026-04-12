import { Module } from '@nestjs/common';
import { LimpiezasController } from './limpiezas.controller';
import { LimpiezasService } from './limpiezas.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LimpiezasController],
  providers: [LimpiezasService, PrismaService],
  exports: [LimpiezasService],
})
export class LimpiezasModule {}
