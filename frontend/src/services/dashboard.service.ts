import api from './api';
import { DashboardData } from "@/src/types/dashboard";

export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Usar el nuevo endpoint de reportes/dashboard
    const response = await api.get('/reportes/dashboard');
    const data = response.data;

    const stats = data.stats;

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
          value: `${stats.tasaOcupacion}%`,
          description: `${stats.ocupacionActual}/${stats.capacidadTotal} camas`,
          badge: "Ocupación",
          iconName: "BarChart",
          accent: "amber" as const
        }
      ],
      recentActivity: [],
      pulse: {
        pendingCount: stats.reservacionesPendientes || 0,
        label: stats.reservacionesPendientes > 0
          ? `${stats.reservacionesPendientes} reservaciones pendientes`
          : "Sin actividades pendientes",
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
        occupancyRate: stats.tasaOcupacion,
        weeklyData: [
          { day: "Lun", occupancy: stats.tasaOcupacion },
          { day: "Mar", occupancy: stats.tasaOcupacion },
          { day: "Mié", occupancy: stats.tasaOcupacion },
          { day: "Jue", occupancy: stats.tasaOcupacion },
          { day: "Vie", occupancy: stats.tasaOcupacion },
          { day: "Sáb", occupancy: stats.tasaOcupacion },
          { day: "Dom", occupancy: stats.tasaOcupacion }
        ]
      },
      roomStatus: data.roomStatus,
      careLevels: data.careLevels,
      quickSummary: {
        occupancyRate: stats.tasaOcupacion,
        roomsInMaintenance: stats.habitacionesMantenimiento,
        staffPerPatient: stats.staffPerPatient
      }
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);

    // Fallback: obtener datos directamente de los endpoints individuales
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

      const stats = {
        totalEmpleados: empleados.length,
        empleadosActivos: empleados.filter((e: any) => e.Activo).length,
        totalPacientes: pacientes.length,
        pacientesActivos: pacientes.filter((p: any) => p.Activo).length,
        totalHabitaciones: habitaciones.length,
        habitacionesDisponibles: habitaciones.filter((h: any) => h.Catalogo_Estado_Habitacion_idEstado === 1).length,
        habitacionesOcupadas: habitaciones.filter((h: any) => h.Catalogo_Estado_Habitacion_idEstado === 2).length,
        habitacionesMantenimiento: habitaciones.filter((h: any) => h.Catalogo_Estado_Habitacion_idEstado === 3).length,
        reservacionesActivas: reservaciones.filter((r: any) => r.Catalogo_Estado_Reservacion_idEstado === 1).length
      };

      const capacidadTotal = habitaciones.reduce((sum: number, h: any) => sum + (h.Capacidad || 1), 0);
      const tasaOcupacion = capacidadTotal > 0
        ? Math.round((stats.habitacionesOcupadas / capacidadTotal) * 100)
        : 0;

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
            value: `${tasaOcupacion}%`,
            description: `${stats.habitacionesOcupadas} ocupadas`,
            badge: "Ocupadas",
            iconName: "BarChart",
            accent: "amber" as const
          }
        ],
        recentActivity: [],
        pulse: {
          pendingCount: 0,
          label: "Sin actividades pendientes",
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
          occupancyRate: tasaOcupacion,
          weeklyData: [
            { day: "Lun", occupancy: tasaOcupacion },
            { day: "Mar", occupancy: tasaOcupacion },
            { day: "Mié", occupancy: tasaOcupacion },
            { day: "Jue", occupancy: tasaOcupacion },
            { day: "Vie", occupancy: tasaOcupacion },
            { day: "Sáb", occupancy: tasaOcupacion },
            { day: "Dom", occupancy: tasaOcupacion }
          ]
        },
        roomStatus: [
          { name: "Disponibles", value: stats.habitacionesDisponibles, color: "#10b981" },
          { name: "Ocupadas", value: stats.habitacionesOcupadas, color: "#3b82f6" },
          { name: "Mantenimiento", value: stats.habitacionesMantenimiento, color: "#f59e0b" }
        ],
        careLevels: [
          { level: "Básica", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 1).length, color: "#10b981" },
          { level: "Movilidad", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 2).length, color: "#3b82f6" },
          { level: "Alimentación", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 3).length, color: "#f59e0b" },
          { level: "Baño", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 4).length, color: "#ef4444" },
          { level: "Completa", count: pacientes.filter((p: any) => p.Catalogo_Nivel_Asistencia_idNivel === 5).length, color: "#8b5cf6" }
        ],
        quickSummary: {
          occupancyRate: tasaOcupacion,
          roomsInMaintenance: stats.habitacionesMantenimiento,
          staffPerPatient: stats.totalPacientes > 0
            ? Math.round((stats.totalEmpleados / stats.totalPacientes) * 10) / 10
            : 0
        }
      };
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      return {
        title: "Dashboard del Sistema",
        subtitle: "Vista general de la operación del asilo",
        stats: [],
        recentActivity: [],
        pulse: {
          pendingCount: 0,
          label: "Error al cargar datos",
          description: "Intente recargar la página",
          members: [],
          extraCount: 0
        },
        quickActions: [],
        trend: { occupancyRate: 0, weeklyData: [] },
        roomStatus: [],
        careLevels: [],
        quickSummary: { occupancyRate: 0, roomsInMaintenance: 0, staffPerPatient: 0 }
      };
    }
  }
}