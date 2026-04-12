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
    Costo_Por_Dia: number;
  };
  Estado?: {
    idCatalogo_Estado_Habitacion: number;
    Descripcion_Estado: string;
  };
}

export interface CreateHabitacionDto {
  Numero_Habitacion: string;
  Piso: number;
  Capacidad: number;
  Observaciones?: string;
  Catalogo_Tipo_Habitacion_idTipo: number;
  Catalogo_Estado_Habitacion_idEstado: number;
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

  async create(habitacion: CreateHabitacionDto): Promise<Habitacion> {
    const response = await api.post<Habitacion>('/habitaciones', habitacion);
    return response.data;
  },

  async update(id: number, habitacion: Partial<CreateHabitacionDto>): Promise<Habitacion> {
    const response = await api.put<Habitacion>(`/habitaciones/${id}`, habitacion);
    return response.data;
  },

  async updateStatus(id: number, statusId: number): Promise<Habitacion> {
    const response = await api.patch<Habitacion>(`/habitaciones/${id}/status`, { statusId });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/habitaciones/${id}`);
  }
};