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
  Numero_Cedula?: string;
  Telefono_Contacto_Emergencia?: string;
  Nombre_Contacto_Emergencia?: string;
  Catalogo_Nivel_Asistencia_idNivel?: number;
  Cuidados_Especial?: any[];
  Medicamentos?: any[];
  Nivel_Asistencia?: {
    idCatalogo_Nivel_Asistencia: number;
    Descripcion_Nivel: string;
  };
}

export interface CreatePacienteDto {
  Nombre: string;
  Apellidos?: string;
  Fecha_Nacimiento: string;
  Telefono?: string;
  Email?: string;
  Direccion?: string;
  Activo: boolean;
  Fecha_Ingreso: string;
  Numero_Cedula?: string;
  Telefono_Contacto_Emergencia?: string;
  Nombre_Contacto_Emergencia?: string;
  Catalogo_Nivel_Asistencia_idNivel?: number;
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

  async create(paciente: CreatePacienteDto): Promise<Paciente> {
    const response = await api.post<Paciente>('/pacientes', paciente);
    return response.data;
  },

  async update(id: number, paciente: Partial<CreatePacienteDto>): Promise<Paciente> {
    const response = await api.put<Paciente>(`/pacientes/${id}`, paciente);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/pacientes/${id}`);
  }
};