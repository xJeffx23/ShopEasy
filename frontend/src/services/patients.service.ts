import { pacientesService, Paciente } from './pacientes.service';
import api from './api';
import { PatientsData, Patient, PatientStatus, PatientStats, AssistanceLevel } from '@/src/types/patient';

export async function getPatientsData(): Promise<PatientsData> {
  try {
    const pacientes = await pacientesService.getAll();
    
    const patients: Patient[] = pacientes.map(paciente => {
      // Buscar reservación activa (estado 1 = Activa)
      const reservacionActiva = paciente.Reservaciones?.find(
        r => r.Catalogo_Estado_Reservacion_idEstado === 1 && r.Activo
      );
      
      // Obtener número de habitación de la reservación activa
      const roomNumber = reservacionActiva?.Habitacion?.Numero_Habitacion || 'Sin asignar';

      return {
        id: paciente.idPaciente.toString(),
        patientCode: `PAT${paciente.idPaciente.toString().padStart(4, '0')}`,
        fullName: paciente.Nombre,
        idNumber: paciente.Numero_Cedula || paciente.idPaciente.toString(),
        birthDate: new Date(paciente.Fecha_Nacimiento).toLocaleDateString('es-CR'),
        age: calculateAge(new Date(paciente.Fecha_Nacimiento)),
        admissionDate: new Date(paciente.Fecha_Ingreso).toLocaleDateString('es-CR'),
        roomNumber: roomNumber,
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
    console.error('Error fetching patient by ID:', error);
    throw error;
  }
}

/**
 * Crear un nuevo paciente con medicamentos, cuidados y paquetes
 */
export async function createPatient(patientData: any): Promise<Patient> {
  try {
    // Mapear medicamentos al formato del backend
    const medicamentos = (patientData.medications || []).map((med: any) => ({
      Nombre_Medicamento: med.name,
      Dosis: med.dose,
      Frecuencia: med.frequency,
      Indicaciones: med.notes || med.schedule || '',
      Activo: true
    }));

    // Mapear cuidados especiales al formato del backend
    const cuidados = (patientData.specialCares || []).map((care: any) => ({
      Detalle: care.detail,
      Catalogo_Cuidado_Especial_idCuidado: mapCareTypeToId(care.type)
    }));

    // Mapear paquetes al formato del backend
    const paquetes = (patientData.packages || []).map((pkg: any) => ({
      Fecha_Asignacion: new Date().toISOString(),
      Activo: true,
      Catalogo_Paquete_idPaquete: mapPackageTypeToId(pkg.type)
    }));

    const backendData = {
      Nombre: patientData.fullName,
      Numero_Cedula: patientData.idNumber,
      Fecha_Nacimiento: patientData.birthDate,
      Fecha_Ingreso: patientData.admissionDate || new Date().toISOString(),
      Telefono_Contacto_Emergencia: patientData.emergencyContact?.phone || '',
      Nombre_Contacto_Emergencia: patientData.emergencyContact?.name || '',
      Catalogo_Nivel_Asistencia_idNivel: mapAssistanceLevelToId(patientData.assistanceLevel),
      Activo: patientData.status !== 'inactivo',
      Medicamentos: medicamentos,
      Cuidados: cuidados,
      Paquetes: paquetes
    };

    console.log('Sending patient data to backend:', backendData);

    const response = await pacientesService.create(backendData as any);
    
    return {
      id: response.idPaciente.toString(),
      patientCode: `PAT${response.idPaciente.toString().padStart(4, '0')}`,
      fullName: response.Nombre,
      idNumber: response.Numero_Cedula,
      birthDate: new Date(response.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(response.Fecha_Nacimiento)),
      admissionDate: new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: 'Sin asignar',
      assistanceLevel: mapAssistanceLevel(response.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: response.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: response.Nombre_Contacto_Emergencia || '',
        phone: response.Telefono_Contacto_Emergencia || ''
      },
      medications: response.Medicamentos?.map((med: any) => ({
        id: med.idPaciente_Medicamento.toString(),
        name: med.Nombre_Medicamento,
        dose: med.Dosis,
        frequency: med.Frecuencia,
        schedule: '',
        notes: med.Indicaciones || undefined
      })) || [],
      specialCares: response.Cuidados?.map((care: any) => ({
        id: care.idPaciente_Cuidado.toString(),
        type: care.Tipo_Cuidado?.Descripcion_Cuidado || 'Cuidado especial',
        detail: care.Detalle
      })) || [],
      packages: response.Paquetes?.map((pkg: any) => ({
        id: pkg.idPaciente_Paquete.toString(),
        type: pkg.Paquete?.Nombre_Paquete || 'Paquete adicional',
        assignedDate: new Date(pkg.Fecha_Asignacion).toLocaleDateString('es-CR'),
        active: pkg.Activo
      })) || []
    };
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
}

/**
 * Actualizar un paciente existente
 */
export async function updatePatient(id: string, patientData: any): Promise<Patient> {
  try {
    const backendData: any = {};

    if (patientData.fullName) backendData.Nombre = patientData.fullName;
    if (patientData.idNumber) backendData.Numero_Cedula = patientData.idNumber;
    if (patientData.birthDate) backendData.Fecha_Nacimiento = patientData.birthDate;
    if (patientData.admissionDate) backendData.Fecha_Ingreso = patientData.admissionDate;
    if (patientData.emergencyContact?.phone) backendData.Telefono_Contacto_Emergencia = patientData.emergencyContact.phone;
    if (patientData.emergencyContact?.name) backendData.Nombre_Contacto_Emergencia = patientData.emergencyContact.name;
    if (patientData.assistanceLevel) backendData.Catalogo_Nivel_Asistencia_idNivel = mapAssistanceLevelToId(patientData.assistanceLevel);

    const response = await pacientesService.update(parseInt(id), backendData);
    
    const reservacionActiva = response.Reservaciones?.find(
      (r: any) => r.Catalogo_Estado_Reservacion_idEstado === 1 && r.Activo
    );
    const roomNumber = reservacionActiva?.Habitacion?.Numero_Habitacion || 'Sin asignar';

    return {
      id: response.idPaciente.toString(),
      patientCode: `PAT${response.idPaciente.toString().padStart(4, '0')}`,
      fullName: response.Nombre,
      idNumber: response.Numero_Cedula,
      birthDate: new Date(response.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(response.Fecha_Nacimiento)),
      admissionDate: new Date(response.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: roomNumber,
      assistanceLevel: mapAssistanceLevel(response.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: response.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: response.Nombre_Contacto_Emergencia || '',
        phone: response.Telefono_Contacto_Emergencia || ''
      },
      medications: response.Medicamentos?.map((med: any) => ({
        id: med.idPaciente_Medicamento.toString(),
        name: med.Nombre_Medicamento,
        dose: med.Dosis,
        frequency: med.Frecuencia,
        schedule: '',
        notes: med.Indicaciones || undefined
      })) || [],
      specialCares: response.Cuidados?.map((care: any) => ({
        id: care.idPaciente_Cuidado.toString(),
        type: care.Tipo_Cuidado?.Descripcion_Cuidado || 'Cuidado especial',
        detail: care.Detalle
      })) || [],
      packages: response.Paquetes?.map((pkg: any) => ({
        id: pkg.idPaciente_Paquete.toString(),
        type: pkg.Paquete?.Nombre_Paquete || 'Paquete adicional',
        assignedDate: new Date(pkg.Fecha_Asignacion).toLocaleDateString('es-CR'),
        active: pkg.Activo
      })) || []
    };
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
}

/**
 * Eliminar un paciente
 */
export async function deletePatient(id: string): Promise<void> {
  try {
    await pacientesService.delete(parseInt(id));
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
}

/**
 * Cambiar el estado de un paciente
 */
export async function updatePatientStatus(id: string, status: PatientStatus): Promise<Patient> {
  try {
    const response = await api.patch(`/pacientes/${id}/status`, {
      Activo: status === 'activo'
    });
    
    const paciente = response.data;
    const reservacionActiva = paciente.Reservaciones?.find(
      (r: any) => r.Catalogo_Estado_Reservacion_idEstado === 1 && r.Activo
    );
    const roomNumber = reservacionActiva?.Habitacion?.Numero_Habitacion || 'Sin asignar';

    return {
      id: paciente.idPaciente.toString(),
      patientCode: `PAT${paciente.idPaciente.toString().padStart(4, '0')}`,
      fullName: paciente.Nombre,
      idNumber: paciente.Numero_Cedula,
      birthDate: new Date(paciente.Fecha_Nacimiento).toLocaleDateString('es-CR'),
      age: calculateAge(new Date(paciente.Fecha_Nacimiento)),
      admissionDate: new Date(paciente.Fecha_Ingreso).toLocaleDateString('es-CR'),
      roomNumber: roomNumber,
      assistanceLevel: mapAssistanceLevel(paciente.Nivel_Asistencia?.Descripcion_Nivel || 'Asistencia básica'),
      status: paciente.Activo ? 'activo' as PatientStatus : 'inactivo' as PatientStatus,
      emergencyContact: {
        name: paciente.Nombre_Contacto_Emergencia || '',
        phone: paciente.Telefono_Contacto_Emergencia || ''
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function mapAssistanceLevel(level: string): AssistanceLevel {
  const mapping: Record<string, AssistanceLevel> = {
    'Asistencia básica': 'Asistencia básica',
    'Asistencia para movilidad': 'Asistencia para movilidad',
    'Asistencia para alimentación': 'Asistencia para alimentación',
    'Asistencia para baño': 'Asistencia para baño',
    'Asistencia completa': 'Asistencia completa'
  };
  return mapping[level] || 'Asistencia básica';
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

function mapCareTypeToId(careType: string): number {
  const mapping: Record<string, number> = {
    'Alergias': 1,
    'Cambios de vendajes': 2,
    'Dietas especiales': 3
  };
  return mapping[careType] || 1;
}

function mapPackageTypeToId(packageType: string): number {
  const mapping: Record<string, number> = {
    'Disfrute de juegos': 1,
    'Visitas a los familiares': 2,
    'Paseos a sitios con acompañamiento': 3
  };
  return mapping[packageType] || 1;
}
