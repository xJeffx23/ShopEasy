"use client";

import { useMemo, useState } from "react";
import { PatientsHeader } from "@/src/components/patients/patients-header";
import { PatientsStats } from "@/src/components/patients/patients-stats";
import { PatientsFilters } from "@/src/components/patients/patients-filters";
import { PatientsTable } from "@/src/components/patients/patients-table";
import type { Patient, PatientsData, PatientStats, PatientStatus } from "@/src/types/patient";

interface PatientsViewProps {
    data: PatientsData;
}

function normalize(str: string): string {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function computeStats(patients: Patient[]): PatientStats {
    const low = ["Asistencia básica", "Asistencia para movilidad"] as const;
    const mid = ["Asistencia para alimentación", "Asistencia para baño"] as const;
    return {
        total: patients.length,
        lowAssistance: patients.filter((p) => (low as readonly string[]).includes(p.assistanceLevel)).length,
        midAssistance: patients.filter((p) => (mid as readonly string[]).includes(p.assistanceLevel)).length,
        highAssistance: patients.filter((p) => p.assistanceLevel === "Asistencia completa").length,
    };
}

export default function PatientsView({ data }: PatientsViewProps) {
    const [patients, setPatients] = useState<Patient[]>(data.patients);
    const [search, setSearch] = useState("");
    const [assistanceFilter, setAssist] = useState("all");
    const [statusFilter, setStatus] = useState("all");

    // ── Filtrado ──────────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        const q = normalize(search.trim());
        return patients.filter((p) => {
            const matchSearch =
                q.length === 0 ||
                normalize(p.fullName).includes(q) ||
                normalize(p.roomNumber).includes(q) ||
                normalize(p.patientCode).includes(q) ||
                normalize(p.idNumber).includes(q);

            const matchAssist = assistanceFilter === "all" || p.assistanceLevel === assistanceFilter;
            const matchStatus = statusFilter === "all" || p.status === statusFilter;

            return matchSearch && matchAssist && matchStatus;
        });
    }, [patients, search, assistanceFilter, statusFilter]);

    const stats = useMemo(() => computeStats(patients), [patients]);

    // ── Acciones CRUD preparadas para el backend ──────────────────────────────

    /**
     * Agregar paciente.
     * Backend: POST /api/patients
     */
    function handleAdd() {
        // TODO: abrir AddPatientDialog
        console.log("[handleAdd] abrir dialog de agregar paciente");
    }

    /**
     * Exportar reporte.
     * Backend: GET /api/patients/report
     */
    function handleExport() {
        // TODO: await fetch(`/api/patients/report`) y descargar PDF/Excel
        console.log("[handleExport] exportar reporte de pacientes");
    }

    /**
     * Editar paciente.
     * Backend: PUT /api/patients/:id
     */
    function handleEdit(patient: Patient) {
        // TODO: abrir EditPatientDialog con datos precargados
        console.log("[handleEdit] Paciente a editar:", patient);
    }

    /**
     * Eliminar paciente.
     * Backend: DELETE /api/patients/:id
     */
    function handleDelete(id: string) {
        setPatients((prev) => prev.filter((p) => p.id !== id));
        // TODO: await deletePatient(id)
    }

    /**
     * Activar / desactivar paciente.
     * Backend: PATCH /api/patients/:id/status  { status: newStatus }
     */
    function handleToggleStatus(id: string, newStatus: PatientStatus) {
        setPatients((prev) =>
            prev.map((p) => p.id === id ? { ...p, status: newStatus } : p)
        );
        // TODO: await updatePatientStatus(id, newStatus)
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <section className="space-y-6">
            <PatientsHeader
                title={data.title}
                subtitle={data.subtitle}
                onAdd={handleAdd}
                onExport={handleExport}
            />

            <PatientsStats stats={stats} />

            <PatientsFilters
                search={search}
                assistanceFilter={assistanceFilter}
                statusFilter={statusFilter}
                onSearchChange={setSearch}
                onAssistanceChange={setAssist}
                onStatusChange={setStatus}
            />

            <PatientsTable
                patients={filtered}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
            />
        </section>
    );
}