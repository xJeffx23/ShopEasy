"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Save, X, AlertCircle } from "lucide-react";

import FilterCombobox from "@/src/components/ui/filter-combobox";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { getPatientsForSelect } from "@/src/services/patients-select.service";
import { getRoomsForSelect } from "@/src/services/rooms-select.service";
import { getEmployeesForSelect } from "@/src/services/employees-select.service";
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog";
import type { Reservation, ReservationStatus, StaySchedule } from "@/src/types/reservation";

// ─── Opciones ─────────────────────────────────────────────────────────────────

const scheduleOptions = [
    { label: "Seleccione tipo de estancia", value: "all" },
    { label: "Día (8am - 5pm)", value: "1" },
    { label: "Mañana (8am - 2pm)", value: "2" },
    { label: "Tarde (2pm - 6pm)", value: "3" },
    { label: "Full estancia", value: "4" },
];

const statusOptions = [
    { label: "Activa", value: "1" },
    { label: "Pendiente", value: "4" },
    { label: "Finalizada", value: "2" },
    { label: "Cancelada", value: "3" },
];

// ─── Tipos del form ───────────────────────────────────────────────────────────

interface FormValues {
    patientId: string;
    roomId: string;
    startDate: string;
    endDate: string;
    indefinite: boolean;
    schedule: StaySchedule | "all";
    status: ReservationStatus;
    createdBy: string;
    observations: string;
}

interface FormErrors {
    patientId?: string;
    roomId?: string;
    startDate?: string;
    endDate?: string;
    schedule?: string;
    createdBy?: string;
}

interface RoomOption {
    label: string;
    value: string;
    disabled?: boolean;
    disponibilidad?: {
        tipo: string;
        tipoId: number;
        capacidad: number;
        ocupacionActual: number;
        espaciosDisponibles: number;
        disponible: boolean;
        costoPorDia: number;
    };
}

const initial: FormValues = {
    patientId: "",
    roomId: "",
    startDate: "",
    endDate: "",
    indefinite: false,
    schedule: "all",
    status: "activa",
    createdBy: "",
    observations: "",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddReservationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (reservation: any) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AddReservationDialog({
    open, onOpenChange, onSubmit,
}: AddReservationDialogProps) {
    const [form, setForm] = useState<FormValues>(initial);
    const [errors, setErrors] = useState<FormErrors>({});
    const [patients, setPatients] = useState<any[]>([]);
    const [rooms, setRooms] = useState<RoomOption[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);

    useEffect(() => {
        if (!open) {
            setForm(initial);
            setErrors({});
            setSelectedRoom(null);
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            getPatientsForSelect().then(setPatients);
            getRoomsForSelect().then(setRooms);
            getEmployeesForSelect().then(setEmployees);
        }
    }, [open]);

    function set<K extends keyof FormValues>(field: K, value: FormValues[K]) {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: undefined }));
    }

    function handleRoomChange(value: string) {
        set("roomId", value);
        const room = rooms.find(r => r.value === value);
        setSelectedRoom(room || null);
    }

    function validate(): boolean {
        const e: FormErrors = {};
        if (!form.patientId || form.patientId === "all") e.patientId = "Seleccione un paciente.";
        if (!form.roomId || form.roomId === "all") e.roomId = "Seleccione una habitación.";
        if (!form.startDate) e.startDate = "Fecha de inicio requerida.";
        if (!form.indefinite && !form.endDate) e.endDate = "Fecha de fin requerida o marcar indefinida.";
        if (form.schedule === "all") e.schedule = "Seleccione tipo de estancia.";
        if (!form.createdBy || form.createdBy === "all") e.createdBy = "Seleccione quién registra.";

        // Validar fechas
        if (form.startDate && form.endDate && !form.indefinite) {
            if (new Date(form.endDate) < new Date(form.startDate)) {
                e.endDate = "La fecha de fin debe ser posterior a la de inicio.";
            }
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) return;

        const backendData = {
            patientId: form.patientId,
            roomId: form.roomId,
            startDate: form.startDate,
            endDate: form.indefinite ? null : form.endDate,
            indefinite: form.indefinite,
            stayType: form.schedule,
            status: form.status,
            createdBy: form.createdBy,
            observations: form.observations || null
        };

        console.log('Sending reservation data:', backendData);
        onSubmit(backendData);
        onOpenChange(false);
    }

    const inputCls = "h-10 rounded-xl border-slate-200 bg-white text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

    // Filtrar habitaciones disponibles para el combobox
    const roomOptions = [
        { label: "Seleccione una habitación", value: "all" },
        ...rooms.map(r => ({
            label: r.label,
            value: r.value,
            disabled: r.disabled
        }))
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-slate-100 bg-white p-0 shadow-xl sm:max-w-[620px]">
                <DialogHeader className="border-b border-slate-100 px-6 py-4">
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                        Nueva Reservación
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        Registra la estancia de un paciente en el asilo
                    </DialogDescription>
                </DialogHeader>

                <motion.form
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    onSubmit={handleSubmit}
                    className="space-y-3 px-6 py-4"
                >
                    {/* Paciente */}
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-600">
                            Paciente
                        </Label>
                        <FilterCombobox
                            value={form.patientId}
                            onChange={(value) => set("patientId", value)}
                            options={[
                                { label: "Seleccione un paciente", value: "all" },
                                ...patients.map(p => ({ label: p.label, value: p.value }))
                            ]}
                            placeholder="Buscar paciente..."
                            searchPlaceholder="Buscar por nombre o cédula..."
                            emptyMessage="No se encontraron pacientes."
                        />
                        {errors.patientId && <p className="text-[11px] text-red-500">{errors.patientId}</p>}
                    </div>

                    {/* Habitación */}
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-600">
                            Habitación
                        </Label>
                        <FilterCombobox
                            value={form.roomId}
                            onChange={handleRoomChange}
                            options={roomOptions}
                            placeholder="Buscar habitación..."
                            searchPlaceholder="Buscar por número..."
                            emptyMessage="No se encontraron habitaciones."
                        />
                        {errors.roomId && <p className="text-[11px] text-red-500">{errors.roomId}</p>}
                    </div>

                    {/* Info de habitación seleccionada */}
                    {selectedRoom?.disponibilidad && (
                        <div className={`rounded-xl border p-3 ${selectedRoom.disponibilidad.disponible
                                ? 'border-emerald-200 bg-emerald-50'
                                : 'border-amber-200 bg-amber-50'
                            }`}>
                            <div className="flex items-start gap-2">
                                {!selectedRoom.disponibilidad.disponible && (
                                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                )}
                                <div className="text-xs">
                                    <p className="font-medium text-slate-700">
                                        {selectedRoom.disponibilidad.tipo}
                                    </p>
                                    <p className="text-slate-500">
                                        Capacidad: {selectedRoom.disponibilidad.ocupacionActual}/{selectedRoom.disponibilidad.capacidad} ocupado
                                        {selectedRoom.disponibilidad.espaciosDisponibles > 0 && (
                                            <span className="text-emerald-600 ml-1">
                                                ({selectedRoom.disponibilidad.espaciosDisponibles} espacio{selectedRoom.disponibilidad.espaciosDisponibles > 1 ? 's' : ''} disponible{selectedRoom.disponibilidad.espaciosDisponibles > 1 ? 's' : ''})
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-slate-500">
                                        Costo: ₡{selectedRoom.disponibilidad.costoPorDia?.toLocaleString('es-CR')}/día
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tipo de estancia */}
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-600">
                            Tipo de Estancia
                        </Label>
                        <FilterCombobox
                            value={form.schedule}
                            onChange={(v) => set("schedule", v as StaySchedule | "all")}
                            options={scheduleOptions}
                            placeholder="Seleccione tipo de estancia"
                            searchPlaceholder="Buscar..."
                            emptyMessage="No encontrado."
                        />
                        {errors.schedule && <p className="text-[11px] text-red-500">{errors.schedule}</p>}
                    </div>

                    {/* Fechas */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                        <p className="text-xs font-medium text-slate-600">
                            Tiempo de estancia
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label className="text-[11px] text-slate-400">Fecha de inicio</Label>
                                <Input
                                    type="date"
                                    value={form.startDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => set("startDate", e.target.value)}
                                    className={inputCls}
                                />
                                {errors.startDate && <p className="text-[11px] text-red-500">{errors.startDate}</p>}
                            </div>

                            <div className="space-y-1">
                                <Label className="text-[11px] text-slate-400">Fecha de fin</Label>
                                <Input
                                    type="date"
                                    value={form.endDate}
                                    disabled={form.indefinite}
                                    min={form.startDate || new Date().toISOString().split('T')[0]}
                                    onChange={(e) => set("endDate", e.target.value)}
                                    className={`${inputCls} disabled:bg-slate-100 disabled:text-slate-400`}
                                />
                                {errors.endDate && <p className="text-[11px] text-red-500">{errors.endDate}</p>}
                            </div>
                        </div>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                checked={form.indefinite}
                                onChange={(e) => {
                                    set("indefinite", e.target.checked);
                                    if (e.target.checked) set("endDate", "");
                                }}
                                className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                            />
                            <span className="text-xs text-slate-600">
                                Estancia indefinida
                            </span>
                        </label>
                    </div>

                    {/* Estado + Registrado por */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Estado</Label>
                            <FilterCombobox
                                value={form.status}
                                onChange={(v) => set("status", v as ReservationStatus)}
                                options={statusOptions}
                                placeholder="Estado"
                                searchPlaceholder="Buscar..."
                                emptyMessage="No encontrado."
                            />
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">
                                Registrado por
                            </Label>
                            <FilterCombobox
                                value={form.createdBy}
                                onChange={(value) => set("createdBy", value)}
                                options={[
                                    { label: "Seleccione un empleado", value: "all" },
                                    ...employees.map(e => ({ label: e.label, value: e.value }))
                                ]}
                                placeholder="Buscar empleado..."
                                searchPlaceholder="Buscar por nombre..."
                                emptyMessage="No se encontraron empleados."
                            />
                            {errors.createdBy && <p className="text-[11px] text-red-500">{errors.createdBy}</p>}
                        </div>
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-600">
                            Observaciones <span className="text-slate-400">(opcional)</span>
                        </Label>
                        <textarea
                            value={form.observations}
                            onChange={(e) => set("observations", e.target.value)}
                            placeholder="Notas adicionales sobre la reservación..."
                            rows={2}
                            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-10 rounded-xl border-slate-200 px-4 text-sm"
                        >
                            <X className="mr-1.5 h-3.5 w-3.5" />
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={selectedRoom?.disabled}
                            className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                        >
                            <Save className="mr-1.5 h-3.5 w-3.5" />
                            Confirmar Reservación
                        </Button>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
}