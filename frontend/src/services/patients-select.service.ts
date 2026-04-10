import { pacientesService } from './pacientes.service';

export interface PatientOption {
  label: string;
  value: string;
  id: number;
  cedula: string;
  nivelAsistencia: string;
}

export async function getPatientsForSelect(): Promise<PatientOption[]> {
  try {
    const pacientes = await pacientesService.getAll();
    
    return pacientes.map(paciente => ({
      label: `${paciente.Nombre} (${paciente.Numero_Cedula})`,
      value: paciente.idPaciente.toString(),
      id: paciente.idPaciente,
      cedula: paciente.Numero_Cedula,
      nivelAsistencia: paciente.Nivel_Asistencia?.Descripcion_Nivel || 'Sin nivel'
    }));
  } catch (error) {
    console.error('Error loading patients for select:', error);
    return [];
  }
}
