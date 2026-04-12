import { empleadosService } from './empleados.service';

export interface EmployeeOption {
  label: string;
  value: string;
  id: number;
  nombre: string;
  email: string;
  departamento: string;
}

export async function getEmployeesForSelect(): Promise<EmployeeOption[]> {
  try {
    const empleados = await empleadosService.getAll();
    
    return empleados.map(empleado => ({
      label: `${empleado.Nombre} (${empleado.Email})`,
      value: empleado.idEmpleado.toString(),
      id: empleado.idEmpleado,
      nombre: empleado.Nombre,
      email: empleado.Email,
      departamento: empleado.Departamento?.Nombre_Departamento || 'Sin departamento'
    }));
  } catch (error) {
    console.error('Error loading employees for select:', error);
    return [];
  }
}
