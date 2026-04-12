import api from './api';
import { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const [empleadosResponse, pacientesResponse, habitacionesResponse, reservacionesResponse] = await Promise.all([
      api.get('/empleados'),
      api.get('/pacientes'),
      api.get('/habitaciones'),
      api.get('/reservaciones')
    ]);

    const empleados = empleadosResponse.data;
    const pacientes = pacientesResponse.data;
    const habitaciones = habitacionesResponse.data;
    const reservaciones = reservacionesResponse.data;

    // Calcular estadísticas con los campos correctos
    const stats = {
      totalEmpleados: empleados.length,
      empleadosActivos: empleados.filter((e: any) => e.Activo).length,
      totalPacientes: pacientes.length,
      pacientesActivos: pacientes.filter((p: any) => p.Activo).length,
      totalHabitaciones: habitaciones.length,
      habitacionesDisponibles: habitaciones.filter((h: any) => h.Catalogo_Estado_Habitacion_idEstado === 1).length,
      habitacionesOcupadas: habitaciones.filter((h: any) => h.Catalogo_Estado_Habitacion_idEstado === 2).length,
      habitacionesMantenimiento: habitaciones.filter((h: any) => h.Catalogo_Estado_Habitacion_idEstado === 3).length,
      totalReservaciones: reservaciones.length,
      reservacionesActivas: reservaciones.filter((r: any) => r.Activo).length
    };

    const totalHabitaciones = stats.totalHabitaciones || 1;

    return {
      title: "Dashboard del Sistema",
      subtitle: "Vista general de la operación del asilo",
      stats: [
        {
          id: "total-patients",
          label: "Total Pacientes",
          value: stats.totalPacientes.toString(),
          description: `${stats.pacientesActivos} activos`,
          badge: "Activos",
          iconName: "Users",
          accent: "blue" as const
        },
        {
          id: "total-employees",
          label: "Total Empleados",
          value: stats.totalEmpleados.toString(),
          description: `${stats.empleadosActivos} activos`,
          badge: "Personal",
          iconName: "Briefcase",
          accent: "green" as const
        },
        {
          id: "total-rooms",
          label: "Total Habitaciones",
          value: stats.totalHabitaciones.toString(),
          description: `${stats.habitacionesDisponibles} disponibles`,
          badge: "Disponibles",
          iconName: "Home",
          accent: "indigo" as const
        },
        {
          id: "occupancy-rate",
          label: "Tasa Ocupación",
          value: `${Math.round((stats.habitacionesOcupadas / totalHabitaciones) * 100)}%`,
          description: `${stats.habitacionesOcupadas} ocupadas`,
          badge: "Ocupadas",
          iconName: "BarChart",
          accent: "amber" as const
        }
      ],
      recentActivity: [],
      pulse: {
        pendingCount: stats.habitacionesMantenimiento,
        label: stats.habitacionesMantenimiento > 0 ? "Habitaciones en mantenimiento" : "Sin actividades pendientes",
        description: "Sistema operativo",
        members: [],
        extraCount: 0
      },
      quickActions: [
        { id: "new-patient", label: "Nuevo Paciente", iconName: "UserPlus", accent: "blue" as const, href: "/sistema/patients" },
        { id: "new-reservation", label: "Nueva Reservación", iconName: "CalendarPlus", accent: "green" as const, href: "/sistema/reservations" },
        { id: "manage-rooms", label: "Gestionar Habitaciones", iconName: "Home", accent: "amber" as const, href: "/sistema/rooms" }
      ],
      trend: {
        occupancyRate: Math.round((stats.habitacionesOcupadas / totalHabitaciones) * 100),
        weeklyData: [
          { day: "Lun", occupancy: 75 },
          { day: "Mar", occupancy: 80 },
          { day: "Mié", occupancy: 85 },
          { day: "Jue", occupancy: 78 },
          { day: "Vie", occupancy: 82 },
          { day: "Sáb", occupancy: 88 },
          { day: "Dom", occupancy: Math.round((stats.habitacionesOcupadas / totalHabitaciones) * 100) }
        ]
      },
      roomStatus: [
        { name: "Disponibles", value: stats.habitacionesDisponibles, color: "#10b981" },
        { name: "Ocupadas", value: stats.habitacionesOcupadas, color: "#3b82f6" },
        { name: "Mantenimiento", value: stats.habitacionesMantenimiento, color: "#f59e0b" }
      ],
      careLevels: [
        { level: "Asistencia básica", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 1).length, color: "#10b981" },
        { level: "Movilidad", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 2).length, color: "#3b82f6" },
        { level: "Alimentación", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 3).length, color: "#f59e0b" },
        { level: "Baño", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 4).length, color: "#ef4444" },
        { level: "Completa", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 5).length, color: "#8b5cf6" }
      ],
      quickSummary: {
        occupancyRate: Math.round((stats.habitacionesOcupadas / totalHabitaciones) * 100),
        roomsInMaintenance: stats.habitacionesMantenimiento,
        staffPerPatient: stats.totalPacientes > 0 ? Math.round((stats.totalEmpleados / stats.totalPacientes) * 10) / 10 : 0
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      title: "Dashboard del Sistema",
      subtitle: "Vista general de la operación del asilo",
      stats: [],
      recentActivity: [],
      pulse: {
        pendingCount: 0,
        label: "Sin datos",
        description: "Error al cargar datos",
        members: [],
        extraCount: 0
      },
      quickActions: [],
      trend: {
        occupancyRate: 0,
        weeklyData: []
      },
      roomStatus: [],
      careLevels: [],
      quickSummary: {
        occupancyRate: 0,
        roomsInMaintenance: 0,
        staffPerPatient: 0
      }
    };
  }
}