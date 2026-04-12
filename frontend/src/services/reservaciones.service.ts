import api from './api';

export interface Reservacion {
  idReservacion: number;
  Paciente_idPaciente: number;
  Habitacion_idHabitacion: number;
  Fecha_Inicio: string;
  Fecha_Fin: string | null;
  Indefinido: boolean;
  Observaciones: string | null;
  Fecha_Registro: string;
  Activo: boolean;
  Catalogo_Tipo_Estancia_idEstancia: number;
  idCatalogo_Estado_Reservacion: number;
  Empleado_idEmpleado_Registra: number;
  Paciente?: {
    idPaciente: number;
    Nombre: string;
    Apellidos: string;
  };
  Habitacion?: {
    idHabitacion: number;
    Numero_Habitacion: string;
    Tipo?: {
      idCatalogo_Tipo_Habitacion: number;
      Descripcion_Tipo: string;
    };
  };
  Tipo_Estancia?: {
    idCatalogo_Tipo_Estancia: number;
    Descripcion_Estancia: string;
    Hora_Inicio: string;
    Hora_Fin: string;
  };
  Estado?: {
    idCatalogo_Estado_Reservacion: number;
    Descripcion_Estado: string;
  };
  Empleado_Registra?: {
    idEmpleado: number;
    Nombre: string;
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
    const response = await api.patch<Reservacion>(`/reservaciones/${id}`, reservacion);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/reservaciones/${id}`);
  }
};
