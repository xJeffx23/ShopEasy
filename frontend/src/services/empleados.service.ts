import api from './api';

export interface Empleado {
  idEmpleado: number;
  Nombre: string;
  Numero_Cedula: string;
  Fecha_Ingreso: string;
  Telefono: string;
  Email: string;
  Activo: boolean;
  Catalogo_Departamento_idDepartamento: number;
  Catalogo_Perfil_Usuario_idPerfil: number;
  Departamento?: {
    idCatalogo_Departamento: number;
    Nombre_Departamento: string;
  };
  Perfil?: {
    idCatalogo_Perfil_Usuario: number;
    Nombre_Perfil: string;
    Descripcion: string;
  };
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

  async create(empleado: Omit<Empleado, 'idEmpleado' | 'Departamento' | 'Perfil'>): Promise<Empleado> {
    const response = await api.post<Empleado>('/empleados', empleado);
    return response.data;
  },

  async update(id: number, empleado: Partial<Empleado>): Promise<Empleado> {
    const response = await api.put<Empleado>(`/empleados/${id}`, empleado);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/empleados/${id}`);
  },

  async updateStatus(id: number, active: boolean): Promise<Empleado> {
    const response = await api.patch<Empleado>(`/empleados/${id}/status`, { Activo: active });
    return response.data;
  }
};
