"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Save, X } from "lucide-react";

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
import type {
    Reservation, ReservationRoomType,
    ReservationStatus, StaySchedule,
} from "@/src/types/reservation";

// ─── Opciones ─────────────────────────────────────────────────────────────────

/** Enunciado b: Estancia en las instalaciones - Mapeo a IDs del backend */
const scheduleOptions = [
    { label: "Seleccione tipo de estancia", value: "all" },
    { label: "Día (8am - 5pm)", value: "1" },
    { label: "Mañana (8am - 2pm)", value: "2" },
    { label: "Tarde (2pm - 6pm)", value: "3" },
    { label: "Full estancia", value: "4" },
];

/** Enunciado b.v: Tipo de habitación - Para referencia visual */
const roomTypeOptions = [
    { label: "Seleccione tipo de habitación", value: "all" },
    { label: "Compartida", value: "1" },
    { label: "Individual", value: "2" },
    { label: "Individual cama matrimonial", value: "3" },
    { label: "Cuidados especiales", value: "4" },
];

const statusOptions = [
    { label: "Activa", value: "1" },
    { label: "Pendiente", value: "4" },
    { label: "Finalizada", value: "2" },
    { label: "Cancelada", value: "3" },
];

// ─── Tipos del form ───────────────────────────────────────────────────────────

interface FormValues {
    patientName: string;
    patientId: string;
    roomNumber: string;
    roomId: string;
    roomType: ReservationRoomType | "all";
    startDate: string;   // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    indefinite: boolean;
    schedule: StaySchedule | "all";
    status: ReservationStatus;
    createdBy: string;
    observations: string;
}

interface FormErrors {
    patientName?: string;
    roomNumber?: string;
    roomType?: string;
    startDate?: string;
    endDate?: string;
    schedule?: string;
    createdBy?: string;
}

const initial: FormValues = {
    patientName: "",
    patientId: "",
    roomNumber: "",
    roomId: "",
    roomType: "all",
    startDate: "",
    endDate: "",
    indefinite: false,
    schedule: "all",
    status: "activa",
    createdBy: "",
    observations: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateFromInput(value: string) {
    if (!value) return "";
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddReservationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (reservation: Reservation) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AddReservationDialog({
    open, onOpenChange, onSubmit,
}: AddReservationDialogProps) {
    const [form, setForm] = useState<FormValues>(initial);
    const [errors, setErrors] = useState<FormErrors>({});
    const [patients, setPatients] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);

    useEffect(() => {
        if (!open) { setForm(initial); setErrors({}); }
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

    function validate(): boolean {
        const e: FormErrors = {};
        if (!form.patientId || form.patientId === "all") e.patientName = "Requerido.";
        if (!form.roomId || form.roomId === "all") e.roomNumber = "Requerido.";
        if (form.roomType === "all") e.roomType = "Requerido.";
        if (!form.startDate) e.startDate = "Requerido.";
        if (!form.indefinite && !form.endDate) e.endDate = "Requerido o marcar indefinida.";
        if (form.schedule === "all") e.schedule = "Requerido.";
        if (!form.createdBy || form.createdBy === "all") e.createdBy = "Requerido.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) return;

        // Convertir datos del formulario al formato que espera el backend
        const backendData = {
            patientId: form.patientId,      // ✅ ID real del paciente seleccionado
            roomId: form.roomId,           // ✅ ID real de la habitación seleccionada
            startDate: form.startDate,       // Formato YYYY-MM-DD
            endDate: form.indefinite ? "" : form.endDate,
            stayType: form.schedule,        // ID numérico como string
            status: form.status,            // ID numérico como string
        };

        console.log('Sending reservation data:', backendData);
        onSubmit(backendData);
        onOpenChange(false);
    }

    const inputCls = "h-10 rounded-xl border-slate-200 bg-white text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

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
                    {/* Paciente + Habitación */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">
                                Nombre del Paciente
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
                            {errors.patientName && <p className="text-[11px] text-red-500">{errors.patientName}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">
                                Número de Habitación
                            </Label>
                            <FilterCombobox
                                value={form.roomId}
                                onChange={(value) => set("roomId", value)}
                                options={[
                                    { label: "Seleccione una habitación", value: "all" },
                                    ...rooms.map(r => ({ label: r.label, value: r.value }))
                                ]}
                                placeholder="Buscar habitación..."
                                searchPlaceholder="Buscar por número o tipo..."
                                emptyMessage="No se encontraron habitaciones."
                            />
                            {errors.roomNumber && <p className="text-[11px] text-red-500">{errors.roomNumber}</p>}
                        </div>
                    </div>

                    {/* Tipo de habitación + Tipo de estancia */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            {/* Enunciado b.v */}
                            <Label className="text-xs font-medium text-slate-600">
                                Tipo de Habitación
                            </Label>
                            <FilterCombobox
                                value={form.roomType}
                                onChange={(v) => set("roomType", v as ReservationRoomType | "all")}
                                options={roomTypeOptions}
                                placeholder="Seleccione tipo"
                                searchPlaceholder="Buscar..."
                                emptyMessage="No encontrado."
                            />
                            {errors.roomType && <p className="text-[11px] text-red-500">{errors.roomType}</p>}
                        </div>

                        <div className="space-y-1">
                            {/* Enunciado b */}
                            <Label className="text-xs font-medium text-slate-600">
                                Tipo de Estancia
                            </Label>
                            <FilterCombobox
                                value={form.schedule}
                                onChange={(v) => set("schedule", v as StaySchedule | "all")}
                                options={scheduleOptions}
                                placeholder="Seleccione estancia"
                                searchPlaceholder="Buscar..."
                                emptyMessage="No encontrado."
                            />
                            {errors.schedule && <p className="text-[11px] text-red-500">{errors.schedule}</p>}
                        </div>
                    </div>

                    {/* Fechas — Enunciado a.i */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                        <p className="text-xs font-medium text-slate-600">
                            Tiempo de estancia
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                {/* a.1 Fecha de inicio */}
                                <Label className="text-[11px] text-slate-400">Fecha de inicio</Label>
                                <Input
                                    type="date"
                                    value={form.startDate}
                                    onChange={(e) => set("startDate", e.target.value)}
                                    className={inputCls}
                                />
                                {errors.startDate && <p className="text-[11px] text-red-500">{errors.startDate}</p>}
                            </div>

                            <div className="space-y-1">
                                {/* a.2 Fecha de fin */}
                                <Label className="text-[11px] text-slate-400">Fecha de fin</Label>
                                <Input
                                    type="date"
                                    value={form.endDate}
                                    disabled={form.indefinite}
                                    min={form.startDate}
                                    onChange={(e) => set("endDate", e.target.value)}
                                    className={`${inputCls} disabled:bg-slate-100 disabled:text-slate-400`}
                                />
                                {errors.endDate && <p className="text-[11px] text-red-500">{errors.endDate}</p>}
                            </div>
                        </div>

                        {/* a.3 Indefinido */}
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
                                searchPlaceholder="Buscar por nombre o email..."
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
                            className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 active:scale-[0.98]"
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