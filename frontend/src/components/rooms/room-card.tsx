"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import {
    BedDouble, CalendarCheck, CheckCircle2,
    Eye, MoreHorizontal, Pencil, Trash2, Wrench, XCircle,
} from "lucide-react";
import { Room, RoomStatus } from "@/types/room";

interface RoomCardProps {
    room: Room;
    onView: (room: Room) => void;
    onChangeStatus?: (id: string, status: RoomStatus) => void;
    onDelete?: (id: string) => void;
}

// ── Estilos por estado ────────────────────────────────────────────────────────

const statusConfig: Record<RoomStatus, {
    cardBg: string; badge: string; badgeLabel: string;
    icon: React.ElementType; iconColor: string;
}> = {
    disponible: {
        cardBg: "bg-emerald-50 border-emerald-200",
        badge: "bg-emerald-500 text-white",
        badgeLabel: "Disponible",
        icon: CheckCircle2,
        iconColor: "text-emerald-600",
    },
    reservada: {
        cardBg: "bg-blue-50 border-blue-200",
        badge: "bg-blue-500 text-white",
        badgeLabel: "Reservada",
        icon: CalendarCheck,
        iconColor: "text-blue-600",
    },
    mantenimiento: {
        cardBg: "bg-amber-50 border-amber-200",
        badge: "bg-amber-500 text-white",
        badgeLabel: "Mantenimiento",
        icon: Wrench,
        iconColor: "text-amber-600",
    },
    cerrada: {
        cardBg: "bg-red-50 border-red-200",
        badge: "bg-red-500 text-white",
        badgeLabel: "Cerrada",
        icon: XCircle,
        iconColor: "text-red-500",
    },
};

const statusChangeOptions: { label: string; value: RoomStatus }[] = [
    { label: "Marcar como disponible", value: "disponible" },
    { label: "Marcar como reservada", value: "reservada" },
    { label: "Poner en mantenimiento", value: "mantenimiento" },
    { label: "Cerrar habitación", value: "cerrada" },
];

export function RoomCard({ room, onView, onChangeStatus, onDelete }: RoomCardProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const cfg = statusConfig[room.status];
    const Icon = cfg.icon;

    return (
        <>
            <div className={`relative rounded-2xl border p-4 transition-shadow hover:shadow-md ${cfg.cardBg}`}>
                {/* Número + ojo */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${cfg.iconColor}`} />
                        <span className="text-2xl font-bold text-slate-800">
                            {room.roomNumber}
                        </span>
                    </div>
                    <button
                        onClick={() => onView(room)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 text-slate-500 transition hover:bg-white hover:text-slate-700"
                        aria-label="Ver detalle"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                </div>

                {/* Badge estado */}
                <div className="mt-2">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}>
                        {cfg.badgeLabel}
                    </span>
                </div>

                {/* Tipo + piso */}
                <p className="mt-1.5 text-xs text-slate-500">
                    {room.type} · Piso {room.floor}
                </p>

                {/* Paciente (si reservada) */}
                {room.status === "reservada" && room.patientName && (
                    <p className="mt-2 truncate text-sm font-semibold text-slate-800">
                        {room.patientName}
                    </p>
                )}

                {/* Menú */}
                <div className="mt-3 flex justify-end">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/70 text-slate-500 hover:bg-white hover:text-slate-700">
                                <MoreHorizontal className="h-4 w-4" />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                align="end"
                                sideOffset={4}
                                className="z-[9999] min-w-[210px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
                            >
                                <DropdownMenu.Item
                                    onSelect={() => onView(room)}
                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                                >
                                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                                    Ver detalle / registrar
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />

                                {statusChangeOptions
                                    .filter((o) => o.value !== room.status)
                                    .map((opt) => (
                                        <DropdownMenu.Item
                                            key={opt.value}
                                            onSelect={() => onChangeStatus?.(room.id, opt.value)}
                                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                                        >
                                            <Pencil className="h-3.5 w-3.5 text-slate-400" />
                                            {opt.label}
                                        </DropdownMenu.Item>
                                    ))}

                                <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />

                                <DropdownMenu.Item
                                    onSelect={() => setConfirmOpen(true)}
                                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Eliminar habitación
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </div>
            </div>

            {/* Confirmación eliminar */}
            <AlertDialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 z-[9998] bg-black/40 animate-in fade-in-0" />
                    <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <Trash2 className="h-5 w-5 text-red-500" />
                        </div>
                        <AlertDialog.Title className="text-center text-base font-semibold text-slate-900">
                            Eliminar habitación
                        </AlertDialog.Title>
                        <AlertDialog.Description className="mt-2 text-center text-sm text-slate-500">
                            ¿Eliminar la habitación{" "}
                            <span className="font-medium text-slate-700">{room.roomNumber}</span>?
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
                                    onClick={() => onDelete?.(room.id)}
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