"use client";

import { useMemo, useState } from "react";
import { RoomsHeader } from "@/components/rooms/rooms-header";
import { RoomsStatusSummary } from "@/components/rooms/rooms-status-summary";
import { RoomsGrid } from "@/components/rooms/rooms-grid";
import AddRoomDialog from "@/components/rooms/add-room-dialog";
import { createRoom, updateRoomStatus, deleteRoom } from "@/services/rooms.service";
import type {
    Room, RoomCleaning, RoomMaintenance,
    RoomsData, RoomStats, RoomStatus,
} from "@/types/room";

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
    const [isLoading, setIsLoading] = useState(false);

    const stats = useMemo(() => computeStats(rooms), [rooms]);

    async function handleAdd(roomData: any) {
        setIsLoading(true);
        try {
            const newRoom = await createRoom(roomData);
            setRooms((prev) => [...prev, newRoom]);
            setDialog(false);
        } catch (error) {
            console.error("Error creating room:", error);
            alert("Error al crear habitación");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleChangeStatus(id: string, status: RoomStatus) {
        setIsLoading(true);
        try {
            await updateRoomStatus(id, status);
            setRooms((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
        } catch (error) {
            console.error("Error updating room status:", error);
            alert("Error al actualizar estado");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Estás seguro de eliminar esta habitación?")) return;

        setIsLoading(true);
        try {
            await deleteRoom(id);
            setRooms((prev) => prev.filter((r) => r.id !== id));
        } catch (error) {
            console.error("Error deleting room:", error);
            alert("Error al eliminar habitación");
        } finally {
            setIsLoading(false);
        }
    }

    function handleAddCleaning(roomId: string, cleaning: RoomCleaning) {
        setRooms((prev) =>
            prev.map((r) =>
                r.id === roomId
                    ? { ...r, cleanings: [...r.cleanings, cleaning] }
                    : r
            )
        );
    }

    function handleAddMaintenance(roomId: string, maintenance: RoomMaintenance) {
        setRooms((prev) =>
            prev.map((r) =>
                r.id === roomId
                    ? { ...r, maintenances: [...r.maintenances, maintenance] }
                    : r
            )
        );
    }

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