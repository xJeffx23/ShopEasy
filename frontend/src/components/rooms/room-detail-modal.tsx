"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BedDouble, Brush, Plus, Save, Wrench, X } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Room, RoomCleaning, RoomMaintenance } from "@/src/types/room";

interface RoomDetailModalProps {
    room: Room | null;
    open: boolean;
    onClose: () => void;
    onAddCleaning?: (roomId: string, cleaning: RoomCleaning) => void;
    onAddMaintenance?: (roomId: string, maintenance: RoomMaintenance) => void;
}

type Tab = "info" | "cleanings" | "maintenances";

function getStatusLabel(status: Room["status"]) {
    switch (status) {
        case "disponible": return "Disponible";
        case "reservada": return "Reservada";
        case "mantenimiento": return "Mantenimiento";
        case "cerrada": return "Cerrada";
    }
}

function getStatusBadge(status: Room["status"]) {
    switch (status) {
        case "disponible": return "bg-emerald-100 text-emerald-700";
        case "reservada": return "bg-blue-100 text-blue-700";
        case "mantenimiento": return "bg-amber-100 text-amber-700";
        case "cerrada": return "bg-red-100 text-red-700";
    }
}

function formatToday() {
    return new Intl.DateTimeFormat("es-CR", {
        day: "2-digit", month: "2-digit", year: "numeric",
    }).format(new Date());
}

function todayForInput() {
    return new Date().toISOString().split("T")[0];
}

function formatDateFromInput(value: string) {
    if (!value) return "";
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
}

// ── Formularios de limpieza y mantenimiento ───────────────────────────────────

interface CleaningFormValues {
    date: string;
    employeeName: string;
    notes: string;
}

interface MaintenanceFormValues {
    date: string;
    repairDescription: string;
    furnitureUpdate: boolean;
    furnitureDetail: string;
    recommendedRepairs: string;
    employeeName: string;
}

const initCleaning: CleaningFormValues = {
    date: "", employeeName: "", notes: "",
};

const initMaintenance: MaintenanceFormValues = {
    date: "", repairDescription: "", furnitureUpdate: false,
    furnitureDetail: "", recommendedRepairs: "", employeeName: "",
};

// ─── Componente principal ─────────────────────────────────────────────────────

export function RoomDetailModal({
    room, open, onClose, onAddCleaning, onAddMaintenance,
}: RoomDetailModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>("info");
    const [showCleaningForm, setShowCleaningForm] = useState(false);
    const [showMaintenanceForm, setShowMaintenanceForm] = useState(false);
    const [cleaningForm, setCleaningForm] = useState<CleaningFormValues>(initCleaning);
    const [maintenanceForm, setMaintenanceForm] = useState<MaintenanceFormValues>(initMaintenance);

    if (!room) return null;

    const inputCls = "h-9 rounded-xl border-slate-200 bg-white text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

    function handleAddCleaning() {
        if (!room || !cleaningForm.date || !cleaningForm.employeeName.trim()) return;
        const cleaning: RoomCleaning = {
            id: crypto.randomUUID(),
            date: formatDateFromInput(cleaningForm.date),
            employeeName: cleaningForm.employeeName.trim(),
            notes: cleaningForm.notes.trim() || undefined,
        };
        onAddCleaning?.(room.id, cleaning);
        setCleaningForm(initCleaning);
        setShowCleaningForm(false);
    }

    function handleAddMaintenance() {
        if (!room || !maintenanceForm.date || !maintenanceForm.repairDescription.trim() || !maintenanceForm.employeeName.trim()) return;
        const maintenance: RoomMaintenance = {
            id: crypto.randomUUID(),
            date: formatDateFromInput(maintenanceForm.date),
            repairDescription: maintenanceForm.repairDescription.trim(),
            furnitureUpdate: maintenanceForm.furnitureUpdate,
            furnitureDetail: maintenanceForm.furnitureDetail.trim() || undefined,
            recommendedRepairs: maintenanceForm.recommendedRepairs.trim() || undefined,
            completed: false,
            employeeName: maintenanceForm.employeeName.trim(),
        };
        onAddMaintenance?.(room.id, maintenance);
        setMaintenanceForm(initMaintenance);
        setShowMaintenanceForm(false);
    }

    const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
        { id: "info", label: "Información", icon: <BedDouble className="h-3.5 w-3.5" />, count: 0 },
        { id: "cleanings", label: "Limpiezas", icon: <Brush className="h-3.5 w-3.5" />, count: room.cleanings.length },
        { id: "maintenances", label: "Mantenimientos", icon: <Wrench className="h-3.5 w-3.5" />, count: room.maintenances.length },
    ];

    return (
        <Dialog.Root open={open} onOpenChange={(v) => { if (!v) { onClose(); setShowCleaningForm(false); setShowMaintenanceForm(false); } }}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/40 animate-in fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white shadow-xl animate-in fade-in-0 zoom-in-95 focus:outline-none">

                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
                        <div>
                            <Dialog.Title className="text-base font-semibold text-slate-900">
                                Habitación {room.roomNumber}
                            </Dialog.Title>
                            <p className="text-xs text-slate-500">
                                {room.type} · Piso {room.floor} · Capacidad: {room.capacity}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(room.status)}`}>
                                {getStatusLabel(room.status)}
                            </span>
                            <button
                                onClick={onClose}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    <div className="p-5 space-y-4">
                        {/* Tabs */}
                        <div className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setShowCleaningForm(false); setShowMaintenanceForm(false); }}
                                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-medium transition-colors ${activeTab === tab.id
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-100 px-1 text-[10px] font-semibold text-blue-700">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="max-h-[340px] overflow-y-auto space-y-3 pr-1">

                            {/* ── Tab: Información ── */}
                            {activeTab === "info" && (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: "Número", value: room.roomNumber },
                                            { label: "Piso", value: `Piso ${room.floor}` },
                                            { label: "Tipo", value: room.type },
                                            { label: "Capacidad", value: `${room.capacity} persona(s)` },
                                        ].map((item) => (
                                            <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                                <p className="text-[11px] text-slate-400">{item.label}</p>
                                                <p className="mt-0.5 text-sm font-semibold text-slate-800">{item.value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {room.status === "reservada" && room.patientName && (
                                        <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                                            <p className="text-[11px] text-blue-500">Paciente asignado</p>
                                            <p className="mt-0.5 text-sm font-semibold text-blue-900">{room.patientName}</p>
                                        </div>
                                    )}

                                    {room.observations && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                            <p className="text-[11px] text-slate-400">Observaciones</p>
                                            <p className="mt-0.5 text-sm text-slate-700">{room.observations}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── Tab: Limpiezas ── */}
                            {activeTab === "cleanings" && (
                                <div className="space-y-2">
                                    {/* Botón para abrir formulario */}
                                    {!showCleaningForm && (
                                        <button
                                            onClick={() => setShowCleaningForm(true)}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 bg-blue-50 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-100"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Registrar nueva limpieza
                                        </button>
                                    )}

                                    {/* Formulario de limpieza */}
                                    {showCleaningForm && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                                            <p className="text-xs font-medium text-slate-600">Nueva limpieza</p>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    {/* b.i Fecha de limpieza */}
                                                    <Label className="text-[11px] text-slate-400">Fecha (DD/MM/AAAA)</Label>
                                                    <Input
                                                        type="date"
                                                        max={todayForInput()}
                                                        value={cleaningForm.date}
                                                        onChange={(e) => setCleaningForm((p) => ({ ...p, date: e.target.value }))}
                                                        className={inputCls}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    {/* b.ii Personal */}
                                                    <Label className="text-[11px] text-slate-400">Personal que efectuó la limpieza</Label>
                                                    <Input
                                                        value={cleaningForm.employeeName}
                                                        onChange={(e) => setCleaningForm((p) => ({ ...p, employeeName: e.target.value }))}
                                                        placeholder="Nombre del empleado"
                                                        className={inputCls}
                                                    />
                                                </div>
                                            </div>

                                            <Input
                                                value={cleaningForm.notes}
                                                onChange={(e) => setCleaningForm((p) => ({ ...p, notes: e.target.value }))}
                                                placeholder="Observaciones (opcional)"
                                                className={inputCls}
                                            />

                                            <div className="flex gap-2 pt-1">
                                                <Button
                                                    type="button"
                                                    onClick={() => setShowCleaningForm(false)}
                                                    variant="outline"
                                                    className="h-8 flex-1 rounded-xl border-slate-200 text-xs"
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleAddCleaning}
                                                    disabled={!cleaningForm.date || !cleaningForm.employeeName.trim()}
                                                    className="h-8 flex-1 rounded-xl bg-blue-600 text-xs hover:bg-blue-700 disabled:opacity-40"
                                                >
                                                    <Save className="mr-1 h-3 w-3" />
                                                    Guardar
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Lista de limpiezas */}
                                    {room.cleanings.length === 0 ? (
                                        <p className="py-4 text-center text-sm text-slate-400">Sin registros de limpieza.</p>
                                    ) : (
                                        [...room.cleanings].reverse().map((c) => (
                                            <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-slate-900">{c.date}</p>
                                                </div>
                                                <p className="text-xs text-slate-500">Personal: {c.employeeName}</p>
                                                {c.notes && <p className="mt-0.5 text-xs text-slate-400">{c.notes}</p>}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* ── Tab: Mantenimientos ── */}
                            {activeTab === "maintenances" && (
                                <div className="space-y-2">
                                    {/* Botón para abrir formulario */}
                                    {!showMaintenanceForm && (
                                        <button
                                            onClick={() => setShowMaintenanceForm(true)}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-amber-300 bg-amber-50 py-2.5 text-sm font-medium text-amber-600 transition hover:bg-amber-100"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Registrar mantenimiento
                                        </button>
                                    )}

                                    {/* Formulario de mantenimiento */}
                                    {showMaintenanceForm && (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                                            <p className="text-xs font-medium text-slate-600">Nuevo mantenimiento</p>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-slate-400">Fecha</Label>
                                                    <Input
                                                        type="date"
                                                        max={todayForInput()}
                                                        value={maintenanceForm.date}
                                                        onChange={(e) => setMaintenanceForm((p) => ({ ...p, date: e.target.value }))}
                                                        className={inputCls}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-slate-400">Personal responsable</Label>
                                                    <Input
                                                        value={maintenanceForm.employeeName}
                                                        onChange={(e) => setMaintenanceForm((p) => ({ ...p, employeeName: e.target.value }))}
                                                        placeholder="Nombre del empleado"
                                                        className={inputCls}
                                                    />
                                                </div>
                                            </div>

                                            {/* c.i Descripción de reparaciones */}
                                            <div className="space-y-1">
                                                <Label className="text-[11px] text-slate-400">
                                                    Descripción de reparaciones <span className="text-red-400">*</span>
                                                </Label>
                                                <textarea
                                                    value={maintenanceForm.repairDescription}
                                                    onChange={(e) => setMaintenanceForm((p) => ({ ...p, repairDescription: e.target.value }))}
                                                    placeholder="Describe las reparaciones realizadas..."
                                                    rows={2}
                                                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                                />
                                            </div>

                                            {/* c.ii Actualización de mobiliario */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    id="furniture"
                                                    checked={maintenanceForm.furnitureUpdate}
                                                    onChange={(e) => setMaintenanceForm((p) => ({ ...p, furnitureUpdate: e.target.checked }))}
                                                    className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                                                />
                                                <Label htmlFor="furniture" className="text-xs text-slate-600 cursor-pointer">
                                                    Actualización de mobiliario
                                                </Label>
                                            </div>

                                            {maintenanceForm.furnitureUpdate && (
                                                <Input
                                                    value={maintenanceForm.furnitureDetail}
                                                    onChange={(e) => setMaintenanceForm((p) => ({ ...p, furnitureDetail: e.target.value }))}
                                                    placeholder="Detalle qué mobiliario se actualizó..."
                                                    className={inputCls}
                                                />
                                            )}

                                            {/* c.iii Reparaciones recomendadas */}
                                            <div className="space-y-1">
                                                <Label className="text-[11px] text-slate-400">
                                                    Reparaciones recomendadas por hacer (opcional)
                                                </Label>
                                                <Input
                                                    value={maintenanceForm.recommendedRepairs}
                                                    onChange={(e) => setMaintenanceForm((p) => ({ ...p, recommendedRepairs: e.target.value }))}
                                                    placeholder="Ej. Cambio de tuberías, pintura..."
                                                    className={inputCls}
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-1">
                                                <Button
                                                    type="button"
                                                    onClick={() => setShowMaintenanceForm(false)}
                                                    variant="outline"
                                                    className="h-8 flex-1 rounded-xl border-slate-200 text-xs"
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleAddMaintenance}
                                                    disabled={!maintenanceForm.date || !maintenanceForm.repairDescription.trim() || !maintenanceForm.employeeName.trim()}
                                                    className="h-8 flex-1 rounded-xl bg-blue-600 text-xs hover:bg-blue-700 disabled:opacity-40"
                                                >
                                                    <Save className="mr-1 h-3 w-3" />
                                                    Guardar
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Lista de mantenimientos */}
                                    {room.maintenances.length === 0 ? (
                                        <p className="py-4 text-center text-sm text-slate-400">Sin registros de mantenimiento.</p>
                                    ) : (
                                        [...room.maintenances].reverse().map((m) => (
                                            <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-3 space-y-1.5">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-semibold text-slate-900">{m.repairDescription}</p>
                                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${m.completed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                                        }`}>
                                                        {m.completed ? "Completado" : "Pendiente"}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500">{m.date} · {m.employeeName}</p>
                                                {m.furnitureUpdate && (
                                                    <p className="text-xs text-slate-600">
                                                        <span className="font-medium">Mobiliario actualizado:</span>{" "}
                                                        {m.furnitureDetail ?? "Sí"}
                                                    </p>
                                                )}
                                                {m.recommendedRepairs && (
                                                    <p className="text-xs text-amber-600">
                                                        <span className="font-medium">Recomendado:</span>{" "}
                                                        {m.recommendedRepairs}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}