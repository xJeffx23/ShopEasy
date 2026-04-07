import { employeesMock } from "@/src/data/employees.mock";
import { EmployeesData } from "@/src/types/employee";

/**
 * Obtiene los datos del módulo de empleados.
 *
 * Cuando el backend esté listo, reemplazar por:
 *
 *   const res = await fetch(
 *     `${process.env.NEXT_PUBLIC_API_URL}/api/employees`,
 *     { cache: "no-store" }
 *   );
 *   if (!res.ok) throw new Error("Error al cargar empleados");
 *   return res.json() as Promise<EmployeesData>;
 */
export async function getEmployeesData(): Promise<EmployeesData> {
    return employeesMock;
}