import { patientPanelMock } from "@/src/data/patient-panel.mock";
import { PatientPanelData } from "@/src/types/patient-panel";

/**
 * Obtiene los datos del panel del paciente.
 *
 * Cuando el backend esté listo, reemplazar por:
 *
 *   const res = await fetch(
 *     `${process.env.NEXT_PUBLIC_API_URL}/api/patients/panel`,
 *     { cache: "no-store" }
 *   );
 *   if (!res.ok) throw new Error("Error al cargar el panel del paciente");
 *   return res.json() as Promise<PatientPanelData>;
 */
export async function getPatientPanelData(): Promise<PatientPanelData> {
    return patientPanelMock;
}