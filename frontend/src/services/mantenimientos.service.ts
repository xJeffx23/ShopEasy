import api from './api';

export interface Mantenimiento {
  idMantenimiento_Habitacion: number;
  Fecha_Mantenimiento: string;
  Descripcion_Reparacion: string;
  Actualizacion_Mobiliario?: string;
  Completado: boolean;
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

export const mantenimientosService = {
  async getAll(): Promise<Mantenimiento[]> {
    const response = await api.get<Mantenimiento[]>('/mantenimientos');
    return response.data;
  },

  async getByRoom(roomId: number): Promise<Mantenimiento[]> {
    const response = await api.get<Mantenimiento[]>(`/mantenimientos/room/${roomId}`);
    return response.data;
  },

  async getById(id: number): Promise<Mantenimiento> {
    const response = await api.get<Mantenimiento>(`/mantenimientos/${id}`);
    return response.data;
  },

  async create(mantenimiento: Omit<Mantenimiento, 'idMantenimiento_Habitacion' | 'Habitacion' | 'Empleado'>): Promise<Mantenimiento> {
    const response = await api.post<Mantenimiento>('/mantenimientos', mantenimiento);
    return response.data;
  },

  async update(id: number, mantenimiento: Partial<Mantenimiento>): Promise<Mantenimiento> {
    const response = await api.put<Mantenimiento>(`/mantenimientos/${id}`, mantenimiento);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/mantenimientos/${id}`);
  },
};
