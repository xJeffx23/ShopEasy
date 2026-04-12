"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import PatientPanelView from "@/components/patient-panel/patient-panel-view";
import { getPatientPanelData } from "@/services/patient-panel.service";
import type { PatientPanelData } from "@/types/patient-panel";

export default function PatientPanelPage() {
    const [data, setData] = useState<PatientPanelData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const panelData = await getPatientPanelData();
                setData(panelData);
            } catch (err) {
                console.error("Error loading patient panel:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><p>Cargando panel...</p></div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Error al cargar datos</p></div>;
    }

    return <PatientPanelView data={data} />;
}