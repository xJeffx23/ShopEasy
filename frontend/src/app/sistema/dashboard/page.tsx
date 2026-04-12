"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import DashboardView from "@/components/dashboard/dashboardView";
import { getDashboardData } from "@/services/dashboard.service";
import type { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const dashboardData = await getDashboardData();
                setData(dashboardData);
            } catch (err) {
                console.error("Error loading dashboard:", err);
                setError("Error al cargar el dashboard");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Cargando dashboard...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-red-500">{error || "Error al cargar datos"}</p>
            </div>
        );
    }

    return <DashboardView data={data} />;
}