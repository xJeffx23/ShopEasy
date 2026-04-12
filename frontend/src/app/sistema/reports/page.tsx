"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import ReportsView from "@/components/reports/reports-view";
import { getReportsData } from "@/services/reports.service";
import type { ReportsData } from "@/types/report";

export default function ReportsPage() {
    const [data, setData] = useState<ReportsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const reportsData = await getReportsData();
                setData(reportsData);
            } catch (err) {
                console.error("Error loading reports:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><p>Cargando reportes...</p></div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Error al cargar datos</p></div>;
    }

    return <ReportsView data={data} />;
}