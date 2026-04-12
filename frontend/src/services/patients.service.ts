import { pacientesService } from './pacientes.service';
import { PatientsData, Patient, PatientStatus, PatientStats } from '@/types/patient';

export async function getPatientsData(): Promise<PatientsData> {
  try {
    const pacientes = await pacientesService.getAll();

    const patients: Patient[] = pacientes.map(paciente => {
      // Buscar reservación activa para obtener la habitación
      const reservacionActiva = paciente.Reservaciones?.find(
        (r: any) => r.Activo && r.Catalogo_Estado_Reservacion_idEstado === 1
      );
      const habitacion = reservacionActiva?.Habitacion?.Numero_Habitacion || 'No asignada';

      return {
        id: paciente.idPaciente.toString(),
        patientCode: `PAT${paciente.idPaciente.toString().padStart(4, '0')}`,
        fullName: paciente.Nombre,
        idNumber: paciente.Numero_Cedula || paciente.idPaciente.toString(),
        birthDate: new Date(paciente.Fecha_Nacimiento).toLocaleDateString('es-CR'),
        age: calculateAge(new Date(paciente.Fecha_Nacimiento)),
        admissionDate: new Date(paciente.Fecha_Ingreso).toLocaleDateString('es-CR'),
        roomNumber: habitacion,
        assistanceLevel: mapAssistanceLevel(paciente.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
        status: paciente.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
        emergencyContact: {
          name: paciente.Nombre_Contacto_Emergencia || 'Contacto de emergencia',
          phone: paciente.Telefono_Contacto_Emergencia || 'N/A'
        },
        medications: paciente.Medicamentos?.map((med: any) => ({
          id: med.idPaciente_Medicamento?.toString() || crypto.randomUUID(),
          name: med.Nombre_Medicamento,
          dose: med.Dosis,
          frequency: med.Frecuencia,
          schedule: med.Indicaciones || '',
          notes: ''
        })) || [],
        specialCares: paciente.Cuidados?.map((care: any) => ({
          id: care.idPaciente_Cuidado?.toString() || crypto.randomUUID(),
          type: care.Tipo_Cuidado?.Descripcion_Cuidado || 'Cuidado especial',
          detail: care.Detalle
        })) || [],
        packages: paciente.Paquetes?.map((pkg: any) => ({
          id: pkg.idPaciente_Paquete?.toString() || crypto.randomUUID(),
          type: pkg.Paquete?.Descripcion_Paquete || 'Paquete',
          assignedDate: new Date(pkg.Fecha_Asignacion).toLocaleDateString('es-CR'),
          active: pkg.Activo
        })) || []
      };
    });

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
      stats: { total: 0, lowAssistance: 0, midAssistance: 0, highAssistance: 0 }
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

function parseDateString(dateStr: string): Date {
  if (!dateStr) return new Date();

  if (dateStr.includes('/')) {
    const [d, m, y] = dateStr.split('/');
    return new Date(`${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
  }

  return new Date(dateStr);
}

export async function createPatient(patientData: any): Promise<Patient> {
  try {
    const fechaNacimiento = parseDateString(patientData.birthDate);

    const backendData = {
      Nombre: patientData.fullName || 'Paciente sin nombre',
      Numero_Cedula: patientData.idNumber || 'TEMP-' + Date.now(),
      Fecha_Nacimiento: fechaNacimiento.toISOString(),
      Fecha_Ingreso: new Date().toISOString(),
      Telefono_Contacto_Emergencia: patientData.emergencyContact?.phone || '00000000',
      Nombre_Contacto_Emergencia: patientData.emergencyContact?.name || 'Contacto',
      Catalogo_Nivel_Asistencia_idNivel: mapAssistanceLevelToId(patientData.assistanceLevel || 'Asistencia básica'),
      Activo: true
    };

    const response = await pacientesService.create(backendData);

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
        name: response.Nombre_Contacto_Emergencia || 'Contacto',
        phone: response.Telefono_Contacto_Emergencia || 'N/A'
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
    const backendData: any = {
      Nombre: patientData.fullName || undefined,
      Telefono_Contacto_Emergencia: patientData.emergencyContact?.phone || '',
      Nombre_Contacto_Emergencia: patientData.emergencyContact?.name || '',
      Activo: patientData.status !== 'inactivo'
    };

    if (patientData.birthDate) {
      backendData.Fecha_Nacimiento = parseDateString(patientData.birthDate).toISOString();
    }

    const response = await pacientesService.update(parseInt(id), backendData);

    const reservacionActiva = response.Reservaciones?.find(
      (r: any) => r.Activo && r.Catalogo_Estado_Reservacion_idEstado === 1
    );

    return {
      id: response.idPaciente.toString(),
      fullName: response.Nombre,
      idNumber: response.Numero_Cedula || response.idPaciente.toString(),
      patientCode: `PAT${response.idPaciente.toString().padStart(4, '0')}`,
      birthDate: new Date(response.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(response.Fecha_Nacimiento)),
      admissionDate: new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: reservacionActiva?.Habitacion?.Numero_Habitacion || 'No asignada',
      assistanceLevel: mapAssistanceLevel(response.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: response.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: response.Nombre_Contacto_Emergencia || 'Contacto',
        phone: response.Telefono_Contacto_Emergencia || 'N/A'
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
    const backendData = { Activo: status === 'activo' };
    const response = await pacientesService.update(parseInt(id), backendData);

    const reservacionActiva = response.Reservaciones?.find(
      (r: any) => r.Activo && r.Catalogo_Estado_Reservacion_idEstado === 1
    );

    return {
      id: response.idPaciente.toString(),
      fullName: response.Nombre,
      idNumber: response.Numero_Cedula || response.idPaciente.toString(),
      patientCode: `PAT${response.idPaciente.toString().padStart(4, '0')}`,
      birthDate: new Date(response.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(response.Fecha_Nacimiento)),
      admissionDate: new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: reservacionActiva?.Habitacion?.Numero_Habitacion || 'No asignada',
      assistanceLevel: mapAssistanceLevel(response.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: response.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: response.Nombre_Contacto_Emergencia || 'Contacto',
        phone: response.Telefono_Contacto_Emergencia || 'N/A'
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