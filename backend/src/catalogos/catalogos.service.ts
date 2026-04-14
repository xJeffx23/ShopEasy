import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CatalogosService {
  constructor(private prisma: PrismaService) {}

  // Tipos de Estancia
  async getTiposEstancia() {
    return this.prisma.catalogo_Tipo_Estancia.findMany({
      where: { Activo: true }
    });
  }

  // Tipos de Habitación
  async getTiposHabitacion() {
    return this.prisma.catalogo_Tipo_Habitacion.findMany({
      where: { Activo: true }
    });
  }

  // Estados de Habitación
  async getEstadosHabitacion() {
    return this.prisma.catalogo_Estado_Habitacion.findMany();
  }

  // Estados de Reservación
  async getEstadosReservacion() {
    return this.prisma.catalogo_Estado_Reservacion.findMany({
      where: { Activo: true }
    });
  }

  // Niveles de Asistencia
  async getNivelesAsistencia() {
    return this.prisma.catalogo_Nivel_Asistencia.findMany({
      where: { Activo: true }
    });
  }

  // Perfiles de Usuario
  async getPerfiles() {
    return this.prisma.catalogo_Perfil_Usuario.findMany({
      where: { Activo: true }
    });
  }
}
