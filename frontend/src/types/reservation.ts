// ─── Catálogos del enunciado ──────────────────────────────────────────────────

/** Enunciado b: Estancia en las instalaciones */
export type StaySchedule =
    | "Día (8am - 5pm)"
    | "Mañana (8am - 2pm)"
    | "Tarde (2pm - 6pm)"
    | "Full estancia";

/** Enunciado b.v: Tipo de habitación */
export type ReservationRoomType =
    | "Compartida"
    | "Individual"
    | "Individual cama matrimonial"
    | "Cuidados especiales";

/** Estado de la reservación */
export type ReservationStatus =
    | "activa"
    | "pendiente"
    | "finalizada"
    | "cancelada";

// ─── Entidad principal ────────────────────────────────────────────────────────

export interface Reservation {
    id: string;
    // Paciente
    patientId: string;
    patientName: string;
    // Habitación
    roomId: string;
    roomNumber: string;
    roomType: ReservationRoomType;
    // Enunciado a: Tiempo de estancia
    startDate: string;       // DD/MM/YYYY
    endDate?: string;       // DD/MM/YYYY — vacío si indefinida
    indefinite: boolean;      // a.iii Indefinido
    // Enunciado b: Estancia en las instalaciones
    schedule: StaySchedule;
    // Estado y auditoría
    status: ReservationStatus;
    createdBy: string;       // Nombre del empleado que registró
    observations?: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface ReservationStats {
    active: number;   // Reservaciones activas
    permanent: number;   // Full estancia (indefinidas)
    respite: number;   // Estancias de día/mañana/tarde
}

// ─── Datos raíz ───────────────────────────────────────────────────────────────

export interface ReservationsData {
    title: string;
    subtitle: string;
    reservations: Reservation[];
    stats: ReservationStats;
}