import { pacientesService, Paciente } from './pacientes.service';
import api from './api';
import { PatientsData, Patient, PatientStatus, PatientStats } from '@/src/types/patient';

export async function getPatientsData(): Promise<PatientsData> {
  try {
    const pacientes = await pacientesService.getAll();

    const patients: Patient[] = pacientes.map(paciente => ({
      id: paciente.idPaciente.toString(),
      patientCode: `PAT${paciente.idPaciente.toString().padStart(4, '0')}`,
      fullName: paciente.Nombre,
      idNumber: paciente.Numero_Cedula || paciente.idPaciente.toString(),
      birthDate: new Date(paciente.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(paciente.Fecha_Nacimiento)),
      admissionDate: new Date(paciente.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: 'No asignada',
      assistanceLevel: mapAssistanceLevel(paciente.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: paciente.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: paciente.Nombre_Contacto_Emergencia || 'Contacto de emergencia',
        phone: paciente.Telefono_Contacto_Emergencia || 'N/A'
      },
      medications: paciente.Medicamentos?.map((med: any) => ({
        id: med.idPaciente_Medicamento.toString(),
        name: med.Nombre_Medicamento,
        dose: med.Dosis,
        frequency: med.Frecuencia,
        schedule: '',
        notes: med.Indicaciones || undefined
      })) || [],
      specialCares: paciente.Cuidados?.map((care: any) => ({
        id: care.idPaciente_Cuidado.toString(),
        type: care.Tipo_Cuidado?.Descripcion_Cuidado || 'Cuidado especial',
        detail: care.Detalle
      })) || [],
      packages: paciente.Paquetes?.map((pkg: any) => ({
        id: pkg.idPaciente_Paquete.toString(),
        type: pkg.Paquete?.Nombre_Paquete || 'Paquete adicional',
        assignedDate: new Date(pkg.Fecha_Asignacion).toLocaleDateString('es-CR'),
        active: pkg.Activo
      })) || []
    }));

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

/**
 * Obtener un paciente por ID (retorna tipo Paciente del backend)
 */
export async function getPatientById(id: string): Promise<Paciente> {
  try {
    const paciente = await pacientesService.getById(parseInt(id));
    return paciente;
  } catch (error) {
    console.error('Error fetching patient by id:', error);
    throw error;
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

export async function createPatient(patientData: any): Promise<Patient> {
  try {
    let fechaNacimiento: string;
    if (patientData.birthDate) {
      const date = new Date(patientData.birthDate);
      if (isNaN(date.getTime())) {
        fechaNacimiento = new Date().toISOString();
      } else {
        fechaNacimiento = date.toISOString();
      }
    } else {
      fechaNacimiento = new Date().toISOString();
    }

    const backendData = {
      Nombre: patientData.fullName || 'Paciente sin nombre',
      Numero_Cedula: patientData.idNumber || 'TEMP-' + Date.now(),
      Fecha_Nacimiento: fechaNacimiento,
      Telefono_Contacto_Emergencia: patientData.emergencyContact?.phone || '',
      Nombre_Contacto_Emergencia: patientData.emergencyContact?.name || '',
      Fecha_Ingreso: new Date().toISOString(),
      Catalogo_Nivel_Asistencia_idNivel: mapAssistanceLevelToId(patientData.assistanceLevel || 'Asistencia básica'),
      Activo: true,
      Medicamentos: patientData.medications?.map((med: any) => ({
        Nombre_Medicamento: med.name,
        Dosis: med.dose,
        Frecuencia: med.frequency,
        Indicaciones: med.notes || '',
        Activo: true
      })) || [],
      Cuidados: patientData.specialCares?.map((care: any) => ({
        Detalle: care.detail,
        Catalogo_Cuidado_Especial_idCuidado: 1
      })) || [],
      Paquetes: patientData.packages?.map((pkg: any) => ({
        Fecha_Asignacion: new Date().toISOString(),
        Activo: pkg.active,
        Catalogo_Paquete_idPaquete: 1
      })) || []
    };

    const response = await pacientesService.create(backendData);

    return {
      id: response.idPaciente.toString(),
      fullName: response.Nombre,
      idNumber: response.Numero_Cedula,
      patientCode: `PAT${response.idPaciente.toString().padStart(4, '0')}`,
      birthDate: new Date(response.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(response.Fecha_Nacimiento)),
      admissionDate: new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: 'No asignada',
      assistanceLevel: mapAssistanceLevel(response.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: response.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: response.Nombre_Contacto_Emergencia || '',
        phone: response.Telefono_Contacto_Emergencia || ''
      },
      medications: [],
      specialCares: [],
      packages: []
    };
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
}

export async function updatePatient(id: string, patientData: any): Promise<Patient> {
  try {
    const backendData: any = {};

    if (patientData.fullName) {
      backendData.Nombre = patientData.fullName;
    }

    if (patientData.birthDate) {
      const date = new Date(patientData.birthDate);
      if (!isNaN(date.getTime())) {
        backendData.Fecha_Nacimiento = date.toISOString();
      }
    }

    if (patientData.emergencyContact) {
      backendData.Telefono_Contacto_Emergencia = patientData.emergencyContact.phone || '';
      backendData.Nombre_Contacto_Emergencia = patientData.emergencyContact.name || '';
    }

    if (patientData.status !== undefined) {
      backendData.Activo = patientData.status === 'activo';
    }

    const response = await pacientesService.update(parseInt(id), backendData);

    return {
      id: response.idPaciente.toString(),
      fullName: response.Nombre,
      idNumber: response.Numero_Cedula || response.idPaciente.toString(),
      patientCode: `PAT${response.idPaciente.toString().padStart(4, '0')}`,
      birthDate: new Date(response.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(response.Fecha_Nacimiento)),
      admissionDate: new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: 'No asignada',
      assistanceLevel: mapAssistanceLevel(response.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: response.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: response.Nombre_Contacto_Emergencia || '',
        phone: response.Telefono_Contacto_Emergencia || ''
      },
      medications: [],
      specialCares: [],
      packages: []
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
    const response = await api.patch<any>(`/pacientes/${id}/status`, {
      status: status === 'activo'
    });

    const data = response.data;

    return {
      id: data.idPaciente.toString(),
      fullName: data.Nombre,
      idNumber: data.Numero_Cedula || data.idPaciente.toString(),
      patientCode: `PAT${data.idPaciente.toString().padStart(4, '0')}`,
      birthDate: new Date(data.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(data.Fecha_Nacimiento)),
      admissionDate: new Date(data.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: 'No asignada',
      assistanceLevel: mapAssistanceLevel(data.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: data.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: data.Nombre_Contacto_Emergencia || '',
        phone: data.Telefono_Contacto_Emergencia || ''
      },
      medications: [],
      specialCares: [],
      packages: []
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