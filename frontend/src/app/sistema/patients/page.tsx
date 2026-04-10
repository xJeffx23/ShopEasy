"use client";

import { useState, useEffect } from "react";
import PatientsView from "@/src/components/patients/patientsView";
import { getPatientsData } from "@/src/services/patients.service";
import type { PatientsData } from "@/src/types/patient";

export default function PatientsPage() {
    const [data, setData] = useState<PatientsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const patientsData = await getPatientsData();
                setData(patientsData);
            } catch (err) {
                console.error('Error loading patients:', err);
                setError('Error al cargar los pacientes');
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
                    <p>{error || 'No se pudieron cargar los datos de pacientes'}</p>
                </div>
            </div>
        );
    }

    return <PatientsView data={data} />;
}