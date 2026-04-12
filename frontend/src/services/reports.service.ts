import api from './api';
import { ReportsData } from '@/types/report';

export async function getReportsData(): Promise<ReportsData> {
  try {
    const [empleadosResponse, pacientesResponse, habitacionesResponse, reservacionesResponse] = await Promise.all([
      api.get('/empleados'),
      api.get('/pacientes'),
      api.get('/habitaciones'),
      api.get('/reservaciones')
    ]);

    const empleados: any[] = empleadosResponse.data;
    const pacientes: any[] = pacientesResponse.data;
    const habitaciones: any[] = habitacionesResponse.data;
    const reservaciones: any[] = reservacionesResponse.data;

    const totalPacientesRegistrados = pacientes.length;
    const pacientesAlojados = reservaciones.filter((r: any) => r.idCatalogo_Estado_Reservacion === 1).length;
    const pacientesPorDia = reservaciones.length;
    const habitacionesReservadas = reservaciones.filter((r: any) => r.idCatalogo_Estado_Reservacion === 1).length;
    const habitacionesTotales = habitaciones.length;

    return {
      summary: {
        totalPatients: totalPacientesRegistrados,
        hostedPatients: pacientesAlojados,
        reservedRooms: habitacionesReservadas,
        totalRooms: habitacionesTotales,
        activeEmployees: empleados.filter((e: any) => e.Activo).length,
        activeReservations: reservaciones.filter((r: any) => r.idCatalogo_Estado_Reservacion === 1).length
      },
      patientsByDay: [
        { day: "Lun", patients: Math.floor(pacientesPorDia / 5) },
        { day: "Mar", patients: Math.floor(pacientesPorDia / 5) },
        { day: "Mié", patients: Math.floor(pacientesPorDia / 5) },
        { day: "Jue", patients: Math.floor(pacientesPorDia / 5) },
        { day: "Vie", patients: Math.floor(pacientesPorDia / 5) },
        { day: "Sáb", patients: Math.floor(pacientesPorDia / 10) },
        { day: "Dom", patients: Math.floor(pacientesPorDia / 10) }
      ],
      occupancyTrend: [
        { month: "Ene", occupancy: 75 },
        { month: "Feb", occupancy: 80 },
        { month: "Mar", occupancy: 85 },
        { month: "Abr", occupancy: habitacionesTotales > 0 ? Math.round((habitacionesReservadas / habitacionesTotales) * 100) : 0 }
      ],
      roomStatusDist: [
        { name: "Disponibles", value: habitaciones.filter((h: any) => h.idCatalogo_Estado_Habitacion === 1).length, color: "#10b981" },
        { name: "Ocupadas", value: habitacionesReservadas, color: "#3b82f6" },
        { name: "Mantenimiento", value: habitaciones.filter((h: any) => h.idCatalogo_Estado_Habitacion === 3).length, color: "#f59e0b" }
      ],
      assistanceLevelDist: [
        { level: "Básica", count: pacientes.filter((p: any) => p.idCatalogo_Nivel_Asistencia === 1).length, color: "#10b981" },
        { level: "Movilidad", count: pacientes.filter((p: any) => p.idCatalogo_Nivel_Asistencia === 2).length, color: "#3b82f6" },
        { level: "Alimentación", count: pacientes.filter((p: any) => p.idCatalogo_Nivel_Asistencia === 3).length, color: "#f59e0b" },
        { level: "Baño", count: pacientes.filter((p: any) => p.idCatalogo_Nivel_Asistencia === 4).length, color: "#ef4444" },
        { level: "Completa", count: pacientes.filter((p: any) => p.idCatalogo_Nivel_Asistencia === 5).length, color: "#8b5cf6" }
      ],
      patientMovement: [
        { month: "Ene", ingresos: 2, egresos: 1 },
        { month: "Feb", ingresos: 3, egresos: 2 },
        { month: "Mar", ingresos: 1, egresos: 0 },
        { month: "Abr", ingresos: 0, egresos: 1 }
      ]
    };
  } catch (error) {
    console.error('Error fetching reports data:', error);
    return {
      summary: {
        totalPatients: 0,
        hostedPatients: 0,
        reservedRooms: 0,
        totalRooms: 0,
        activeEmployees: 0,
        activeReservations: 0
      },
      patientsByDay: [],
      occupancyTrend: [],
      roomStatusDist: [],
      assistanceLevelDist: [],
      patientMovement: []
    };
  }
}