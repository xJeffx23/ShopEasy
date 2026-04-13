"use client";

import { useMemo, useState } from "react";
import { RoomsHeader } from "@/src/components/rooms/rooms-header";
import { RoomsStatusSummary } from "@/src/components/rooms/rooms-status-summary";
import { RoomsGrid } from "@/src/components/rooms/rooms-grid";
import { getRoomsData, createRoom, updateRoomStatus, deleteRoom } from "@/src/services/rooms.service";
import { roomCleaningService, roomMaintenanceService } from "@/src/services/room-operations.service";
import AddRoomDialog from "@/src/components/rooms/add-room-dialog";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import type {
    Room, RoomCleaning, RoomMaintenance,
    RoomsData, RoomStats, RoomStatus,
} from "@/src/types/room";

interface RoomsViewProps {
    data: RoomsData;
}

interface Notification {
    id: string;
    type: 'success' | 'error';
    message: string;
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
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const stats = useMemo(() => computeStats(rooms), [rooms]);

    // ── Funciones de notificación ─────────────────────────────────────────────

    function showNotification(type: 'success' | 'error', message: string) {
        const id = crypto.randomUUID();
        setNotifications(prev => [...prev, { id, type, message }]);

        // Auto-cerrar después de 5 segundos
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }

    function dismissNotification(id: string) {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    /**
     * Extrae el mensaje de error de una respuesta de Axios
     */
    function getErrorMessage(error: any): string {
        // Si el backend envió un mensaje de error específico
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        // Si es un array de mensajes (validación)
        if (Array.isArray(error.response?.data?.message)) {
            return error.response.data.message.join(', ');
        }
        // Mensaje genérico
        return error.message || 'Ha ocurrido un error inesperado';
    }

    // ── Acciones CRUD preparadas para el backend ──────────────────────────────

    /**
     * Agregar habitación.
     * Backend: POST /api/rooms
     */
    async function handleAdd(newRoom: Room) {
        try {
            const createdRoom = await createRoom({
                roomNumber: newRoom.roomNumber,
                floor: newRoom.floor,
                type: newRoom.type,
                capacity: newRoom.capacity,
                status: newRoom.status,
                observations: newRoom.observations
            });

            setRooms((prev) => [...prev, createdRoom]);
            showNotification('success', `Habitación ${createdRoom.roomNumber} creada exitosamente`);
        } catch (error: any) {
            console.error('Error al crear habitación:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    /**
     * Cambiar estado.
     * Backend: PATCH /api/rooms/:id/status  { status }
     */
    async function handleChangeStatus(id: string, status: RoomStatus) {
        try {
            const updatedRoom = await updateRoomStatus(id, status);
            setRooms((prev) => prev.map((r) => r.id === id ? updatedRoom : r));
            showNotification('success', `Estado de habitación actualizado a "${status}"`);
        } catch (error: any) {
            console.error('Error al cambiar estado de habitación:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    /**
     * Eliminar habitación.
     * Backend: DELETE /api/rooms/:id
     */
    async function handleDelete(id: string) {
        try {
            await deleteRoom(id);
            const deletedRoom = rooms.find(r => r.id === id);
            setRooms((prev) => prev.filter((r) => r.id !== id));
            showNotification('success', `Habitación ${deletedRoom?.roomNumber || ''} eliminada`);
        } catch (error: any) {
            console.error('Error al eliminar habitación:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    /**
     * Registrar limpieza (enunciado b.i y b.ii).
     * Backend: POST /api/limpiezas
     */
    async function handleAddCleaning(roomId: string, cleaning: RoomCleaning) {
        try {
            setRooms((prev) => prev.map((r) =>
                r.id === roomId
                    ? { ...r, cleanings: [cleaning, ...r.cleanings] }
                    : r
            ));
            showNotification('success', 'Limpieza registrada exitosamente');
        } catch (error: any) {
            console.error('Error al agregar limpieza:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    /**
     * Registrar mantenimiento (enunciado c.i, c.ii, c.iii).
     * Backend: POST /api/mantenimientos
     */
    async function handleAddMaintenance(roomId: string, maintenance: RoomMaintenance) {
        try {
            setRooms((prev) => prev.map((r) =>
                r.id === roomId
                    ? { ...r, maintenances: [maintenance, ...r.maintenances] }
                    : r
            ));
            showNotification('success', 'Mantenimiento registrado exitosamente');
        } catch (error: any) {
            console.error('Error al agregar mantenimiento:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Sistema de notificaciones */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-right-5 ${notification.type === 'success'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                    >
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm flex-1">{notification.message}</p>
                        <button
                            onClick={() => dismissNotification(notification.id)}
                            className="shrink-0 p-1 rounded-lg hover:bg-black/5"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

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