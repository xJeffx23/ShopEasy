"use client";

import { useMemo, useState } from "react";
import { ReservationsHeader } from "@/src/components/reservations/reservations-header";
import { ReservationsStats } from "@/src/components/reservations/reservations-stats";
import { ReservationsFilters } from "@/src/components/reservations/reservations-filters";
import { ReservationsTable } from "@/src/components/reservations/reservations-table";
import AddReservationDialog from "@/src/components/reservations/add-reservation-dialog";
import { EditReservationDialog } from "@/src/components/reservations/edit-reservation-dialog";
import { createReservation, updateReservation, deleteReservation, updateReservationStatus } from "@/src/services/reservations.service";
import type {
    Reservation, ReservationsData,
    ReservationStats, ReservationStatus,
} from "@/src/types/reservation";

interface ReservationsViewProps {
    data: ReservationsData;
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
        } catch (error) {
            console.error('Error creating reservation:', error);
            // TODO: Mostrar mensaje de error al usuario
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
        console.log("[handleReservationUpdated] Reservación actualizada:", updatedReservation);
    }

    /**
     * Eliminar reservación.
     * Backend: DELETE /api/reservations/:id
     */
    async function handleDelete(id: string) {
        try {
            await deleteReservation(id);
            setReservations((prev) => prev.filter((r) => r.id !== id));
        } catch (error) {
            console.error('Error deleting reservation:', error);
            // TODO: Mostrar mensaje de error al usuario
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
        } catch (error) {
            console.error('Error updating reservation status:', error);
            // TODO: Mostrar mensaje de error al usuario
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
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