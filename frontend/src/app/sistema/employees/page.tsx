"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import EmployeesView from "@/components/employees/employees-view";
import { getEmployeesData } from "@/services/employees.service";
import type { EmployeesData } from "@/types/employee";

export default function EmployeesPage() {
    const [data, setData] = useState<EmployeesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const employeesData = await getEmployeesData();
                setData(employeesData);
            } catch (err) {
                console.error("Error loading employees:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><p>Cargando empleados...</p></div>;
    }

    if (!data) {
        return <div className="flex items-center justify-center min-h-screen"><p className="text-red-500">Error al cargar datos</p></div>;
    }

    return <EmployeesView data={data} />;
}