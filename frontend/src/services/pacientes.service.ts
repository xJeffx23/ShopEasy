import api from './api';

export interface Paciente {
  idPaciente: number;
  Nombre: string;
  Numero_Cedula: string;
  Fecha_Nacimiento: string;
  Fecha_Ingreso: string;
  Telefono_Contacto_Emergencia: string;
  Nombre_Contacto_Emergencia: string;
  Activo: boolean;
  Catalogo_Nivel_Asistencia_idNivel: number;
  Nivel_Asistencia?: {
    idCatalogo_Nivel_Asistencia: number;
    Descripcion_Nivel: string;
  };
  Medicamentos?: Array<{
    idPaciente_Medicamento: number;
    Nombre_Medicamento: string;
    Dosis: string;
    Frecuencia: string;
    Indicaciones: string;
    Activo: boolean;
    Paciente_idPaciente: number;
  }>;
  Cuidados?: Array<{
    idPaciente_Cuidado: number;
    Detalle: string;
    Paciente_idPaciente: number;
    Catalogo_Cuidado_Especial_idCuidado: number;
    Tipo_Cuidado?: {
      idCatalogo_Cuidado_Especial: number;
      Descripcion_Cuidado: string;
    };
  }>;
  Paquetes?: Array<{
    idPaciente_Paquete: number;
    Fecha_Asignacion: string;
    Activo: boolean;
    Paciente_idPaciente: number;
    Catalogo_Paquete_idPaquete: number;
    Paquete?: {
      idCatalogo_Paquete_Adicional: number;
      Nombre_Paquete: string;
      Descripcion: string;
      Costo_Adicional: number;
    };
  }>;
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
