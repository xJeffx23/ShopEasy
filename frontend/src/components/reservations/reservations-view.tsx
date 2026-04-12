"use client";

import { useMemo, useState } from "react";
import { ReservationsHeader } from "@/components/reservations/reservations-header";
import { ReservationsStats } from "@/components/reservations/reservations-stats";
import { ReservationsFilters } from "@/components/reservations/reservations-filters";
import { ReservationsTable } from "@/components/reservations/reservations-table";
import AddReservationDialog from "@/components/reservations/add-reservation-dialog";
import type {
    Reservation, ReservationsData,
    ReservationStats, ReservationStatus,
} from "@/types/reservation";

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
    function handleAdd(newRes: Reservation) {
        setReservations((prev) => [newRes, ...prev]);
        // TODO: await createReservation(newRes)
    }

    /**
     * Editar reservación.
     * Backend: PUT /api/reservations/:id
     */
    function handleEdit(r: Reservation) {
        // TODO: abrir EditReservationDialog con datos precargados
        console.log("[handleEdit] Reservación:", r);
    }

    /**
     * Eliminar reservación.
     * Backend: DELETE /api/reservations/:id
     */
    function handleDelete(id: string) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        // TODO: await deleteReservation(id)
    }

    /**
     * Cambiar estado.
     * Backend: PATCH /api/reservations/:id/status  { status }
     */
    function handleChangeStatus(id: string, status: ReservationStatus) {
        setReservations((prev) =>
            prev.map((r) => r.id === id ? { ...r, status } : r)
        );
        // TODO: await updateReservationStatus(id, status)
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
        </>
    );
}