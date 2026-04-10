import { empleadosService } from './empleados.service';
import { EmployeesData, EmployeeItem, EmployeeStatus } from '@/src/types/employee';

export async function getEmployeesData(): Promise<EmployeesData> {
  try {
    const empleados = await empleadosService.getAll();
    
    // Transformar los datos del backend al formato del frontend
    const employees: EmployeeItem[] = empleados.map(emp => ({
      id: emp.idEmpleado.toString(),
      fullName: `${emp.Nombre || ''} ${emp.Apellidos || ''}`,
      idNumber: emp.idEmpleado.toString(),
      email: emp.Email || '',
      phone: emp.Telefono || '',
      department: mapDepartment(emp.Perfil?.Nombre_Perfil || ''),
      role: emp.Perfil?.Nombre_Perfil || '',
      profile: mapProfile(emp.Perfil?.Nombre_Perfil || ''),
      status: emp.Activo ? 'activo' as EmployeeStatus : 'inactivo' as EmployeeStatus,
      employeeCode: `EMP${emp.idEmpleado.toString().padStart(4, '0')}`,
      hireDate: emp.Fecha_Contratacion ? new Date(emp.Fecha_Contratacion).toLocaleDateString('es-CR') : '',
      initials: `${(emp.Nombre || '').charAt(0)}${(emp.Apellidos || '').charAt(0)}`,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent((emp.Nombre || '') + ' ' + (emp.Apellidos || ''))}&background=243C8F&color=fff`
    }));

    return {
      title: "Gestión de Empleados",
      subtitle: "Administra el personal y sus perfiles de acceso",
      employees
    };
  } catch (error) {
    console.error('Error fetching employees:', error);
    // Retornar datos vacíos en caso de error
    return {
      title: "Gestión de Empleados",
      subtitle: "Administra el personal y sus perfiles de acceso",
      employees: []
    };
  }
}

function mapDepartment(profileName: string): EmployeeItem['department'] {
  const mapping: Record<string, EmployeeItem['department']> = {
    'Gerencia': 'Gerencia',
    'Gestión de Pacientes': 'Administrativo',
    'Mantenimiento': 'DTI',
    'Recepción': 'Financiero'
  };
  return mapping[profileName] || 'Administrativo';
}

function mapProfile(profileName: string): EmployeeItem['profile'] {
  const mapping: Record<string, EmployeeItem['profile']> = {
    'Gerencia': 'Gerencia',
    'Gestión de Pacientes': 'Gestión de pacientes',
    'Mantenimiento': 'Mantenimiento',
    'Recepción': 'Recepción'
  };
  return mapping[profileName] || 'Gestión de pacientes';
}