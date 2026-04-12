"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import RoomsView from "@/components/rooms/rooms-view";
import { getRoomsData } from "@/services/rooms.service";
import type { RoomsData } from "@/types/room";

export default function RoomsPage() {
    const [data, setData] = useState<RoomsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const roomsData = await getRoomsData();
                setData(roomsData);
            } catch (err) {
                console.error("Error loading rooms:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><p>Cargando habitaciones...</p></div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Error al cargar datos</p></div>;
    }

    return <RoomsView data={data} />;
}