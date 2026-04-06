import { Module } from '@nestjs/common';
import { ReservacionesController } from './reservaciones.controller';
import { ReservacionesService } from './reservaciones.service';

@Module({
  controllers: [ReservacionesController],
  providers: [ReservacionesService]
})
export class ReservacionesModule {}
