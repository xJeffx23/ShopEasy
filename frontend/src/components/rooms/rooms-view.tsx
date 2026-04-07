"use client";

import { useMemo, useState } from "react";
import { RoomsHeader } from "@/src/components/rooms/rooms-header";
import { RoomsStatusSummary } from "@/src/components/rooms/rooms-status-summary";
import { RoomsGrid } from "@/src/components/rooms/rooms-grid";
import AddRoomDialog from "@/src/components/rooms/add-room-dialog";
import type {
    Room, RoomCleaning, RoomMaintenance,
    RoomsData, RoomStats, RoomStatus,
} from "@/src/types/room";

interface RoomsViewProps {
    data: RoomsData;
}

function computeStats(rooms: Room[]): RoomStats {
    return {
        available: rooms.filter((r) => r.status === "disponible").length,
        reserved: rooms.filter((r) => r.status === "reservada").length,
        maintenance: rooms.filter((r) => r.status === "mantenimiento").length,
        closed: rooms.filter((r) => r.status === "cerrada").length,
        total: rooms.length,
    };
}

export default function RoomsView({ data }: RoomsViewProps) {
    const [rooms, setRooms] = useState<Room[]>(data.rooms);
    const [isDialogOpen, setDialog] = useState(false);

    const stats = useMemo(() => computeStats(rooms), [rooms]);

    // ── Acciones CRUD preparadas para el backend ──────────────────────────────

    /**
     * Agregar habitación.
     * Backend: POST /api/rooms
     */
    function handleAdd(newRoom: Room) {
        setRooms((prev) => [...prev, newRoom]);
        // TODO: await createRoom(newRoom)
    }

    /**
     * Cambiar estado.
     * Backend: PATCH /api/rooms/:id/status  { status }
     */
    function handleChangeStatus(id: string, status: RoomStatus) {
        setRooms((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
        // TODO: await updateRoomStatus(id, status)
    }

    /**
     * Eliminar habitación.
     * Backend: DELETE /api/rooms/:id
     */
    function handleDelete(id: string) {
        setRooms((prev) => prev.filter((r) => r.id !== id));
        // TODO: await deleteRoom(id)
    }

    /**
     * Registrar limpieza (enunciado b.i y b.ii).
     * Backend: POST /api/rooms/:id/cleanings
     */
    function handleAddCleaning(roomId: string, cleaning: RoomCleaning) {
        setRooms((prev) =>
            prev.map((r) =>
                r.id === roomId
                    ? { ...r, cleanings: [...r.cleanings, cleaning] }
                    : r
            )
        );
        // TODO: await createCleaning(roomId, cleaning)
    }

    /**
     * Registrar mantenimiento (enunciado c.i, c.ii y c.iii).
     * Backend: POST /api/rooms/:id/maintenances
     */
    function handleAddMaintenance(roomId: string, maintenance: RoomMaintenance) {
        setRooms((prev) =>
            prev.map((r) =>
                r.id === roomId
                    ? { ...r, maintenances: [...r.maintenances, maintenance] }
                    : r
            )
        );
        // TODO: await createMaintenance(roomId, maintenance)
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            <section className="space-y-6">
                <RoomsHeader
                    title={data.title}
                    subtitle={data.subtitle}
                    onAdd={() => setDialog(true)}
                />

                <RoomsStatusSummary stats={stats} />

                <RoomsGrid
                    rooms={rooms}
                    onChangeStatus={handleChangeStatus}
                    onDelete={handleDelete}
                    onAddCleaning={handleAddCleaning}
                    onAddMaintenance={handleAddMaintenance}
                />
            </section>

            <AddRoomDialog
                open={isDialogOpen}
                onOpenChange={setDialog}
                onSubmit={handleAdd}
            />
        </>
    );
}