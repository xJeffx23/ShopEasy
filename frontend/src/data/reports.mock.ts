import { ReportsData } from "@/src/types/report";

export const reportsMock: ReportsData = {
    // ── Enunciado a.i, a.ii, a.iv ──────────────────────────────────────────
    summary: {
        totalPatients: 5,    // a.i  Pacientes registrados en el sistema
        hostedPatients: 5,    // a.ii Pacientes actualmente alojados
        reservedRooms: 5,    // a.iv Habitaciones reservadas
        totalRooms: 10,   // a.iv Habitaciones totales
        activeEmployees: 5,    // Personal activo
        activeReservations: 6,    // Reservaciones activas
    },

    // ── Enunciado a.iii — Pacientes por día de la semana ───────────────────
    patientsByDay: [
        { day: "Lun", patients: 4 },
        { day: "Mar", patients: 5 },
        { day: "Mié", patients: 5 },
        { day: "Jue", patients: 5 },
        { day: "Vie", patients: 4 },
        { day: "Sáb", patients: 3 },
        { day: "Dom", patients: 3 },
    ],

    // ── Tendencia de ocupación mensual ─────────────────────────────────────
    occupancyTrend: [
        { month: "Ene", occupancy: 70 },
        { month: "Feb", occupancy: 75 },
        { month: "Mar", occupancy: 78 },
        { month: "Abr", occupancy: 80 },
        { month: "May", occupancy: 78 },
        { month: "Jun", occupancy: 82 },
    ],

    // ── Estado de habitaciones ─────────────────────────────────────────────
    roomStatusDist: [
        { name: "Reservadas", value: 5, color: "#eab308" },
        { name: "Disponibles", value: 3, color: "#38bdf8" },
        { name: "Mantenimiento", value: 1, color: "#92400e" },
        { name: "Cerradas", value: 1, color: "#ef4444" },
    ],

    // ── Pacientes por nivel de asistencia ──────────────────────────────────
    assistanceLevelDist: [
        { level: "Bajo", count: 2, color: "#bae6fd" },
        { level: "Medio", count: 2, color: "#38bdf8" },
        { level: "Alto", count: 1, color: "#0369a1" },
    ],

    // ── Movimiento mensual de pacientes ────────────────────────────────────
    patientMovement: [
        { month: "Ene", ingresos: 2, egresos: 1 },
        { month: "Feb", ingresos: 1, egresos: 1 },
        { month: "Mar", ingresos: 3, egresos: 0 },
        { month: "Abr", ingresos: 1, egresos: 1 },
        { month: "May", ingresos: 2, egresos: 2 },
        { month: "Jun", ingresos: 1, egresos: 0 },
    ],
};