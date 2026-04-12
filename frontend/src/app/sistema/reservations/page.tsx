"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import ReservationsView from "@/components/reservations/reservations-view";
import { getReservationsData } from "@/services/reservations.service";
import type { ReservationsData } from "@/types/reservation";

export default function ReservationsPage() {
    const [data, setData] = useState<ReservationsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const reservationsData = await getReservationsData();
                setData(reservationsData);
            } catch (err) {
                console.error("Error loading reservations:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><p>Cargando reservaciones...</p></div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Error al cargar datos</p></div>;
    }

    return <ReservationsView data={data} />;
}