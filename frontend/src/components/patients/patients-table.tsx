"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Eye, MoreHorizontal, Pencil, Trash2, UserCheck, UserX, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Patient, PatientStatus, AssistanceLevel } from "@/src/types/patient";
import { PatientDetailModal } from "@/src/components/patients/patient-detail-modal";

interface PatientsTableProps {
    patients: Patient[];
    onEdit?: (patient: Patient) => void;
    onDelete?: (id: string) => void;
    onToggleStatus?: (id: string, newStatus: PatientStatus) => void;
}

function getAssistanceBadge(level: AssistanceLevel) {
    switch (level) {
        case "Asistencia básica":
        case "Asistencia para movilidad":
            return "bg-emerald-100 text-emerald-700";
        case "Asistencia para alimentación":
        case "Asistencia para baño":
            return "bg-amber-100 text-amber-700";
        case "Asistencia completa":
            return "bg-red-100 text-red-700";
    }
}

function getAssistanceShort(level: AssistanceLevel) {
    switch (level) {
        case "Asistencia básica": return "Bajo";
        case "Asistencia para movilidad": return "Bajo";
        case "Asistencia para alimentación": return "Medio";
        case "Asistencia para baño": return "Medio";
        case "Asistencia completa": return "Alto";
    }
}

function getInitials(name: string) {
    return name.trim().split(" ").filter(Boolean)
        .slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

interface RowActionsProps {
    patient: Patient;
    onView: (patient: Patient) => void;
    onEdit?: (patient: Patient) => void;
    onDelete?: (id: string) => void;
    onToggleStatus?: (id: string, newStatus: PatientStatus) => void;
}

function RowActions({ patient, onView, onEdit, onDelete, onToggleStatus }: RowActionsProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const isActive = patient.status === "activo";
    const nextStatus: PatientStatus = isActive ? "inactivo" : "activo";

    const openPatientPortal = () => {
        window.open('/auth/login-paciente', '_blank');
    };

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none">
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="end"
                        sideOffset={4}
                        className="z-[9999] min-w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
                    >
                        <DropdownMenu.Item
                            onSelect={() => onView(patient)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                        >
                            <Eye className="h-3.5 w-3.5 text-slate-400" />
                            Ver detalle
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            onSelect={() => onEdit?.(patient)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                        >
                            <Pencil className="h-3.5 w-3.5 text-slate-400" />
                            Editar paciente
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            onSelect={openPatientPortal}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-teal-700 outline-none hover:bg-teal-50"
                        >
                            <ExternalLink className="h-3.5 w-3.5 text-teal-500" />
                            Ver portal de paciente
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />

                        <DropdownMenu.Item
                            onSelect={() => onToggleStatus?.(patient.id, nextStatus)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                        >
                            {isActive
                                ? <UserX className="h-3.5 w-3.5 text-amber-500" />
                                : <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                            }
                            {isActive ? "Desactivar paciente" : "Activar paciente"}
                        </DropdownMenu.Item>

                        <DropdownMenu.Item
                            onSelect={() => setConfirmOpen(true)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar paciente
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            <AlertDialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 z-[9998] bg-black/40 animate-in fade-in-0" />
                    <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <Trash2 className="h-5 w-5 text-red-500" />
                        </div>
                        <AlertDialog.Title className="text-center text-base font-semibold text-slate-900">
                            Eliminar paciente
                        </AlertDialog.Title>
                        <AlertDialog.Description className="mt-2 text-center text-sm text-slate-500">
                            ¿Estás seguro de eliminar a{" "}
                            <span className="font-medium text-slate-700">{patient.fullName}</span>?
                            Esta acción no se puede deshacer.
                        </AlertDialog.Description>
                        <div className="mt-6 flex gap-3">
                            <AlertDialog.Cancel asChild>
                                <button className="h-10 flex-1 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    Cancelar
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    onClick={() => onDelete?.(patient.id)}
                                    className="h-10 flex-1 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-700 active:scale-[0.98]"
                                >
                                    Sí, eliminar
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </>
    );
}

export function PatientsTable({
    patients,
    onEdit,
    onDelete,
    onToggleStatus,
}: PatientsTableProps) {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    if (patients.length === 0) {
        return (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white py-16 shadow-sm">
                <p className="text-sm text-slate-400">
                    No se encontraron pacientes con los filtros aplicados.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
                <div className="grid grid-cols-[2fr_0.7fr_0.7fr_1.2fr_1fr_0.8fr_44px] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    <span>Nombre</span>
                    <span>Edad</span>
                    <span>Habitación</span>
                    <span>Nivel de Asistencia</span>
                    <span>Fecha de Ingreso</span>
                    <span>Estado</span>
                    <span />
                </div>

                {patients.map((patient) => (
                    <div
                        key={patient.id}
                        className="grid grid-cols-[2fr_0.7fr_0.7fr_1.2fr_1fr_0.8fr_44px] items-center border-t border-slate-100 px-6 py-4 transition-colors hover:bg-slate-50/50"
                    >
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 shrink-0">
                                <AvatarFallback className="bg-blue-50 text-xs font-semibold text-blue-600">
                                    {getInitials(patient.fullName)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {patient.fullName}
                                </p>
                                <p className="text-xs text-slate-400">{patient.patientCode}</p>
                            </div>
                        </div>

                        <div className="text-sm text-slate-600">{patient.age} años</div>

                        <div className="text-sm font-medium text-slate-700">
                            {patient.roomNumber}
                        </div>

                        <div>
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getAssistanceBadge(patient.assistanceLevel)}`}>
                                {getAssistanceShort(patient.assistanceLevel)}
                            </span>
                        </div>

                        <div className="text-sm text-slate-500">{patient.admissionDate}</div>

                        <div>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${patient.status === "activo"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-slate-100 text-slate-500"
                                }`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${patient.status === "activo" ? "bg-emerald-500" : "bg-slate-400"
                                    }`} />
                                {patient.status === "activo" ? "Activo" : "Inactivo"}
                            </span>
                        </div>

                        <div className="flex justify-end">
                            <RowActions
                                patient={patient}
                                onView={setSelectedPatient}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onToggleStatus={onToggleStatus}
                            />
                        </div>
                    </div>
                ))}

                <div className="border-t border-slate-100 px-6 py-3">
                    <p className="text-xs text-slate-400">
                        Mostrando {patients.length} paciente{patients.length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>

            <PatientDetailModal
                patient={selectedPatient}
                open={!!selectedPatient}
                onClose={() => setSelectedPatient(null)}
            />
        </>
    );
}
