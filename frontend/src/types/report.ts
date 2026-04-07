// ─── Enunciado a.i — Cantidad de pacientes registrados ───────────────────────
// Enunciado a.ii — Cantidad de pacientes alojados
// Enunciado a.iii — Cantidad de pacientes por día
// Enunciado a.iv — Habitaciones reservadas vs totales

export interface ReportSummary {
    totalPatients: number;   // a.i  Pacientes registrados
    hostedPatients: number;   // a.ii Pacientes alojados (activos)
    reservedRooms: number;   // a.iv Habitaciones reservadas
    totalRooms: number;   // a.iv Habitaciones totales
    activeEmployees: number;   // Personal activo (extra útil)
    activeReservations: number;   // Reservaciones activas
}

// Enunciado a.iii — Pacientes por día
export interface PatientsByDay {
    day: string;   // "Lun", "Mar"...
    patients: number;
}

// Tendencia de ocupación mensual (%)
export interface OccupancyTrend {
    month: string;
    occupancy: number;
}

// Distribución de habitaciones por estado
export interface RoomStatusDistribution {
    name: string;
    value: number;
    color: string;
}

// Pacientes por nivel de asistencia
export interface AssistanceLevelDistribution {
    level: string;
    count: number;
    color: string;
}

// Ingresos y egresos mensuales
export interface PatientMovement {
    month: string;
    ingresos: number;
    egresos: number;
}

// ─── Datos raíz ───────────────────────────────────────────────────────────────

export interface ReportsData {
    summary: ReportSummary;
    patientsByDay: PatientsByDay[];
    occupancyTrend: OccupancyTrend[];
    roomStatusDist: RoomStatusDistribution[];
    assistanceLevelDist: AssistanceLevelDistribution[];
    patientMovement: PatientMovement[];
}