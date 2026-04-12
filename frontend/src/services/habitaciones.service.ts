import api from './api';

export interface Habitacion {
  idHabitacion: number;
  Numero_Habitacion: string;
  idCatalogo_Tipo_Habitacion: number;
  idCatalogo_Estado_Habitacion: number;
  Activo: boolean;
  Piso: number;
  Capacidad_Maxima: number;
  Tipo_Habitacion?: {
    idCatalogo_Tipo_Habitacion: number;
    Nombre_Tipo: string;
    Descripcion: string;
    Costo_Por_Dia: number;
  };
  Estado_Habitacion?: {
    idCatalogo_Estado_Habitacion: number;
    Descripcion_Estado: string;
  };
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
  }
};
