"use client";

import { useMemo, useState } from "react";
import { PatientsHeader } from "@/src/components/patients/patients-header";
import { PatientsStats } from "@/src/components/patients/patients-stats";
import { PatientsFilters } from "@/src/components/patients/patients-filters";
import { PatientsTable } from "@/src/components/patients/patients-table";
import AddPatientDialog from "@/src/components/patients/add-patient-dialog";
import EditPatientDialog from "@/src/components/patients/EditPatientDialog";
import { createPatient, updatePatient, deletePatient, updatePatientStatus } from "@/src/services/patients.service";
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
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

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

    // ── Acciones CRUD ─────────────────────────────────────────────────────────

    /**
     * Agregar paciente.
     * Backend: POST /api/patients
     */
    async function handleAdd(newPatient: any) {
        try {
            const createdPatient = await createPatient(newPatient);
            setPatients((prev) => [createdPatient, ...prev]);
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error creating patient:', error);
            // TODO: Mostrar mensaje de error al usuario
        }
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
    async function handleEdit(patient: Patient) {
        setEditingPatient(patient);
        setEditDialogOpen(true);
    }

    /**
     * Manejar la actualización del paciente desde el diálogo
     */
    async function handleUpdatePatient(updatedPatient: any) {
        try {
            const updated = await updatePatient(editingPatient!.id, updatedPatient);
            setPatients((prev) =>
                prev.map((p) => p.id === editingPatient!.id ? updated : p)
            );
            setEditDialogOpen(false);
            setEditingPatient(null);
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    }

    /**
     * Eliminar paciente.
     * Backend: DELETE /api/patients/:id
     */
    async function handleDelete(id: string) {
        try {
            await deletePatient(id);
            setPatients((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting patient:', error);
            // TODO: Mostrar mensaje de error al usuario
        }
    }

    /**
     * Activar / desactivar paciente.
     * Backend: PATCH /api/patients/:id/status  { status: newStatus }
     */
    async function handleToggleStatus(id: string, newStatus: PatientStatus) {
        try {
            const updatedPatient = await updatePatientStatus(id, newStatus);
            setPatients((prev) =>
                prev.map((p) => p.id === id ? updatedPatient : p)
            );
        } catch (error) {
            console.error('Error updating patient status:', error);
            // TODO: Mostrar mensaje de error al usuario
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            <section className="space-y-6">
                <PatientsHeader
                    title={data.title}
                    subtitle={data.subtitle}
                    onAdd={() => setIsDialogOpen(true)}
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

            <AddPatientDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleAdd}
                nextPatientNumber={patients.length + 1}
            />

            <EditPatientDialog
                patient={editingPatient!}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onPatientUpdated={handleUpdatePatient}
            />
        </>
    );
}