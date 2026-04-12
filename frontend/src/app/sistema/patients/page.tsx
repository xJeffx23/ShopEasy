"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import PatientsView from "@/components/patients/patientsView";
import { getPatientsData } from "@/services/patients.service";
import type { PatientsData } from "@/types/patient";

export default function PatientsPage() {
    const [data, setData] = useState<PatientsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const patientsData = await getPatientsData();
                setData(patientsData);
            } catch (err) {
                console.error("Error loading patients:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><p>Cargando pacientes...</p></div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Error al cargar datos</p></div>;
    }

    return <PatientsView data={data} />;
}