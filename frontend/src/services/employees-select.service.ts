import { empleadosService } from './empleados.service';

export interface EmployeeOption {
  label: string;
  value: string;
  id: number;
  nombre: string;
  email: string;
  perfil: string;
}

export async function getEmployeesForSelect(): Promise<EmployeeOption[]> {
  try {
    const empleados = await empleadosService.getAll();

    return empleados.map(empleado => ({
      label: `${empleado.Nombre} ${empleado.Apellidos} (${empleado.Email})`,
      value: empleado.idEmpleado.toString(),
      id: empleado.idEmpleado,
      nombre: empleado.Nombre,
      email: empleado.Email,
      perfil: empleado.Perfil?.Nombre_Perfil || 'Sin perfil'
    }));
  } catch (error) {
    console.error('Error loading employees for select:', error);
    return [];
  }
}