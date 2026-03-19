"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BedDouble,
    Users,
    Activity,
    TriangleAlert,
    ArrowUpRight,
    Clock3,
    UserPlus,
    CalendarPlus,
    ClipboardList,
} from "lucide-react";

const stats = [
    {
        title: "Pacientes registrados",
        value: "124",
        description: "Total en el sistema",
        icon: Users,
    },
    {
        title: "Pacientes alojados",
        value: "98",
        description: "Actualmente activos",
        icon: Activity,
    },
    {
        title: "Habitaciones ocupadas",
        value: "82",
        description: "De 110 disponibles",
        icon: BedDouble,
    },
    {
        title: "Alertas",
        value: "6",
        description: "Pendientes por revisar",
        icon: TriangleAlert,
    },
];

const recentActivity = [
    {
        patient: "Rosa Martínez",
        event: "Nuevo ingreso",
        room: "Habitación 204",
        time: "Hace 15 min",
        status: "Activo",
    },
    {
        patient: "Juan Pérez",
        event: "Cambio de habitación",
        room: "Habitación 112",
        time: "Hace 1 hora",
        status: "Actualizado",
    },
    {
        patient: "Elena Vargas",
        event: "Mantenimiento solicitado",
        room: "Habitación 301",
        time: "Hace 2 horas",
        status: "Pendiente",
    },
    {
        patient: "María López",
        event: "Reservación creada",
        room: "Habitación 218",
        time: "Hace 4 horas",
        status: "Confirmado",
    },
];

const alerts = [
    "Habitación 301 requiere revisión de mantenimiento.",
    "Paciente con dieta especial pendiente de actualización.",
    "2 reservaciones finalizan hoy.",
];

export default function DashboardView() {
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="space-y-6 p-6 md:p-8">
                <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Dashboard</p>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                            Resumen general
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Vista general del estado actual del asilo Patitos del Retiro.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Nuevo paciente
                        </Button>
                        <Button variant="outline" className="gap-2">
                            <CalendarPlus className="h-4 w-4" />
                            Nueva reservación
                        </Button>
                    </div>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Card key={item.title} className="border-0 shadow-sm">
                                <CardContent className="flex items-start justify-between p-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{item.title}</p>
                                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                                            {item.value}
                                        </h2>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-100 p-3">
                                        <Icon className="h-5 w-5 text-slate-700" />
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
                    <Card className="border-0 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Actividad reciente</CardTitle>
                                <CardDescription>
                                    Eventos recientes dentro del sistema.
                                </CardDescription>
                            </div>

                            <Button variant="ghost" className="gap-2 text-sm">
                                Ver todo
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div
                                    key={`${activity.patient}-${activity.time}`}
                                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                                >
                                    <div className="space-y-1">
                                        <h3 className="font-medium text-slate-900">{activity.patient}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {activity.event} · {activity.room}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock3 className="h-3.5 w-3.5" />
                                            {activity.time}
                                        </div>
                                        <Badge
                                            variant={
                                                activity.status === "Pendiente" ? "destructive" : "secondary"
                                            }
                                        >
                                            {activity.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle>Accesos rápidos</CardTitle>
                                <CardDescription>
                                    Acciones frecuentes del sistema.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grid gap-3">
                                <Button variant="outline" className="justify-start gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Registrar paciente
                                </Button>
                                <Button variant="outline" className="justify-start gap-2">
                                    <CalendarPlus className="h-4 w-4" />
                                    Crear reservación
                                </Button>
                                <Button variant="outline" className="justify-start gap-2">
                                    <ClipboardList className="h-4 w-4" />
                                    Ver reportes
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle>Alertas del sistema</CardTitle>
                                <CardDescription>
                                    Elementos que requieren atención.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {alerts.map((alert) => (
                                    <div
                                        key={alert}
                                        className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
                                    >
                                        {alert}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-sm">
                            <CardHeader>
                                <CardTitle>Ocupación general</CardTitle>
                                <CardDescription>
                                    Estado actual de capacidad.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Habitaciones ocupadas</span>
                                        <span className="font-medium">82%</span>
                                    </div>

                                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                                        <div className="h-full w-[82%] rounded-full bg-blue-600" />
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        82 de 100 habitaciones se encuentran ocupadas actualmente.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </div>
        </main>
    );
}