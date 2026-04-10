"use client";

import { useState, useEffect } from "react";
import ReservationsView from "@/src/components/reservations/reservations-view";
import { getReservationsData } from "@/src/services/reservations.service";
import type { ReservationsData } from "@/src/types/reservation";

export default function ReservationsPage() {
    const [data, setData] = useState<ReservationsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const reservationsData = await getReservationsData();
                setData(reservationsData);
            } catch (err) {
                console.error('Error loading reservations:', err);
                setError('Error al cargar las reservaciones');
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600 text-center">
                    <h2 className="text-2xl font-bold mb-4">Error</h2>
                    <p>{error || 'No se pudieron cargar los datos de reservaciones'}</p>
                </div>
            </div>
        );
    }

    return <ReservationsView data={data} />;
}