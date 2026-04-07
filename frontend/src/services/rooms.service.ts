import { roomsMock } from "@/src/data/rooms.mock";
import { RoomsData } from "@/src/types/room";

/**
 * Obtiene los datos del módulo de habitaciones.
 *
 * Cuando el backend esté listo, reemplazar por:
 *
 *   const res = await fetch(
 *     `${process.env.NEXT_PUBLIC_API_URL}/api/rooms`,
 *     { cache: "no-store" }
 *   );
 *   if (!res.ok) throw new Error("Error al cargar habitaciones");
 *   return res.json() as Promise<RoomsData>;
 */
export async function getRoomsData(): Promise<RoomsData> {
    return roomsMock;
}