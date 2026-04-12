import api from './api';

export interface Habitacion {
  idHabitacion: number;
  Numero_Habitacion: string;
  Piso: number;
  Capacidad: number;
  Observaciones?: string;
  Catalogo_Tipo_Habitacion_idTipo: number;
  Catalogo_Estado_Habitacion_idEstado: number;
  Tipo?: {
    idCatalogo_Tipo_Habitacion: number;
    Nombre_Tipo: string;
    Descripcion: string;
    Costo_Por_Dia: string;
    Activo: boolean;
  };
  Estado?: {
    idCatalogo_Estado_Habitacion: number;
    Descripcion_Estado: string;
    Activo: boolean;
  };
  Limpiezas?: any[];
  Mantenimientos?: any[];
  Reservaciones?: any[];
}

export const habitacionesService = {
  async getAll(): Promise<Habitacion[]> {
    const response = await api.get<Habitacion[]>('/habitaciones');
    return response.data;
  },

  async getById(id: number): Promise<Habitacion> {
    const response = await api.get<Habitacion>(`/habitaciones/${id}`);
    return response.data;
  },

  async create(habitacion: Omit<Habitacion, 'idHabitacion'>): Promise<Habitacion> {
    const response = await api.post<Habitacion>('/habitaciones', habitacion);
    return response.data;
  },

  async update(id: number, habitacion: Partial<Habitacion>): Promise<Habitacion> {
    const response = await api.put<Habitacion>(`/habitaciones/${id}`, habitacion);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/habitaciones/${id}`);
  },

  async updateStatus(id: number, statusId: number): Promise<Habitacion> {
    const response = await api.patch<Habitacion>(`/habitaciones/${id}/status`, { statusId });
    return response.data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/habitaciones/${id}`);
  }
};
