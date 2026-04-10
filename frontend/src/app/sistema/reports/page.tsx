"use client";

import { useState, useEffect } from "react";
import ReportsView from "@/src/components/reports/reports-view";
import { getReportsData } from "@/src/services/reports.service";
import type { ReportsData } from "@/src/types/report";

export default function ReportsPage() {
    const [data, setData] = useState<ReportsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const reportsData = await getReportsData();
                setData(reportsData);
            } catch (err) {
                console.error('Error loading reports:', err);
                setError('Error al cargar los reportes');
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
                    <p>{error || 'No se pudieron cargar los datos de reportes'}</p>
                </div>
            </div>
        );
    }

    return <ReportsView data={data} />;
}