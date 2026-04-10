"use client";

import { useState, useEffect } from "react";
import DashboardView from "@/src/components/dashboard/dashboardView";
import { getDashboardData } from "@/src/services/dashboard.service";
import type { DashboardData } from "@/src/types/dashboard";

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const dashboardData = await getDashboardData();
                setData(dashboardData);
            } catch (err) {
                console.error('Error loading dashboard:', err);
                setError('Error al cargar el dashboard');
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
                    <p>{error || 'No se pudieron cargar los datos del dashboard'}</p>
                </div>
            </div>
        );
    }

    return <DashboardView data={data} />;
}