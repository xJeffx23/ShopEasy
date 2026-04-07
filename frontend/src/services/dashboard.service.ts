import { dashboardMock } from "@/src/data/dashboard.mock";
import { DashboardData } from "@/src/types/dashboard";

/**
 * Obtiene los datos del dashboard.
 *
 * Actualmente retorna el mock local.
 * Cuando el backend esté listo, reemplazar el cuerpo por:
 *
 *   const res = await fetch(
 *     `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`,
 *     { cache: "no-store" }
 *   );
 *   if (!res.ok) throw new Error("Error al cargar el dashboard");
 *   return res.json() as Promise<DashboardData>;
 */
export async function getDashboardData(): Promise<DashboardData> {
    return dashboardMock;
}