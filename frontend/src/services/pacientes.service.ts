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
  Reservaciones?: {
    idReservacion: number;
    Activo: boolean;
    Catalogo_Estado_Reservacion_idEstado: number;
    Habitacion?: {
      idHabitacion: number;
      Numero_Habitacion: string;
    };
  }[];
  Medicamentos?: {
    idPaciente_Medicamento: number;
    Nombre_Medicamento: string;
    Dosis: string;
    Frecuencia: string;
    Indicaciones: string;
    Activo: boolean;
  }[];
  Cuidados?: {
    idPaciente_Cuidado: number;
    Detalle: string;
    Tipo_Cuidado?: {
      Descripcion_Cuidado: string;
    };
  }[];
  Paquetes?: {
    idPaciente_Paquete: number;
    Fecha_Asignacion: string;
    Activo: boolean;
    Paquete?: {
      Descripcion_Paquete: string;
    };
  }[];
}

export interface CreatePacienteDto {
  Nombre: string;
  Numero_Cedula: string;
  Fecha_Nacimiento: string;
  Fecha_Ingreso: string;
  Telefono_Contacto_Emergencia: string;
  Nombre_Contacto_Emergencia: string;
  Catalogo_Nivel_Asistencia_idNivel: number;
  Activo?: boolean;
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