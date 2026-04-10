import { pacientesService } from './pacientes.service';
import { PatientsData, Patient, PatientStatus, PatientStats } from '@/src/types/patient';

export async function getPatientsData(): Promise<PatientsData> {
  try {
    const pacientes = await pacientesService.getAll();
    
    // Transformar los datos del backend al formato del frontend
    const patients: Patient[] = pacientes.map(paciente => ({
      id: paciente.idPaciente.toString(),
      patientCode: `PAT${paciente.idPaciente.toString().padStart(4, '0')}`,
      fullName: `${paciente.Nombre} ${paciente.Apellidos}`,
      idNumber: paciente.idPaciente.toString(),
      birthDate: new Date(paciente.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(paciente.Fecha_Nacimiento)),
      admissionDate: new Date(paciente.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: 'No asignada', // TODO: Obtener desde reservaciones
      assistanceLevel: mapAssistanceLevel(paciente.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: paciente.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: 'Contacto de emergencia', // TODO: Obtener desde campo real
        phone: paciente.Telefono || 'N/A'
      },
      medications: [], // TODO: Mapear desde medicamentos del paciente
      specialCares: [], // TODO: Mapear desde cuidados especiales
      packages: [] // TODO: Mapear desde paquetes adicionales
    }));

    // Calcular estadísticas
    const stats: PatientStats = {
      total: patients.length,
      lowAssistance: patients.filter(p => p.assistanceLevel === 'Asistencia básica' || p.assistanceLevel === 'Asistencia para movilidad').length,
      midAssistance: patients.filter(p => p.assistanceLevel === 'Asistencia para alimentación' || p.assistanceLevel === 'Asistencia para baño').length,
      highAssistance: patients.filter(p => p.assistanceLevel === 'Asistencia completa').length
    };

    return {
      title: "Gestión de Pacientes",
      subtitle: "Administra el registro y cuidado de los pacientes",
      patients,
      stats
    };
  } catch (error) {
    console.error('Error fetching patients:', error);
    // Retornar datos vacíos en caso de error
    return {
      title: "Gestión de Pacientes",
      subtitle: "Administra el registro y cuidado de los pacientes",
      patients: [],
      stats: {
        total: 0,
        lowAssistance: 0,
        midAssistance: 0,
        highAssistance: 0
      }
    };
  }
}

function mapAssistanceLevel(level: string): Patient['assistanceLevel'] {
  const mapping: Record<string, Patient['assistanceLevel']> = {
    'Asistencia básica': 'Asistencia básica',
    'Asistencia para movilidad': 'Asistencia para movilidad',
    'Asistencia para alimentación': 'Asistencia para alimentación',
    'Asistencia para baño': 'Asistencia para baño',
    'Asistencia completa': 'Asistencia completa'
  };
  return mapping[level] || 'Asistencia básica';
}

function calculateAge(birthDate: Date): number {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1;
  }
  
  return age;
}

// CRUD Functions
export async function createPatient(patientData: any): Promise<Patient> {
  try {
    const backendData = {
      Nombre: patientData.fullName || 'Paciente sin nombre', // Nombre completo en un solo campo
      Numero_Cedula: patientData.idNumber || 'TEMP-' + Date.now(), // Generar número temporal si no se proporciona
      Fecha_Nacimiento: new Date(patientData.birthDate).toISOString(),
      Telefono_Contacto_Emergencia: patientData.emergencyContact?.phone || '',
      Nombre_Contacto_Emergencia: patientData.emergencyContact?.name || '',
      Telefono: patientData.phone || '',
      Email: patientData.email || '',  
      Direccion: patientData.address || '',
      Fecha_Ingreso: new Date().toISOString(),
      Catalogo_Nivel_Asistencia_idNivel: mapAssistanceLevelToId(patientData.assistanceLevel || 'Asistencia básica'),
      Activo: true
    };
    
    const response = await pacientesService.create(backendData);
    
    return {
      id: response.idPaciente.toString(),
      fullName: response.Nombre, // Solo Nombre ya que no hay Apellidos
      idNumber: response.Numero_Cedula,
      patientCode: `PAT${response.idPaciente.toString().padStart(4, '0')}`,
      roomNumber: 'No asignada',
      assistanceLevel: mapAssistanceLevel(response.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: response.Activo ? 'active' as PatientStatus : 'inactive' as PatientStatus,
      admissionDate: new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(response.Fecha_Nacimiento)),
      phone: response.Telefono,
      email: response.Email,
      address: response.Direccion,
      specialCare: response.Cuidados_Especial || [],
      medications: response.Medicamentos || [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.Nombre)}&background=243C8F&color=fff`
    };
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
}

export async function updatePatient(id: string, patientData: any): Promise<Patient> {
  try {
    const backendData = {
      Nombre: patientData.fullName?.split(' ')[0] || patientData.fullName,
      Apellidos: patientData.fullName?.split(' ').slice(1).join(' ') || '',
      Fecha_Nacimiento: patientData.birthDate ? new Date(patientData.birthDate).toISOString() : undefined,
      Telefono_Contacto_Emergencia: patientData.emergencyContact?.phone || '',
      Nombre_Contacto_Emergencia: patientData.emergencyContact?.name || '',
      Telefono: '', // TODO: Agregar si es necesario
      Email: '', // TODO: Agregar si es necesario  
      Direccion: '', // TODO: Agregar si es necesario
      Fecha_Ingreso: new Date().toISOString(),
      Activo: patientData.status !== 'inactivo'
    };
    
    const response = await pacientesService.update(parseInt(id), backendData);
    
    return {
      id: response.idPaciente.toString(),
      fullName: `${response.Nombre} ${response.Apellidos}`,
      idNumber: response.idPaciente.toString(),
      patientCode: `PAT${response.idPaciente.toString().padStart(4, '0')}`,
      roomNumber: 'No asignada',
      assistanceLevel: mapAssistanceLevel(response.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: response.Activo ? 'active' as PatientStatus : 'inactive' as PatientStatus,
      admissionDate: new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(response.Fecha_Nacimiento)),
      phone: response.Telefono,
      email: response.Email,
      address: response.Direccion,
      specialCare: response.Cuidado_Especial || [],
      medications: response.Medicamentos || [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.Nombre + ' ' + response.Apellidos)}&background=243C8F&color=fff`
    };
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
}

export async function deletePatient(id: string): Promise<void> {
  try {
    await pacientesService.delete(parseInt(id));
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
}

export async function updatePatientStatus(id: string, status: PatientStatus): Promise<Patient> {
  try {
    const backendData = {
      Activo: status === 'activo'
    };
    
    const response = await pacientesService.update(parseInt(id), backendData);
    
    return {
      id: response.idPaciente.toString(),
      fullName: `${response.Nombre} ${response.Apellidos}`,
      idNumber: response.idPaciente.toString(),
      patientCode: `PAT${response.idPaciente.toString().padStart(4, '0')}`,
      roomNumber: 'No asignada',
      assistanceLevel: mapAssistanceLevel(response.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: response.Activo ? 'active' as PatientStatus : 'inactive' as PatientStatus,
      admissionDate: new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(response.Fecha_Nacimiento)),
      phone: response.Telefono,
      email: response.Email,
      address: response.Direccion,
      specialCare: response.Cuidado_Especial || [],
      medications: response.Medicamentos || [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(response.Nombre + ' ' + response.Apellidos)}&background=243C8F&color=fff`
    };
  } catch (error) {
    console.error('Error updating patient status:', error);
    throw error;
  }
}

function mapAssistanceLevelToId(level: string): number {
  const mapping: Record<string, number> = {
    'Asistencia básica': 1,
    'Asistencia para movilidad': 2,
    'Asistencia para alimentación': 3,
    'Asistencia para baño': 4,
    'Asistencia completa': 5
  };
  return mapping[level] || 1;
}