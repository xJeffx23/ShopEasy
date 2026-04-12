import api from './api';

export interface Paciente {
  idPaciente: number;
  Nombre: string;
  Apellidos: string;
  Fecha_Nacimiento: string;
  Telefono: string;
  Email: string;
  Direccion: string;
  Activo: boolean;
  Fecha_Ingreso: string;
  Nivel_Asistencia: {
    idCatalogo_Nivel_Asistencia: number;
    Descripcion_Nivel: string;
  };
}

export const pacientesService = {
  async getAll(): Promise<Paciente[]> {
    const response = await api.get<Paciente[]>('/pacientes');
    return response.data;
  },

  async getById(id: number): Promise<Paciente> {
    const response = await api.get<Paciente>(`/pacientes/${id}`);
    return response.data;
  },

  async create(paciente: Omit<Paciente, 'idPaciente'>): Promise<Paciente> {
    const response = await api.post<Paciente>('/pacientes', paciente);
    return response.data;
  },

  async update(id: number, paciente: Partial<Paciente>): Promise<Paciente> {
    const response = await api.put<Paciente>(`/pacientes/${id}`, paciente);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/pacientes/${id}`);
  }
};
