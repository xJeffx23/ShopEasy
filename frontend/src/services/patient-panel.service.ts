import api from "./api";
import { PatientPanelData } from "@/types/patient-panel";

/**
 * Obtiene los datos del panel del paciente.
 */
export async function getPatientPanelData(): Promise<PatientPanelData> {
    const response = await api.get<PatientPanelData>("/pacientes/panel");
    return response.data;
}