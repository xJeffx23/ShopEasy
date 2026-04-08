"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    BedDouble, CalendarCheck, CalendarClock,
    CalendarPlus, CheckCircle2, Clock, History,
    UserRound, XCircle,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import AddReservationDialog from "@/src/components/reservations/add-reservation-dialog";
import type { PatientPanelData } from "@/src/types/patient-panel";
import type { Reservation } from "@/src/types/reservation";

interface PatientPanelViewProps {
    data: PatientPanelData;
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function getScheduleBadge(schedule: Reservation["schedule"]) {
    switch (schedule) {
        case "Full estancia": return "bg-blue-100 text-blue-700";
        case "Día (8am - 5pm)": return "bg-amber-100 text-amber-700";
        case "Mañana (8am - 2pm)": return "bg-emerald-100 text-emerald-700";
        case "Tarde (2pm - 6pm)": return "bg-violet-100 text-violet-700";
    }
}

function getStatusBadge(status: Reservation["status"]) {
    switch (status) {
        case "activa": return { cls: "bg-emerald-100 text-emerald-700", label: "Activa" };
        case "pendiente": return { cls: "bg-amber-100 text-amber-700", label: "Pendiente" };
        case "finalizada": return { cls: "bg-slate-100 text-slate-500", label: "Finalizada" };
        case "cancelada": return { cls: "bg-red-100 text-red-600", label: "Cancelada" };
    }
}

function formatDate(date?: string, indefinite?: boolean) {
    if (indefinite || !date) return "Indefinida";
    return date;
}

// ─── Card de reservación ──────────────────────────────────────────────────────

function ReservationCard({ reservation, dim = false }: { reservation: Reservation; dim?: boolean }) {
    const status = getStatusBadge(reservation.status);
    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-5 transition-colors ${dim ? "border-slate-200/60 bg-slate-50" : "border-blue-200/60 bg-white shadow-sm"}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${dim ? "bg-slate-100" : "bg-blue-50"}`}>
                        <BedDouble className={`h-5 w-5 ${dim ? "text-slate-400" : "text-blue-600"}`} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Habitación {reservation.roomNumber}
                        </p>
                        <p className="text-xs text-slate-500">{reservation.roomType}</p>
                    </div>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.cls}`}>
                    {status.label}
                </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">Tipo de estancia</p>
                    <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${getScheduleBadge(reservation.schedule)}`}>
                        {reservation.schedule}
                    </span>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">Fecha de inicio</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{reservation.startDate}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-[11px] text-slate-400">Fecha de fin</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                        {formatDate(reservation.endDate, reservation.indefinite)}
                    </p>
                </div>
            </div>

            {reservation.observations && (
                <p className="mt-3 text-xs text-slate-400">
                    Nota: {reservation.observations}
                </p>
            )}
        </motion.div>
    );
}

// ─── Vista principal ──────────────────────────────────────────────────────────

export default function PatientPanelView({ data }: PatientPanelViewProps) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [newReservations, setNewReservations] = useState<Reservation[]>([]);

    const allActive = [...data.activeReservations, ...newReservations];

    function handleNewReservation(r: Reservation) {
        setNewReservations((prev) => [r, ...prev]);
        // TODO: await createReservation(r) — POST /api/reservations
    }

    return (
        <>
            <section className="space-y-8">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">
                            {data.patient.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                {data.patient.name}
                            </h1>
                            <div className="mt-0.5 flex items-center gap-3 text-sm text-slate-500">
                                <span className="flex items-center gap-1">
                                    <UserRound className="h-3.5 w-3.5" />
                                    {data.patient.patientCode}
                                </span>
                                <span className="flex items-center gap-1">
                                    <BedDouble className="h-3.5 w-3.5" />
                                    Habitación {data.patient.roomNumber}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="h-10 shrink-0 rounded-xl bg-blue-600 px-5 text-sm hover:bg-blue-700 active:scale-[0.98]"
                    >
                        <CalendarPlus className="mr-2 h-4 w-4" />
                        Nueva Reservación
                    </Button>
                </div>

                {/* Stats rápidas */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {[
                        {
                            label: "Reservaciones activas",
                            value: allActive.length,
                            icon: CalendarCheck,
                            color: "text-emerald-600",
                            bg: "bg-emerald-50",
                        },
                        {
                            label: "Historial de estancias",
                            value: data.historyReservations.length,
                            icon: History,
                            color: "text-blue-600",
                            bg: "bg-blue-50",
                        },
                        {
                            label: "Habitación actual",
                            value: data.patient.roomNumber,
                            icon: BedDouble,
                            color: "text-slate-600",
                            bg: "bg-slate-100",
                        },
                    ].map(({ label, value, icon: Icon, color, bg }) => (
                        <div key={label} className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                                <Icon className={`h-4 w-4 ${color}`} />
                            </div>
                            <div>
                                <p className="text-xl font-bold text-slate-900">{value}</p>
                                <p className="text-xs text-slate-500">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reservaciones activas */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <h2 className="text-lg font-semibold text-slate-900">
                            Reservaciones Activas
                        </h2>
                        <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-100 px-1.5 text-xs font-semibold text-emerald-700">
                            {allActive.length}
                        </span>
                    </div>

                    {allActive.length === 0 ? (
                        <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12">
                            <div className="text-center">
                                <CalendarClock className="mx-auto h-8 w-8 text-slate-300" />
                                <p className="mt-3 text-sm text-slate-400">No hay reservaciones activas</p>
                                <Button
                                    onClick={() => setDialogOpen(true)}
                                    variant="outline"
                                    className="mt-4 h-9 rounded-xl border-slate-200 text-sm"
                                >
                                    Crear primera reservación
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {allActive.map((r) => (
                                <ReservationCard key={r.id} reservation={r} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Historial */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-slate-400" />
                        <h2 className="text-lg font-semibold text-slate-900">
                            Historial de Reservaciones
                        </h2>
                        <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-xs font-semibold text-slate-500">
                            {data.historyReservations.length}
                        </span>
                    </div>

                    {data.historyReservations.length === 0 ? (
                        <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10">
                            <p className="text-sm text-slate-400">Sin historial de reservaciones</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {data.historyReservations.map((r) => (
                                <ReservationCard key={r.id} reservation={r} dim />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Dialog de nueva reservación reutilizado */}
            <AddReservationDialog
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleNewReservation}
            />
        </>
    );
}