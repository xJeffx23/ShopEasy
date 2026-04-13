"use client";

import { useMemo, useState } from "react";
import { PatientsHeader } from "@/src/components/patients/patients-header";
import { PatientsStats } from "@/src/components/patients/patients-stats";
import { PatientsFilters } from "@/src/components/patients/patients-filters";
import { PatientsTable } from "@/src/components/patients/patients-table";
import AddPatientDialog from "@/src/components/patients/add-patient-dialog";
import EditPatientDialog from "@/src/components/patients/EditPatientDialog";
import { createPatient, updatePatient, deletePatient, updatePatientStatus, getPatientById } from "@/src/services/patients.service";
import { Paciente } from "@/src/services/pacientes.service";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import type { Patient, PatientsData, PatientStats, PatientStatus } from "@/src/types/patient";

interface PatientsViewProps {
    data: PatientsData;
}

interface Notification {
    id: string;
    type: 'success' | 'error';
    message: string;
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
    const [editingPatient, setEditingPatient] = useState<Paciente | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // ── Funciones de notificación ─────────────────────────────────────────────

    function showNotification(type: 'success' | 'error', message: string) {
        const id = crypto.randomUUID();
        setNotifications(prev => [...prev, { id, type, message }]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 6000);
    }

    function dismissNotification(id: string) {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    function getErrorMessage(error: any): string {
        if (error.response?.data?.message) {
            if (Array.isArray(error.response.data.message)) {
                return error.response.data.message.join(', ');
            }
            return error.response.data.message;
        }
        return error.message || 'Ha ocurrido un error inesperado';
    }

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
            showNotification('success', `Paciente ${createdPatient.fullName} registrado exitosamente`);
        } catch (error: any) {
            console.error('Error creating patient:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    /**
     * Exportar reporte.
     * Backend: GET /api/patients/report
     */
    function handleExport() {
        // TODO: await fetch(`/api/patients/report`) y descargar PDF/Excel
        console.log("[handleExport] exportar reporte de pacientes");
        showNotification('success', 'Exportando reporte de pacientes...');
    }

    /**
     * Editar paciente.
     * Backend: PUT /api/patients/:id
     */
    async function handleEdit(patient: Patient) {
        try {
            // Obtener los datos completos del paciente del backend
            const pacienteCompleto = await getPatientById(patient.id);
            setEditingPatient(pacienteCompleto);
            setEditDialogOpen(true);
        } catch (error: any) {
            console.error('Error fetching patient:', error);
            showNotification('error', 'Error al cargar datos del paciente');
        }
    }

    /**
     * Manejar la actualización del paciente desde el diálogo
     * El EditPatientDialog ya hace el update, solo refrescamos la lista
     */
    async function handlePatientUpdated() {
        try {
            // Recargar el paciente actualizado
            if (editingPatient) {
                const updated = await getPatientById(editingPatient.idPaciente.toString());
                // Convertir Paciente a Patient para el estado local
                const patientForState: Patient = {
                    id: updated.idPaciente.toString(),
                    patientCode: `PAC-${String(updated.idPaciente).padStart(3, '0')}`,
                    fullName: updated.Nombre,
                    idNumber: updated.Numero_Cedula,
                    birthDate: new Date(updated.Fecha_Nacimiento).toLocaleDateString('es-CR'),
                    age: calculateAge(new Date(updated.Fecha_Nacimiento)),
                    admissionDate: updated.Fecha_Ingreso ? new Date(updated.Fecha_Ingreso).toLocaleDateString('es-CR') : new Date().toLocaleDateString('es-CR'),
                    roomNumber: '',
                    assistanceLevel: mapAssistanceLevel(updated.Catalogo_Nivel_Asistencia_idNivel) as Patient['assistanceLevel'],
                    emergencyContact: {
                        name: updated.Nombre_Contacto_Emergencia || '',
                        phone: updated.Telefono_Contacto_Emergencia || ''
                    },
                    status: updated.Activo ? 'activo' : 'inactivo',
                    medications: [],
                    specialCares: [],
                    packages: []
                };
                setPatients((prev) =>
                    prev.map((p) => p.id === patientForState.id ? patientForState : p)
                );
                showNotification('success', `Paciente ${updated.Nombre} actualizado exitosamente`);
            }
            setEditDialogOpen(false);
            setEditingPatient(null);
        } catch (error: any) {
            console.error('Error refreshing patient:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    function mapAssistanceLevel(levelId: number): Patient['assistanceLevel'] {
        const levels: Record<number, Patient['assistanceLevel']> = {
            1: 'Asistencia básica',
            2: 'Asistencia para movilidad',
            3: 'Asistencia para alimentación',
            4: 'Asistencia para baño',
            5: 'Asistencia completa'
        };
        return levels[levelId] || 'Asistencia básica';
    }

    function calculateAge(birthDate: Date): number {
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1;
        }
        return age;
    }

    /**
     * Eliminar paciente.
     * Backend: DELETE /api/patients/:id
     */
    async function handleDelete(id: string) {
        try {
            const deletedPatient = patients.find(p => p.id === id);
            await deletePatient(id);
            setPatients((prev) => prev.filter((p) => p.id !== id));
            showNotification('success', `Paciente ${deletedPatient?.fullName || ''} eliminado`);
        } catch (error: any) {
            console.error('Error deleting patient:', error);
            showNotification('error', getErrorMessage(error));
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
            const statusText = newStatus === 'activo' ? 'activado' : 'desactivado';
            showNotification('success', `Paciente ${updatedPatient.fullName} ${statusText}`);
        } catch (error: any) {
            console.error('Error updating patient status:', error);
            showNotification('error', getErrorMessage(error));
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Sistema de notificaciones */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-right-5 ${notification.type === 'success'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                    >
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm flex-1">{notification.message}</p>
                        <button
                            onClick={() => dismissNotification(notification.id)}
                            className="shrink-0 p-1 rounded-lg hover:bg-black/5"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

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
                onPatientUpdated={handlePatientUpdated}
            />
        </>
    );
}