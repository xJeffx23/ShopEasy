import { patientsMock } from "@/src/data/patients.mock";
import { PatientsData } from "@/src/types/patient";

/**
 * Obtiene los datos del módulo de pacientes.
 *
 * Cuando el backend esté listo, reemplazar por:
 *
 *   const res = await fetch(
 *     `${process.env.NEXT_PUBLIC_API_URL}/api/patients`,
 *     { cache: "no-store" }
 *   );
 *   if (!res.ok) throw new Error("Error al cargar pacientes");
 *   return res.json() as Promise<PatientsData>;
 */
export async function getPatientsData(): Promise<PatientsData> {
    return patientsMock;
}