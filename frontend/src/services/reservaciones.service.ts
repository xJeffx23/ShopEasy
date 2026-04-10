import api from './api';

export interface Reservacion {
  idReservacion: number;
  Paciente_idPaciente: number;
  Habitacion_idHabitacion: number;
  Fecha_Inicio: string;
  Fecha_Fin: string;
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

export const reservacionesService = {
  async getAll(): Promise<Reservacion[]> {
    const response = await api.get<Reservacion[]>('/reservaciones');
    return response.data;
  },

  async getById(id: number): Promise<Reservacion> {
    const response = await api.get<Reservacion>(`/reservaciones/${id}`);
    return response.data;
  },

  async create(reservacion: Omit<Reservacion, 'idReservacion'>): Promise<Reservacion> {
    const response = await api.post<Reservacion>('/reservaciones', reservacion);
    return response.data;
  },

  async update(id: number, reservacion: Partial<Reservacion>): Promise<Reservacion> {
    const response = await api.put<Reservacion>(`/reservaciones/${id}`, reservacion);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/reservaciones/${id}`);
  }
};
