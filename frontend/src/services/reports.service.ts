import { reportsMock } from "@/src/data/reports.mock";
import { ReportsData } from "@/src/types/report";

/**
 * Obtiene los datos del módulo de reportes.
 *
 * Cuando el backend esté listo, reemplazar por:
 *
 *   const res = await fetch(
 *     `${process.env.NEXT_PUBLIC_API_URL}/api/reports`,
 *     { cache: "no-store" }
 *   );
 *   if (!res.ok) throw new Error("Error al cargar reportes");
 *   return res.json() as Promise<ReportsData>;
 */
export async function getReportsData(): Promise<ReportsData> {
    return reportsMock;
}