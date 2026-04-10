"use client";

import { useState, useEffect } from "react";
import RoomsView from "@/src/components/rooms/rooms-view";
import { getRoomsData } from "@/src/services/rooms.service";
import type { RoomsData } from "@/src/types/room";

export default function RoomsPage() {
    const [data, setData] = useState<RoomsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const roomsData = await getRoomsData();
                setData(roomsData);
            } catch (err) {
                console.error('Error loading rooms:', err);
                setError('Error al cargar las habitaciones');
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
                    <p>{error || 'No se pudieron cargar los datos de habitaciones'}</p>
                </div>
            </div>
        );
    }

    return <RoomsView data={data} />;
}