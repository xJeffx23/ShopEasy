// ─── Catálogos ────────────────────────────────────────────────────────────────

export type RoomStatus =
    | "disponible"
    | "reservada"       // Ocupada por reservación activa
    | "mantenimiento"
    | "cerrada";

export type RoomType =
    | "Individual"
    | "Compartida"
    | "Individual cama matrimonial"
    | "Cuidados especiales";

// ─── Sub-entidades ────────────────────────────────────────────────────────────

/** b.i  Registro de fecha de limpiezas (DD/MM/AAAA)
 *  b.ii Personal que efectuó la limpieza */
export interface RoomCleaning {
    id: string;
    date: string;       // DD/MM/AAAA
    employeeName: string;       // Personal que efectuó la limpieza
    notes?: string;
}

/** c.i  Descripción de reparaciones por habitación
 *  c.ii Actualización de mobiliario por habitación
 *  c.iii Reparaciones recomendadas por hacer */
export interface RoomMaintenance {
    id: string;
    date: string;       // DD/MM/AAAA
    repairDescription: string;       // c.i  Descripción de reparaciones
    furnitureUpdate: boolean;      // c.ii Actualización de mobiliario
    furnitureDetail?: string;       // Detalle de qué mobiliario se actualizó
    recommendedRepairs?: string;       // c.iii Reparaciones recomendadas
    completed: boolean;
    employeeName: string;
}

// ─── Entidad principal ────────────────────────────────────────────────────────

export interface Room {
    id: string;
    roomNumber: string;
    floor: number;
    type: RoomType;
    capacity: number;
    status: RoomStatus;
    observations?: string;
    // Paciente asignado (cuando status === "reservada", viene de Reservaciones)
    patientName?: string;
    patientId?: string;
    // Historial
    cleanings: RoomCleaning[];
    maintenances: RoomMaintenance[];
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface RoomStats {
    available: number;
    reserved: number;
    maintenance: number;
    closed: number;
    total: number;
}

// ─── Datos raíz ───────────────────────────────────────────────────────────────

export interface RoomsData {
    title: string;
    subtitle: string;
    rooms: Room[];
    stats: RoomStats;
}