import { DashboardData } from "@/src/types/dashboard";

export const dashboardMock: DashboardData = {
    title: "Dashboard",
    subtitle: "Resumen general del sistema de gestión",

    stats: [
        {
            id: "patients",
            label: "Total Pacientes",
            value: "5",
            description: "5 activos",
            badge: "Activos",
            iconName: "userRound",
            accent: "blue",
        },
        {
            id: "rooms",
            label: "Habitaciones",
            value: "5/10",
            description: "3 disponibles",
            badge: "Disponibles",
            iconName: "bedDouble",
            accent: "green",
        },
        {
            id: "employees",
            label: "Empleados",
            value: "6",
            description: "Personal activo",
            badge: "Activos",
            iconName: "users",
            accent: "indigo",
        },
        {
            id: "reservations",
            label: "Reservaciones",
            value: "6",
            description: "Reservaciones activas",
            badge: "Activas",
            iconName: "calendarDays",
            accent: "amber",
        },
    ],

    recentActivity: [
        {
            id: "act-1",
            patientName: "María López",
            initials: "ML",
            eventDescription: "Ingreso al centro",
            type: "Ingreso",
            typeColor: "green",
            room: "Hab. 201",
            timeAgo: "Hace 10 min",
        },
        {
            id: "act-2",
            patientName: "Carlos Ruiz",
            initials: "CR",
            eventDescription: "Revisión médica",
            type: "Revisión",
            typeColor: "blue",
            room: "Hab. 105",
            timeAgo: "Hace 35 min",
        },
        {
            id: "act-3",
            patientName: "Ana Martínez",
            initials: "AM",
            eventDescription: "Medicación administrada",
            type: "Medicación",
            typeColor: "amber",
            room: "Hab. 308",
            timeAgo: "Hace 1 h",
        },
    ],

    pulse: {
        pendingCount: 3,
        label: "revisiones pendientes",
        description:
            "Hay pacientes que requieren atención en las próximas horas según su plan de cuidados.",
        members: [
            { id: "m1", name: "Dr. Herrera", initials: "DH", bgClass: "bg-blue-100" },
            { id: "m2", name: "Enf. Solano", initials: "ES", bgClass: "bg-emerald-100" },
            { id: "m3", name: "Dr. Villareal", initials: "DV", bgClass: "bg-amber-100" },
        ],
        extraCount: 2,
    },

    quickActions: [
        {
            id: "qa-1",
            label: "Nuevo paciente",
            iconName: "userPlus",
            accent: "blue",
            href: "/sistema/patients/new",
        },
        {
            id: "qa-2",
            label: "Nueva reservación",
            iconName: "calendarPlus",
            accent: "green",
            href: "/sistema/reservations/new",
        },
        {
            id: "qa-3",
            label: "Ver habitaciones",
            iconName: "bedDouble",
            accent: "amber",
            href: "/sistema/rooms",
        },
    ],

    trend: {
        occupancyRate: 82,
        weeklyData: [
            { day: "Ene", occupancy: 75 },
            { day: "Feb", occupancy: 78 },
            { day: "Mar", occupancy: 82 },
            { day: "Abr", occupancy: 80 },
            { day: "May", occupancy: 79 },
            { day: "Jun", occupancy: 85 },
        ],
    },

    roomStatus: [
        { name: "Ocupadas", value: 5, color: "#eab308" },
        { name: "Disponibles", value: 3, color: "#38bdf8" },
        { name: "Mantenimiento", value: 2, color: "#92400e" },
        { name: "Cerradas", value: 1, color: "#22c55e" },
    ],

    careLevels: [
        { level: "Bajo", count: 1, color: "#eab308" },
        { level: "Medio", count: 2, color: "#38bdf8" },
        { level: "Alto", count: 2, color: "#92400e" },
    ],

    quickSummary: {
        occupancyRate: 50,
        roomsInMaintenance: 2,
        staffPerPatient: 1.2,
    },
};