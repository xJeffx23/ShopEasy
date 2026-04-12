import api from './api';

export interface Limpieza {
  idLimpieza_Habitacion: number;
  Fecha_Limpieza: string;
  Observaciones?: string;
  Habitacion_idHabitacion: number;
  Empleado_idEmpleado: number;
  Habitacion?: {
    idHabitacion: number;
    Numero_Habitacion: string;
  };
  Empleado?: {
    idEmpleado: number;
    Nombre: string;
  };
}

export const limpiezasService = {
  async getAll(): Promise<Limpieza[]> {
    const response = await api.get<Limpieza[]>('/limpiezas');
    return response.data;
  },

  async getByRoom(roomId: number): Promise<Limpieza[]> {
    const response = await api.get<Limpieza[]>(`/limpiezas/room/${roomId}`);
    return response.data;
  },

  async getById(id: number): Promise<Limpieza> {
    const response = await api.get<Limpieza>(`/limpiezas/${id}`);
    return response.data;
  },

  async create(limpieza: Omit<Limpieza, 'idLimpieza_Habitacion' | 'Habitacion' | 'Empleado'>): Promise<Limpieza> {
    const response = await api.post<Limpieza>('/limpiezas', limpieza);
    return response.data;
  },

  async update(id: number, limpieza: Partial<Limpieza>): Promise<Limpieza> {
    const response = await api.put<Limpieza>(`/limpiezas/${id}`, limpieza);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/limpiezas/${id}`);
  },
};
