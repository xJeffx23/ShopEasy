import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { HabitacionesModule } from './habitaciones/habitaciones.module';
import { ReservacionesModule } from './reservaciones/reservaciones.module';
import { ReportesModule } from './reportes/reportes.module';
import { CatalogosModule } from './catalogos/catalogos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsuariosModule,
    EmpleadosModule,
    PacientesModule,
    HabitacionesModule,
    ReservacionesModule,
    ReportesModule,
    CatalogosModule,
  ],
})
export class AppModule { }