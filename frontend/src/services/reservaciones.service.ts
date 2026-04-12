import api from './api';

export interface Reservacion {
  idReservacion: number;
  Paciente_idPaciente: number;
  Habitacion_idHabitacion: number;
  Fecha_Inicio: string;
  Fecha_Fin: string | null;
  idCatalogo_Estado_Reservacion: number;
  Costo_Total: number;
  Activo: boolean;
  Paciente?: {
    idPaciente: number;
    Nombre: string;
    Apellidos: string;
  };
  Habitacion?: {
    idHabitacion: number;
    Numero_Habitacion: string;
  };
  Estado_Reservacion?: {
    idCatalogo_Estado_Reservacion: number;
    Descripcion_Estado: string;
  };
}

export interface CreateReservacionDto {
  Paciente_idPaciente: number;
  Habitacion_idHabitacion: number;
  Fecha_Inicio: string;
  Fecha_Fin?: string | null;
  Catalogo_Tipo_Estancia_idEstancia?: number;
  Catalogo_Estado_Reservacion_idEstado?: number;
  Empleado_idEmpleado_Registra?: number;
  Costo_Total?: number;
  Activo?: boolean;
}

export const reservacionesService = {
  async getAll(): Promise<Reservacion[]> {
    const response = await api.get<Reservacion[]>('/reservaciones');
    return response.data;
  },

  async getById(id: number): Promise<Reservacion> {
    const response = await api.get<Reservacion>(`/reservaciones/${id}`);
    return response.data;
  },

  async create(reservacion: CreateReservacionDto): Promise<Reservacion> {
    const response = await api.post<Reservacion>('/reservaciones', reservacion);
    return response.data;
  },

  async update(id: number, reservacion: Partial<CreateReservacionDto>): Promise<Reservacion> {
    const response = await api.patch<Reservacion>(`/reservaciones/${id}`, reservacion);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/reservaciones/${id}`);
  }
};