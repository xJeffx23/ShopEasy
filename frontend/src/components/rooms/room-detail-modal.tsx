"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { BedDouble, Brush, Plus, Save, Wrench, X } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { Room, RoomCleaning, RoomMaintenance } from "@/src/types/room";
import { roomCleaningService, roomMaintenanceService } from "@/src/services/room-operations.service";
import FilterCombobox from "@/src/components/ui/filter-combobox";
import { getEmployeesForSelect, EmployeeOption } from "@/src/services/employees-select.service";

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
    employeeId: number | null;
    notes: string;
}

interface MaintenanceFormValues {
    date: string;
    repairDescription: string;
    furnitureUpdate: boolean;
    furnitureDetail: string;
    recommendedRepairs: string;
    employeeName: string;
    employeeId: number | null;
}

const initCleaning: CleaningFormValues = {
    date: "", employeeName: "", employeeId: null, notes: "",
};

const initMaintenance: MaintenanceFormValues = {
    date: "", repairDescription: "", furnitureUpdate: false,
    furnitureDetail: "", recommendedRepairs: "", employeeName: "", employeeId: null,
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
    const [employees, setEmployees] = useState<EmployeeOption[]>([]);
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    useEffect(() => {
        async function loadEmployees() {
            setLoadingEmployees(true);
            try {
                const employeesData = await getEmployeesForSelect();
                setEmployees(employeesData);
            } catch (error) {
                console.error('Error loading employees:', error);
            } finally {
                setLoadingEmployees(false);
            }
        }

        if (open) {
            loadEmployees();
        }
    }, [open]);

    if (!room) return null;

    const inputCls = "h-9 rounded-xl border-slate-200 bg-white text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

    async function handleAddCleaning() {
        if (!room || !cleaningForm.date || !cleaningForm.employeeId) return;
        try {
            const cleaning: Omit<RoomCleaning, 'id'> & { employeeId: number | null } = {
                date: formatDateFromInput(cleaningForm.date),
                employeeName: cleaningForm.employeeName.trim(),
                employeeId: cleaningForm.employeeId,
                notes: cleaningForm.notes.trim() || undefined,
            };
            const newCleaning = await roomCleaningService.addRoomCleaning(room.id, cleaning);
            onAddCleaning?.(room.id, newCleaning);
            setCleaningForm(initCleaning);
            setShowCleaningForm(false);
        } catch (error) {
            console.error('Error al agregar limpieza:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
    }

    async function handleAddMaintenance() {
        if (!room || !maintenanceForm.date || !maintenanceForm.repairDescription.trim() || !maintenanceForm.employeeId) return;
        try {
            const maintenance: Omit<RoomMaintenance, 'id'> & { employeeId: number | null } = {
                date: formatDateFromInput(maintenanceForm.date),
                repairDescription: maintenanceForm.repairDescription.trim(),
                furnitureUpdate: maintenanceForm.furnitureUpdate,
                furnitureDetail: maintenanceForm.furnitureDetail.trim() || undefined,
                recommendedRepairs: maintenanceForm.recommendedRepairs.trim() || undefined,
                completed: false,
                employeeName: maintenanceForm.employeeName.trim(),
                employeeId: maintenanceForm.employeeId,
            };
            const newMaintenance = await roomMaintenanceService.addRoomMaintenance(room.id, maintenance);
            onAddMaintenance?.(room.id, newMaintenance);
            setMaintenanceForm(initMaintenance);
            setShowMaintenanceForm(false);
        } catch (error) {
            console.error('Error al agregar mantenimiento:', error);
            // Aquí podrías mostrar un mensaje de error al usuario
        }
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
                                                    <FilterCombobox
                                                        value={cleaningForm.employeeName}
                                                        onChange={(value) => {
                                                            const selectedEmployee = employees.find(emp => emp.value === value);
                                                            setCleaningForm((p) => ({ 
                                                                ...p, 
                                                                employeeName: selectedEmployee?.nombre || value,
                                                                employeeId: selectedEmployee?.id || null
                                                            }));
                                                        }}
                                                        options={employees}
                                                        placeholder={loadingEmployees ? "Cargando empleados..." : "Seleccionar empleado"}
                                                        emptyMessage="No se encontraron empleados"
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
                                        <div className="py-8 text-center">
                                            <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                                                <Brush className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <p className="text-sm text-slate-400">Sin registros de limpieza</p>
                                            <p className="text-xs text-slate-300 mt-1">Los registros aparecerán aquí cuando se registren limpiezas</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between px-1">
                                                <h4 className="text-xs font-medium text-slate-600">Historial de limpiezas</h4>
                                                <span className="text-xs text-slate-400">{room.cleanings.length} registros</span>
                                            </div>
                                            {[...room.cleanings].reverse().map((c, index) => (
                                                <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <Brush className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-900">{c.date}</p>
                                                                <p className="text-xs text-slate-500">Registro #{room.cleanings.length - index}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                                            <span className="text-xs text-green-600 font-medium">Completado</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                                <span className="text-xs text-slate-600 font-medium">P</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-slate-700">Personal asignado</p>
                                                                <p className="text-sm text-slate-900">{c.employeeName}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        {c.notes && (
                                                            <div className="flex items-start gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center mt-0.5">
                                                                    <span className="text-xs text-amber-600 font-medium">N</span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-medium text-slate-700">Observaciones</p>
                                                                    <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-2 mt-1">{c.notes}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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
                                                    <FilterCombobox
                                                        value={maintenanceForm.employeeName}
                                                        onChange={(value) => {
                                                            const selectedEmployee = employees.find(emp => emp.value === value);
                                                            setMaintenanceForm((p) => ({ 
                                                                ...p, 
                                                                employeeName: selectedEmployee?.nombre || value,
                                                                employeeId: selectedEmployee?.id || null
                                                            }));
                                                        }}
                                                        options={employees}
                                                        placeholder={loadingEmployees ? "Cargando empleados..." : "Seleccionar empleado"}
                                                        emptyMessage="No se encontraron empleados"
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
                                        <div className="py-8 text-center">
                                            <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-3">
                                                <Wrench className="w-6 h-6 text-amber-400" />
                                            </div>
                                            <p className="text-sm text-slate-400">Sin registros de mantenimiento</p>
                                            <p className="text-xs text-slate-300 mt-1">Los registros aparecerán aquí cuando se registren mantenimientos</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between px-1">
                                                <h4 className="text-xs font-medium text-slate-600">Historial de mantenimientos</h4>
                                                <span className="text-xs text-slate-400">{room.maintenances.length} registros</span>
                                            </div>
                                            {[...room.maintenances].reverse().map((m, index) => (
                                                <div key={m.id} className="rounded-xl border border-slate-200 bg-white p-4 hover:shadow-sm transition-shadow">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                                                <Wrench className="w-4 h-4 text-amber-600" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-900 line-clamp-2">{m.repairDescription}</p>
                                                                <p className="text-xs text-slate-500">Registro #{room.maintenances.length - index}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className={`w-2 h-2 rounded-full ${m.completed ? "bg-green-400" : "bg-amber-400"}`}></div>
                                                            <span className={`text-xs font-medium ${m.completed ? "text-green-600" : "text-amber-600"}`}>
                                                                {m.completed ? "Completado" : "Pendiente"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                                                                <span className="text-xs text-slate-600 font-medium">P</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-slate-700">Personal responsable</p>
                                                                <p className="text-sm text-slate-900">{m.employeeName}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                                                                <span className="text-xs text-blue-600 font-medium">F</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-medium text-slate-700">Fecha de registro</p>
                                                                <p className="text-sm text-slate-900">{m.date}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        {m.furnitureUpdate && (
                                                            <div className="flex items-start gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center mt-0.5">
                                                                    <span className="text-xs text-purple-600 font-medium">M</span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-medium text-slate-700">Actualización de mobiliario</p>
                                                                    <p className="text-sm text-slate-600 bg-purple-50 rounded-lg p-2 mt-1">
                                                                        {m.furnitureDetail || "Sí, se actualizó mobiliario"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {m.recommendedRepairs && (
                                                            <div className="flex items-start gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-orange-50 flex items-center justify-center mt-0.5">
                                                                    <span className="text-xs text-orange-600 font-medium">R</span>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <p className="text-xs font-medium text-slate-700">Reparaciones recomendadas</p>
                                                                    <p className="text-sm text-slate-600 bg-orange-50 rounded-lg p-2 mt-1">{m.recommendedRepairs}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
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