import api from "./api";
import { PatientPanelData } from "@/types/patient-panel";

export async function getPatientPanelData(): Promise<PatientPanelData> {
    try {
        const response = await api.get<PatientPanelData>("/pacientes/panel");
        return response.data;
    } catch (error) {
        console.error("Error fetching patient panel:", error);
        // Retornar datos vacíos si el endpoint no existe
        return {
            patient: null,
            medications: [],
            appointments: [],
            notifications: []
        } as unknown as PatientPanelData;
    }
}