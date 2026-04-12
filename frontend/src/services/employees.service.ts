import { empleadosService } from './empleados.service';
import { EmployeesData, EmployeeItem, EmployeeStatus } from '@/src/types/employee';

export async function getEmployeesData(): Promise<EmployeesData> {
  try {
    const empleados = await empleadosService.getAll();
    
    // Transformar los datos del backend al formato del frontend
    const employees: EmployeeItem[] = empleados.map(emp => ({
      id: emp.idEmpleado.toString(),
      fullName: emp.Nombre || 'Empleado',
      idNumber: emp.Numero_Cedula || emp.idEmpleado.toString(),
      email: emp.Email || '',
      phone: emp.Telefono || '',
      department: mapDepartment(emp.Perfil?.Nombre_Perfil || ''),
      role: emp.Perfil?.Nombre_Perfil || '',
      profile: mapProfile(emp.Perfil?.Nombre_Perfil || ''),
      status: emp.Activo ? 'activo' as EmployeeStatus : 'inactivo' as EmployeeStatus,
      employeeCode: `EMP${emp.idEmpleado.toString().padStart(4, '0')}`,
      hireDate: emp.Fecha_Ingreso ? new Date(emp.Fecha_Ingreso).toLocaleDateString('es-CR') : '',
      initials: (emp.Nombre || '').charAt(0) + (emp.Nombre || '').split(' ')[1]?.charAt(0) || '',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.Nombre || 'Empleado')}&background=243C8F&color=fff`
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
      Nombre: employeeData.fullName || 'Empleado',
      Numero_Cedula: employeeData.idNumber || 'TEMP-' + Date.now(),
      Fecha_Ingreso: new Date().toISOString(),
      Telefono: employeeData.phone || '',
      Email: employeeData.email || '',
      Catalogo_Departamento_idDepartamento: mapDepartmentToId(employeeData.department || 'Administrativo'),
      Catalogo_Perfil_Usuario_idPerfil: mapProfileToId(employeeData.role || 'Empleado'),
      Activo: true
    };
    
    const response = await empleadosService.create(backendData);
    
    return {
      id: response.idEmpleado.toString(),
      fullName: response.Nombre || 'Empleado',
      idNumber: response.Numero_Cedula || response.idEmpleado.toString(),
      email: response.Email || '',
      phone: response.Telefono || '',
      department: mapDepartment(response.Perfil?.Nombre_Perfil || ''),
      role: response.Perfil?.Nombre_Perfil || '',
      profile: mapProfile(response.Perfil?.Nombre_Perfil || ''),
      status: response.Activo ? 'activo' as EmployeeStatus : 'inactivo' as EmployeeStatus,
      employeeCode: `EMP${response.idEmpleado.toString().padStart(4, '0')}`,
      hireDate: response.Fecha_Ingreso ? new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR') : '',
      initials: (response.Nombre || '').charAt(0) + (response.Nombre || '').split(' ')[1]?.charAt(0) || '',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.Nombre || 'Empleado')}&background=243C8F&color=fff`
    };
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
}

export async function updateEmployee(id: string, employeeData: any): Promise<EmployeeItem> {
  try {
    const backendData = {
      Nombre: employeeData.fullName || 'Empleado',
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
      fullName: response.Nombre || 'Empleado',
      idNumber: response.Numero_Cedula || response.idEmpleado.toString(),
      email: response.Email || '',
      phone: response.Telefono || '',
      department: mapDepartment(response.Perfil?.Nombre_Perfil || ''),
      role: response.Perfil?.Nombre_Perfil || '',
      profile: mapProfile(response.Perfil?.Nombre_Perfil || ''),
      status: response.Activo ? 'activo' as EmployeeStatus : 'inactivo' as EmployeeStatus,
      employeeCode: `EMP${response.idEmpleado.toString().padStart(4, '0')}`,
      hireDate: response.Fecha_Ingreso ? new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR') : '',
      initials: (response.Nombre || '').charAt(0) + (response.Nombre || '').split(' ')[1]?.charAt(0) || '',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.Nombre || 'Empleado')}&background=243C8F&color=fff`
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
      fullName: response.Nombre || 'Empleado',
      idNumber: response.Numero_Cedula || response.idEmpleado.toString(),
      email: response.Email || '',
      phone: response.Telefono || '',
      department: mapDepartment(response.Perfil?.Nombre_Perfil || ''),
      role: response.Perfil?.Nombre_Perfil || '',
      profile: mapProfile(response.Perfil?.Nombre_Perfil || ''),
      status: response.Activo ? 'activo' as EmployeeStatus : 'inactivo' as EmployeeStatus,
      employeeCode: `EMP${response.idEmpleado.toString().padStart(4, '0')}`,
      hireDate: response.Fecha_Ingreso ? new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR') : '',
      initials: (response.Nombre || '').charAt(0) + (response.Nombre || '').split(' ')[1]?.charAt(0) || '',
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.Nombre || 'Empleado')}&background=243C8F&color=fff`
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
    'Gerencia': 'Gerente',
    'Gestión de Pacientes': 'Administrativo',
    'Mantenimiento': 'Técnico',
    'Recepción': 'Recepcionista'
  };
  return mapping[profileName] || 'Empleado';
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