import { empleadosService } from './empleados.service';
import { EmployeesData, EmployeeItem, EmployeeStatus } from '@/types/employee';

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

// CRUD Functions
export async function createEmployee(employeeData: any): Promise<EmployeeItem> {
  try {
    const backendData = {
      Nombre: employeeData.fullName?.split(' ')[0] || employeeData.fullName,
      Apellidos: employeeData.fullName?.split(' ').slice(1).join(' ') || '',
      Numero_Cedula: employeeData.idNumber || 'TEMP-' + Date.now(),
      Fecha_Ingreso: new Date().toISOString().split('T')[0],
      Telefono: employeeData.phone || '',
      Email: employeeData.email || '',
      Catalogo_Departamento_idDepartamento: mapDepartmentToId(employeeData.department || 'Administrativo'),
      Catalogo_Perfil_Usuario_idPerfil: mapProfileToId(employeeData.role || 'Empleado'),
      Activo: true
    };

    const response = await empleadosService.create(backendData);

    return {
      id: response.idEmpleado.toString(),
      fullName: `${response.Nombre || ''} ${response.Apellidos || ''}`,
      idNumber: response.idEmpleado.toString(),
      email: response.Email || '',
      phone: response.Telefono || '',
      department: mapDepartment(response.Perfil?.Nombre_Perfil || ''),
      role: response.Perfil?.Nombre_Perfil || '',
      profile: mapProfile(response.Perfil?.Nombre_Perfil || ''),
      status: response.Activo ? 'activo' as EmployeeStatus : 'inactivo' as EmployeeStatus,
      employeeCode: `EMP${response.idEmpleado.toString().padStart(4, '0')}`,
      hireDate: response.Fecha_Ingreso ? new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR') : '',
      initials: `${(response.Nombre || '').charAt(0)}${(response.Apellidos || '').charAt(0)}`,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent((response.Nombre || '') + ' ' + (response.Apellidos || ''))}&background=243C8F&color=fff`
    };
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}

export async function updateEmployee(id: string, employeeData: any): Promise<EmployeeItem> {
  try {
    const backendData = {
      Nombre: employeeData.fullName?.split(' ')[0] || employeeData.fullName,
      Apellidos: employeeData.fullName?.split(' ').slice(1).join(' ') || '',
      Numero_Cedula: employeeData.idNumber,
      Telefono: employeeData.phone,
      Email: employeeData.email,
      Catalogo_Departamento_idDepartamento: mapDepartmentToId(employeeData.department),
      Catalogo_Perfil_Usuario_idPerfil: mapProfileToId(employeeData.role),
      Activo: employeeData.status !== 'inactivo'
    };

    const response = await empleadosService.update(parseInt(id), backendData);

    return {
      id: response.idEmpleado.toString(),
      fullName: `${response.Nombre || ''} ${response.Apellidos || ''}`,
      idNumber: response.idEmpleado.toString(),
      email: response.Email || '',
      phone: response.Telefono || '',
      department: mapDepartment(response.Perfil?.Nombre_Perfil || ''),
      role: response.Perfil?.Nombre_Perfil || '',
      profile: mapProfile(response.Perfil?.Nombre_Perfil || ''),
      status: response.Activo ? 'activo' as EmployeeStatus : 'inactivo' as EmployeeStatus,
      employeeCode: `EMP${response.idEmpleado.toString().padStart(4, '0')}`,
      hireDate: response.Fecha_Ingreso ? new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR') : '',
      initials: `${(response.Nombre || '').charAt(0)}${(response.Apellidos || '').charAt(0)}`,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent((response.Nombre || '') + ' ' + (response.Apellidos || ''))}&background=243C8F&color=fff`
    };
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
}

export async function deleteEmployee(id: string): Promise<void> {
  try {
    await empleadosService.delete(parseInt(id));
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

export async function updateEmployeeStatus(id: string, status: EmployeeStatus): Promise<EmployeeItem> {
  try {
    const response = await empleadosService.updateStatus(parseInt(id), status === 'activo');

    return {
      id: response.idEmpleado.toString(),
      fullName: `${response.Nombre || ''} ${response.Apellidos || ''}`,
      idNumber: response.idEmpleado.toString(),
      email: response.Email || '',
      phone: response.Telefono || '',
      department: mapDepartment(response.Perfil?.Nombre_Perfil || ''),
      role: response.Perfil?.Nombre_Perfil || '',
      profile: mapProfile(response.Perfil?.Nombre_Perfil || ''),
      status: response.Activo ? 'activo' as EmployeeStatus : 'inactivo' as EmployeeStatus,
      employeeCode: `EMP${response.idEmpleado.toString().padStart(4, '0')}`,
      hireDate: response.Fecha_Ingreso ? new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR') : '',
      initials: `${(response.Nombre || '').charAt(0)}${(response.Apellidos || '').charAt(0)}`,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent((response.Nombre || '') + ' ' + (response.Apellidos || ''))}&background=243C8F&color=fff`
    };
  } catch (error) {
    console.error('Error updating employee status:', error);
    throw error;
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

function mapDepartmentToId(department: string): number {
  const mapping: Record<string, number> = {
    'Gerencia': 1,
    'Administrativo': 2,
    'DTI': 3,
    'Financiero': 4
  };
  return mapping[department] || 2;
}

function mapProfile(profileName: string): EmployeeItem['profile'] {
  const mapping: Record<string, EmployeeItem['profile']> = {
    'Gerencia': 'Gerencia',
    'Gestión de Pacientes': 'Gestión de pacientes',
    'Gestión de pacientes': 'Gestión de pacientes',
    'Mantenimiento': 'Mantenimiento',
    'Recepción': 'Recepción'
  };
  return mapping[profileName] || 'Recepción';
}

function mapProfileToId(profile: string): number {
  const mapping: Record<string, number> = {
    'Gerente': 1,
    'Administrativo': 2,
    'Técnico': 3,
    'Recepcionista': 4,
    'Empleado': 2
  };
  return mapping[profile] || 2;
}