"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Package, Pill, ShieldAlert, X } from "lucide-react";
import { Patient } from "@/src/types/patient";

interface PatientDetailModalProps {
    patient: Patient | null;
    open: boolean;
    onClose: () => void;
}

type Tab = "medications" | "cares" | "packages";

function getAssistanceBadge(level: Patient["assistanceLevel"]) {
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

export function PatientDetailModal({
    patient,
    open,
    onClose,
}: PatientDetailModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>("medications");

    if (!patient) return null;

    const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
        { id: "medications", label: "Medicamentos", icon: <Pill className="h-4 w-4" /> },
        { id: "cares", label: "Cuidados", icon: <ShieldAlert className="h-4 w-4" /> },
        { id: "packages", label: "Paquetes", icon: <Package className="h-4 w-4" /> },
    ];

    return (
        <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/40 animate-in fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in-0 zoom-in-95 focus:outline-none">

                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
                        <Dialog.Title className="text-base font-semibold text-slate-900">
                            Detalle del Paciente
                        </Dialog.Title>
                        <button
                            onClick={onClose}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Info principal */}
                        <div className="rounded-xl bg-slate-50 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-lg font-bold text-slate-900">
                                        {patient.fullName}
                                    </p>
                                    <p className="text-sm text-slate-500">{patient.age} años</p>
                                    <p className="text-sm text-slate-500">
                                        Habitación: {patient.roomNumber}
                                    </p>
                                </div>
                                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getAssistanceBadge(patient.assistanceLevel)}`}>
                                    {patient.assistanceLevel}
                                </span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Contenido del tab */}
                        <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">

                            {/* Tab: Medicamentos */}
                            {activeTab === "medications" && (
                                <>
                                    {patient.medications.length === 0 ? (
                                        <p className="py-6 text-center text-sm text-slate-400">
                                            Sin medicamentos registrados.
                                        </p>
                                    ) : (
                                        patient.medications.map((med) => (
                                            <div key={med.id} className="rounded-xl border border-slate-200 bg-white p-4">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold text-slate-900">{med.name}</p>
                                                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                        {med.dose}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    {med.frequency} — Horario: {med.schedule}
                                                </p>
                                                {med.notes && (
                                                    <p className="mt-1 text-xs text-slate-400">{med.notes}</p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </>
                            )}

                            {/* Tab: Cuidados especiales */}
                            {activeTab === "cares" && (
                                <>
                                    {patient.specialCares.length === 0 ? (
                                        <p className="py-6 text-center text-sm text-slate-400">
                                            Sin cuidados especiales registrados.
                                        </p>
                                    ) : (
                                        patient.specialCares.map((care) => (
                                            <div key={care.id} className="rounded-xl border border-slate-200 bg-white p-4">
                                                <p className="font-semibold text-slate-900">{care.type}</p>
                                                <p className="mt-1 text-xs text-slate-500">{care.detail}</p>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}

                            {/* Tab: Paquetes adicionales */}
                            {activeTab === "packages" && (
                                <>
                                    {patient.packages.length === 0 ? (
                                        <p className="py-6 text-center text-sm text-slate-400">
                                            Sin paquetes adicionales asignados.
                                        </p>
                                    ) : (
                                        patient.packages.map((pkg) => (
                                            <div key={pkg.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
                                                <div>
                                                    <p className="font-semibold text-slate-900">{pkg.type}</p>
                                                    <p className="mt-0.5 text-xs text-slate-500">
                                                        Asignado: {pkg.assignedDate}
                                                    </p>
                                                </div>
                                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${pkg.active
                                                        ? "bg-emerald-100 text-emerald-700"
                                                        : "bg-slate-100 text-slate-500"
                                                    }`}>
                                                    {pkg.active ? "Activo" : "Inactivo"}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </>
                            )}
                        </div>

                        {/* Contacto de emergencia */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <p className="text-sm font-semibold text-slate-700">
                                Contacto de Emergencia
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                                {patient.emergencyContact.name} — {patient.emergencyContact.phone}
                            </p>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}