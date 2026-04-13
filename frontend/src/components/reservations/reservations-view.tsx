"use client";

import { useMemo, useState } from "react";
import { ReservationsHeader } from "@/src/components/reservations/reservations-header";
import { ReservationsStats } from "@/src/components/reservations/reservations-stats";
import { ReservationsFilters } from "@/src/components/reservations/reservations-filters";
import { ReservationsTable } from "@/src/components/reservations/reservations-table";
import AddReservationDialog from "@/src/components/reservations/add-reservation-dialog";
import { EditReservationDialog } from "@/src/components/reservations/edit-reservation-dialog";
import { createReservation, updateReservation, deleteReservation, updateReservationStatus } from "@/src/services/reservations.service";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import type {
    Reservation, ReservationsData,
    ReservationStats, ReservationStatus,
} from "@/src/types/reservation";

interface ReservationsViewProps {
    data: ReservationsData;
}

interface Notification {
    id: string;
    type: 'success' | 'error';
    message: string;
}

function normalize(str: string): string {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function computeStats(reservations: Reservation[]): ReservationStats {
    const active = reservations.filter((r) => r.status === "activa");
    return {
        active: active.length,
        permanent: active.filter((r) => r.indefinite || r.schedule === "Full estancia").length,
        respite: active.filter((r) => r.schedule !== "Full estancia").length,
    };
}

export default function ReservationsView({ data }: ReservationsViewProps) {
    const [reservations, setReservations] = useState<Reservation[]>(data.reservations);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatus] = useState("all");
    const [scheduleFilter, setSchedule] = useState("all");
    const [isDialogOpen, setDialog] = useState(false);
    const [editDialogOpen, setEditDialog] = useState(false);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // ── Funciones de notificación ─────────────────────────────────────────────

    function showNotification(type: 'success' | 'error', message: string) {
        const id = crypto.randomUUID();
        setNotifications(prev => [...prev, { id, type, message }]);

        // Auto-cerrar después de 6 segundos (más tiempo para errores largos)
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 6000);
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
            // Si es un array de mensajes (validación)
            if (Array.isArray(error.response.data.message)) {
                return error.response.data.message.join(', ');
            }
            return error.response.data.message;
        }
        // Mensaje genérico
        return error.message || 'Ha ocurrido un error inesperado';
    }

    // ── Filtrado ──────────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        const q = normalize(search.trim());
        return reservations.filter((r) => {
            const matchSearch =
                q.length === 0 ||
                normalize(r.patientName).includes(q) ||
                normalize(r.roomNumber).includes(q);
            const matchStatus = statusFilter === "all" || r.status === statusFilter;
            const matchSchedule = scheduleFilter === "all" || r.schedule === scheduleFilter;
            return matchSearch && matchStatus && matchSchedule;
        });
    }, [reservations, search, statusFilter, scheduleFilter]);

    const stats = useMemo(() => computeStats(reservations), [reservations]);

    // ── Acciones CRUD ─────────────────────────────────────────────────────────

    /**
     * Crear reservación.
     * Backend: POST /api/reservations
     */
    async function handleAdd(newRes: any) {
        try {
            console.log('Creating reservation with data:', newRes);
            const createdReservation = await createReservation(newRes);
            setReservations((prev) => [createdReservation, ...prev]);
            setDialog(false);
            showNotification('success', `Reservación creada exitosamente para ${createdReservation.patientName}`);
        } catch (error: any) {
            console.error('Error creating reservation:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    /**
     * Editar reservación.
     * Abre el diálogo de edición con los datos precargados.
     */
    function handleEdit(r: Reservation) {
        setEditingReservation(r);
        setEditDialog(true);
    }

    /**
     * Manejar la actualización de una reservación desde el diálogo de edición.
     */
    function handleReservationUpdated(updatedReservation: Reservation) {
        setReservations((prev) =>
            prev.map((res) => res.id === updatedReservation.id ? updatedReservation : res)
        );
        showNotification('success', 'Reservación actualizada exitosamente');
        console.log("[handleReservationUpdated] Reservación actualizada:", updatedReservation);
    }

    /**
     * Eliminar reservación.
     * Backend: DELETE /api/reservations/:id
     */
    async function handleDelete(id: string) {
        try {
            const deletedRes = reservations.find(r => r.id === id);
            await deleteReservation(id);
            setReservations((prev) => prev.filter((r) => r.id !== id));
            showNotification('success', `Reservación de ${deletedRes?.patientName || 'paciente'} eliminada`);
        } catch (error: any) {
            console.error('Error deleting reservation:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    /**
     * Cambiar estado.
     * Backend: PATCH /api/reservations/:id/status  { status }
     */
    async function handleChangeStatus(id: string, status: ReservationStatus) {
        try {
            const updatedReservation = await updateReservationStatus(id, status);
            setReservations((prev) =>
                prev.map((r) => r.id === id ? updatedReservation : r)
            );

            const statusMessages: Record<string, string> = {
                'activa': 'activada',
                'finalizada': 'finalizada',
                'cancelada': 'cancelada',
                'pendiente': 'puesta en pendiente'
            };
            showNotification('success', `Reservación ${statusMessages[status] || 'actualizada'}`);
        } catch (error: any) {
            console.error('Error updating reservation status:', error);
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
                <ReservationsHeader
                    title={data.title}
                    subtitle={data.subtitle}
                    onAdd={() => setDialog(true)}
                />

                <ReservationsStats stats={stats} />

                <ReservationsFilters
                    search={search}
                    statusFilter={statusFilter}
                    scheduleFilter={scheduleFilter}
                    onSearchChange={setSearch}
                    onStatusChange={setStatus}
                    onScheduleChange={setSchedule}
                />

                <ReservationsTable
                    reservations={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onChangeStatus={handleChangeStatus}
                />
            </section>

            <AddReservationDialog
                open={isDialogOpen}
                onOpenChange={setDialog}
                onSubmit={handleAdd}
            />

            <EditReservationDialog
                open={editDialogOpen}
                onOpenChange={setEditDialog}
                reservation={editingReservation}
                onReservationUpdated={handleReservationUpdated}
            />
        </>
    );
}