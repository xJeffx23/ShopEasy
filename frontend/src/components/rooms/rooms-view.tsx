"use client";

import { useMemo, useState } from "react";
import { RoomsHeader } from "@/src/components/rooms/rooms-header";
import { RoomsStatusSummary } from "@/src/components/rooms/rooms-status-summary";
import { RoomsGrid } from "@/src/components/rooms/rooms-grid";
import { getRoomsData, createRoom, updateRoomStatus, deleteRoom } from "@/src/services/rooms.service";
import { roomCleaningService, roomMaintenanceService } from "@/src/services/room-operations.service";
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
    async function handleAdd(newRoom: Room) {
        try {
            // Llamar al backend para crear la habitación
            const createdRoom = await createRoom({
                roomNumber: newRoom.roomNumber,
                floor: newRoom.floor,
                type: newRoom.type,
                capacity: newRoom.capacity,
                status: newRoom.status,
                observations: newRoom.observations
            });
            
            // Agregar la habitación creada al estado local
            setRooms((prev) => [...prev, createdRoom]);
        } catch (error) {
            console.error('Error al crear habitación:', error);
            // Aquí podrías mostrar un toast o notificación de error
        }
    }

    /**
     * Cambiar estado.
     * Backend: PATCH /api/rooms/:id/status  { status }
     */
    async function handleChangeStatus(id: string, status: RoomStatus) {
        try {
            // Actualizar en el backend
            const updatedRoom = await updateRoomStatus(id, status);
            
            // Actualizar estado local con la respuesta del backend
            setRooms((prev) => prev.map((r) => r.id === id ? updatedRoom : r));
        } catch (error) {
            console.error('Error al cambiar estado de habitación:', error);
            // Aquí podrías mostrar un toast o notificación de error
        }
    }

    /**
     * Eliminar habitación.
     * Backend: DELETE /api/rooms/:id
     */
    async function handleDelete(id: string) {
        try {
            // Eliminar en el backend
            await deleteRoom(id);
            
            // Eliminar del estado local
            setRooms((prev) => prev.filter((r) => r.id !== id));
        } catch (error) {
            console.error('Error al eliminar habitación:', error);
            // Aquí podrías mostrar un toast o notificación de error
        }
    }

    /**
     * Registrar limpieza (enunciado b.i y b.ii).
     * Backend: POST /api/limpiezas
     */
    async function handleAddCleaning(roomId: string, cleaning: RoomCleaning) {
        try {
            // La limpieza ya se guardó en el backend en el modal
            // Solo actualizamos el estado local
            setRooms((prev) => prev.map((r) => 
                r.id === roomId 
                    ? { ...r, cleanings: [cleaning, ...r.cleanings] }
                    : r
            ));
        } catch (error) {
            console.error('Error al agregar limpieza:', error);
        }
    }

    /**
     * Registrar mantenimiento (enunciado c.i, c.ii, c.iii).
     * Backend: POST /api/mantenimientos
     */
    async function handleAddMaintenance(roomId: string, maintenance: RoomMaintenance) {
        try {
            // El mantenimiento ya se guardó en el backend en el modal
            // Solo actualizamos el estado local
            setRooms((prev) => prev.map((r) => 
                r.id === roomId 
                    ? { ...r, maintenances: [maintenance, ...r.maintenances] }
                    : r
            ));
        } catch (error) {
            console.error('Error al agregar mantenimiento:', error);
        }
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