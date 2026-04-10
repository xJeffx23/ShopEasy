"use client";

import { useState, useEffect } from "react";
import EmployeesView from "@/src/components/employees/employees-view";
import { getEmployeesData } from "@/src/services/employees.service";
import type { EmployeesData } from "@/src/types/employee";

export default function EmployeesPage() {
    const [data, setData] = useState<EmployeesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const employeesData = await getEmployeesData();
                setData(employeesData);
            } catch (err) {
                console.error('Error loading employees:', err);
                setError('Error al cargar los empleados');
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
                    <p>{error || 'No se pudieron cargar los datos de empleados'}</p>
                </div>
            </div>
        );
    }

    return <EmployeesView data={data} />;
}