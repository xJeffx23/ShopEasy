"use client";

import { useMemo, useState } from "react";
import { Room, RoomCleaning, RoomMaintenance, RoomStatus, RoomType } from "@/types/room";
import { RoomCard } from "@/components/rooms/room-card";
import { RoomDetailModal } from "@/components/rooms/room-detail-modal";
import FilterCombobox from "@/components/ui/filter-combobox";

interface RoomsGridProps {
    rooms: Room[];
    onChangeStatus?: (id: string, status: RoomStatus) => void;
    onDelete?: (id: string) => void;
    onAddCleaning?: (roomId: string, cleaning: RoomCleaning) => void;
    onAddMaintenance?: (roomId: string, maintenance: RoomMaintenance) => void;
}

const statusOptions = [
    { label: "Todos los estados", value: "all" },
    { label: "Disponible", value: "disponible" },
    { label: "Reservada", value: "reservada" },
    { label: "Mantenimiento", value: "mantenimiento" },
    { label: "Cerrada", value: "cerrada" },
];

const typeOptions = [
    { label: "Todos", value: "all" },
    { label: "Individual", value: "Individual" },
    { label: "Compartida", value: "Compartida" },
    { label: "Individual cama matrimonial", value: "Individual cama matrimonial" },
    { label: "Cuidados especiales", value: "Cuidados especiales" },
];

export function RoomsGrid({
    rooms, onChangeStatus, onDelete, onAddCleaning, onAddMaintenance,
}: RoomsGridProps) {
    const [statusFilter, setStatus] = useState("all");
    const [typeFilter, setType] = useState("all");
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const filtered = useMemo(() =>
        rooms.filter((r) => {
            const matchStatus = statusFilter === "all" || r.status === statusFilter;
            const matchType = typeFilter === "all" || r.type === typeFilter;
            return matchStatus && matchType;
        }),
        [rooms, statusFilter, typeFilter]
    );

    // Siempre pasar la versión actualizada de la habitación al modal
    const liveSelectedRoom = selectedRoom
        ? rooms.find((r) => r.id === selectedRoom.id) ?? null
        : null;

    return (
        <>
            {/* Sección con filtros */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-sm font-semibold text-slate-700">
                    Vista de Habitaciones
                    <span className="ml-2 text-xs font-normal text-slate-400">
                        ({filtered.length} de {rooms.length})
                    </span>
                </h2>
                <div className="flex gap-2">
                    <div className="w-44">
                        <FilterCombobox
                            value={statusFilter}
                            onChange={setStatus}
                            options={statusOptions}
                            placeholder="Todos los estados"
                            searchPlaceholder="Buscar estado..."
                            emptyMessage="No encontrado."
                        />
                    </div>
                    <div className="w-36">
                        <FilterCombobox
                            value={typeFilter}
                            onChange={setType}
                            options={typeOptions}
                            placeholder="Todos"
                            searchPlaceholder="Buscar tipo..."
                            emptyMessage="No encontrado."
                        />
                    </div>
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white py-16 shadow-sm">
                    <p className="text-sm text-slate-400">
                        No hay habitaciones con los filtros seleccionados.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {filtered.map((room) => (
                        <RoomCard
                            key={room.id}
                            room={room}
                            onView={setSelectedRoom}
                            onChangeStatus={onChangeStatus}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}

            {/* Modal de detalle con formularios de registro */}
            <RoomDetailModal
                room={liveSelectedRoom}
                open={!!selectedRoom}
                onClose={() => setSelectedRoom(null)}
                onAddCleaning={onAddCleaning}
                onAddMaintenance={onAddMaintenance}
            />
        </>
    );
}