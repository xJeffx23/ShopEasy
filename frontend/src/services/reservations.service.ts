import { reservationsMock } from "@/src/data/reservations.mock";
import { ReservationsData } from "@/src/types/reservation";

/**
 * Obtiene los datos del módulo de reservaciones.
 *
 * Cuando el backend esté listo, reemplazar por:
 *
 *   const res = await fetch(
 *     `${process.env.NEXT_PUBLIC_API_URL}/api/reservations`,
 *     { cache: "no-store" }
 *   );
 *   if (!res.ok) throw new Error("Error al cargar reservaciones");
 *   return res.json() as Promise<ReservationsData>;
 */
export async function getReservationsData(): Promise<ReservationsData> {
    return reservationsMock;
}