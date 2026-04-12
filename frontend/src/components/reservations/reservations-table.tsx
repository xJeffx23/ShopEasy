"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { MoreHorizontal, Pencil, Trash2, XCircle } from "lucide-react";
import { Reservation, ReservationStatus } from "@/src/types/reservation";
import { ReservationStatusBadge } from "@/src/components/reservations/reservation-status-badge";

interface ReservationsTableProps {
    reservations: Reservation[];
    onEdit?: (r: Reservation) => void;
    onDelete?: (id: string) => void;
    onChangeStatus?: (id: string, status: ReservationStatus) => void;
}

// ─── Badge de tipo de estancia ────────────────────────────────────────────────

function getScheduleBadge(schedule: Reservation["schedule"]) {
    switch (schedule) {
        case "Full estancia": return "bg-indigo-100 text-indigo-800 border border-indigo-200";
        case "Día (8am - 5pm)": return "bg-orange-100 text-orange-800 border border-orange-200";
        case "Mañana (8am - 2pm)": return "bg-green-100 text-green-800 border border-green-200";
        case "Tarde (2pm - 6pm)": return "bg-purple-100 text-purple-800 border border-purple-200";
    }
}

function formatDateDisplay(date?: string, indefinite?: boolean) {
    if (indefinite || !date) return "Indefinida";
    return date;
}

// ─── Menú de acciones ─────────────────────────────────────────────────────────

interface RowActionsProps {
    reservation: Reservation;
    onEdit?: (r: Reservation) => void;
    onDelete?: (id: string) => void;
    onChangeStatus?: (id: string, status: ReservationStatus) => void;
}

function RowActions({ reservation, onEdit, onDelete, onChangeStatus }: RowActionsProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="end"
                        sideOffset={4}
                        className="z-[9999] min-w-[190px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
                    >
                        <DropdownMenu.Item
                            onSelect={() => onEdit?.(reservation)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                        >
                            <Pencil className="h-3.5 w-3.5 text-slate-400" />
                            Editar reservación
                        </DropdownMenu.Item>

                        {reservation.status === "activa" && (
                            <DropdownMenu.Item
                                onSelect={() => onChangeStatus?.(reservation.id, "finalizada")}
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                            >
                                <XCircle className="h-3.5 w-3.5 text-slate-400" />
                                Finalizar reservación
                            </DropdownMenu.Item>
                        )}

                        {reservation.status === "pendiente" && (
                            <DropdownMenu.Item
                                onSelect={() => onChangeStatus?.(reservation.id, "activa")}
                                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                            >
                                <Pencil className="h-3.5 w-3.5 text-emerald-500" />
                                Activar reservación
                            </DropdownMenu.Item>
                        )}

                        <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />

                        <DropdownMenu.Item
                            onSelect={() => setConfirmOpen(true)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar reservación
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <AlertDialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 z-[9998] bg-black/40 animate-in fade-in-0" />
                    <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <Trash2 className="h-5 w-5 text-red-500" />
                        </div>
                        <AlertDialog.Title className="text-center text-base font-semibold text-slate-900">
                            Eliminar reservación
                        </AlertDialog.Title>
                        <AlertDialog.Description className="mt-2 text-center text-sm text-slate-500">
                            ¿Eliminar la reservación de{" "}
                            <span className="font-medium text-slate-700">{reservation.patientName}</span>?
                            Esta acción no se puede deshacer.
                        </AlertDialog.Description>
                        <div className="mt-6 flex gap-3">
                            <AlertDialog.Cancel asChild>
                                <button className="h-10 flex-1 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    Cancelar
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    onClick={() => onDelete?.(reservation.id)}
                                    className="h-10 flex-1 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 active:scale-[0.98]"
                                >
                                    Sí, eliminar
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </>
    );
}

// ─── Tabla principal ──────────────────────────────────────────────────────────

export function ReservationsTable({
    reservations, onEdit, onDelete, onChangeStatus,
}: ReservationsTableProps) {
    if (reservations.length === 0) {
        return (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white py-16 shadow-sm">
                <p className="text-sm text-slate-400">
                    No se encontraron reservaciones con los filtros aplicados.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            {/* Header de sección */}
            <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-sm font-semibold text-slate-700">
                    Lista de Reservaciones
                </h2>
            </div>

            {/* Cabecera de columnas */}
            <div className="grid grid-cols-[2fr_1fr_1.2fr_0.9fr_0.9fr_0.8fr_44px] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                <span>Paciente</span>
                <span>Habitación</span>
                <span>Tipo Estancia</span>
                <span>Fecha Inicio</span>
                <span>Fecha Fin</span>
                <span>Estado</span>
                <span />
            </div>

            {/* Filas */}
            {reservations.map((r) => (
                <div
                    key={r.id}
                    className="grid grid-cols-[2fr_1fr_1.2fr_0.9fr_0.9fr_0.8fr_44px] items-center border-t border-slate-100 px-6 py-4 transition-colors hover:bg-slate-50/50"
                >
                    {/* Paciente */}
                    <div className="text-sm font-semibold text-slate-900">
                        {r.patientName}
                    </div>

                    {/* Habitación */}
                    <div>
                        <p className="text-sm font-medium text-slate-800">{r.roomNumber}</p>
                        <p className="text-xs text-slate-400">{r.roomType}</p>
                    </div>

                    {/* Tipo de estancia */}
                    <div>
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getScheduleBadge(r.schedule)}`}>
                            {r.schedule}
                        </span>
                    </div>

                    {/* Fecha inicio */}
                    <div className="text-sm text-slate-600">{r.startDate}</div>

                    {/* Fecha fin */}
                    <div className="text-sm text-slate-600">
                        {formatDateDisplay(r.endDate, r.indefinite)}
                    </div>

                    {/* Estado */}
                    <div>
                        <ReservationStatusBadge status={r.status} />
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <RowActions
                            reservation={r}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onChangeStatus={onChangeStatus}
                        />
                    </div>
                </div>
            ))}

            {/* Footer */}
            <div className="border-t border-slate-100 px-6 py-3">
                <p className="text-xs text-slate-400">
                    Mostrando {reservations.length} reservación{reservations.length !== 1 ? "es" : ""}
                </p>
            </div>
        </div>
    );
}