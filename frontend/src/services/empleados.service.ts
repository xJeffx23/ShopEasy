import api from './api';

export interface Empleado {
  idEmpleado: number;
  Nombre: string;
  Apellidos: string;
  Email: string;
  Telefono: string;
  Activo: boolean;
  Fecha_Contratacion?: string;
  Fecha_Ingreso?: string;
  Numero_Cedula?: string;
  Catalogo_Departamento_idDepartamento?: number;
  Catalogo_Perfil_Usuario_idPerfil?: number;
  Perfil?: {
    idCatalogo_Perfil_Usuario: number;
    Nombre_Perfil: string;
    Descripcion: string;
  };
}

export interface CreateEmpleadoDto {
  Nombre: string;
  Apellidos: string;
  Email: string;
  Telefono: string;
  Activo: boolean;
  Numero_Cedula?: string;
  Fecha_Ingreso?: string;
  Catalogo_Departamento_idDepartamento?: number;
  Catalogo_Perfil_Usuario_idPerfil?: number;
}

export const empleadosService = {
  async getAll(): Promise<Empleado[]> {
    const response = await api.get<Empleado[]>('/empleados');
    return response.data;
  },

  async getById(id: number): Promise<Empleado> {
    const response = await api.get<Empleado>(`/empleados/${id}`);
    return response.data;
  },

  async create(empleado: CreateEmpleadoDto): Promise<Empleado> {
    const response = await api.post<Empleado>('/empleados', empleado);
    return response.data;
  },

  async update(id: number, empleado: Partial<CreateEmpleadoDto>): Promise<Empleado> {
    const response = await api.put<Empleado>(`/empleados/${id}`, empleado);
    return response.data;
  },

  async updateStatus(id: number, activo: boolean): Promise<Empleado> {
    const response = await api.patch<Empleado>(`/empleados/${id}/status`, { Activo: activo });
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/empleados/${id}`);
  }
};