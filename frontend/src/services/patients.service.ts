import { pacientesService } from './pacientes.service';
import { PatientsData, Patient, PatientStatus } from '@/src/types/patient';

export async function getPatientsData(): Promise<PatientsData> {
  try {
    const pacientes = await pacientesService.getAll();
    
    // Transformar los datos del backend al formato del frontend
    const patients: Patient[] = pacientes.map(paciente => ({
      id: paciente.idPaciente.toString(),
      fullName: `${paciente.Nombre} ${paciente.Apellidos}`,
      idNumber: paciente.idPaciente.toString(),
      patientCode: `PAT${paciente.idPaciente.toString().padStart(4, '0')}`,
      roomNumber: 'No asignada', // TODO: Obtener desde reservaciones
      assistanceLevel: mapAssistanceLevel(paciente.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: paciente.Activo ? 'active' as PatientStatus : 'inactive' as PatientStatus,
      admissionDate: new Date(paciente.Fecha_Ingreso).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(paciente.Fecha_Nacimiento)),
      phone: paciente.Telefono,
      email: paciente.Email,
      address: paciente.Direccion,
      specialCare: paciente.Cuidado_Especial || [],
      medications: paciente.Medicamentos || [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(paciente.Nombre + ' ' + paciente.Apellidos)}&background=243C8F&color=fff`
    }));

    return {
      title: "Gestión de Pacientes",
      subtitle: "Administra el registro y cuidado de los pacientes",
      patients
    };
  } catch (error) {
    console.error('Error fetching patients:', error);
    // Retornar datos vacíos en caso de error
    return {
      title: "Gestión de Pacientes",
      subtitle: "Administra el registro y cuidado de los pacientes",
      patients: []
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