"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BedDouble, Save, Settings2, X } from "lucide-react";

import FilterCombobox from "@/components/ui/filter-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { Room, RoomType, RoomStatus } from "@/types/room";

const typeOptions = [
    { label: "Seleccione un tipo", value: "all" },
    { label: "Individual", value: "Individual" },
    { label: "Compartida", value: "Compartida" },
    { label: "Individual cama matrimonial", value: "Individual cama matrimonial" },
    { label: "Cuidados especiales", value: "Cuidados especiales" },
];

const statusOptions = [
    { label: "Disponible", value: "disponible" },
    { label: "Mantenimiento", value: "mantenimiento" },
    { label: "Cerrada", value: "cerrada" },
];

interface FormValues {
    roomNumber: string;
    floor: string;
    type: RoomType | "all";
    capacity: string;
    status: RoomStatus;
    observations: string;
}

interface FormErrors {
    roomNumber?: string;
    floor?: string;
    type?: string;
    capacity?: string;
}

const initial: FormValues = {
    roomNumber: "",
    floor: "",
    type: "all",
    capacity: "1",
    status: "disponible",
    observations: "",
};

interface AddRoomDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (room: Room) => void;
}

export default function AddRoomDialog({ open, onOpenChange, onSubmit }: AddRoomDialogProps) {
    const [form, setForm] = useState<FormValues>(initial);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (!open) { setForm(initial); setErrors({}); }
    }, [open]);

    function set<K extends keyof FormValues>(field: K, value: FormValues[K]) {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: undefined }));
    }

    function validate(): boolean {
        const e: FormErrors = {};
        if (!form.roomNumber.trim()) e.roomNumber = "Requerido.";
        if (!form.floor.trim() || isNaN(Number(form.floor))) e.floor = "Ingresa un piso válido.";
        if (form.type === "all") e.type = "Requerido.";
        if (!form.capacity.trim() || isNaN(Number(form.capacity))) e.capacity = "Capacidad inválida.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) return;

        const newRoom: Room = {
            id: crypto.randomUUID(),
            roomNumber: form.roomNumber.trim(),
            floor: Number(form.floor),
            type: form.type as RoomType,
            capacity: Number(form.capacity),
            status: form.status,
            observations: form.observations.trim() || undefined,
            cleanings: [],
            maintenances: [],
        };

        onSubmit(newRoom);
        onOpenChange(false);
    }

    const inputCls = "h-10 rounded-xl border-slate-200 bg-white text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-slate-100 bg-white p-0 shadow-xl sm:max-w-[520px]">
                <DialogHeader className="border-b border-slate-100 px-6 py-4">
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <BedDouble className="h-5 w-5 text-blue-600" />
                        Agregar Habitación
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        Registra una nueva habitación en el sistema
                    </DialogDescription>
                </DialogHeader>

                <motion.form
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    onSubmit={handleSubmit}
                    className="space-y-3 px-6 py-4"
                >
                    {/* Número + Piso */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Número de habitación</Label>
                            <Input
                                value={form.roomNumber}
                                onChange={(e) => set("roomNumber", e.target.value)}
                                placeholder="Ej. 101, 202..."
                                className={inputCls}
                            />
                            {errors.roomNumber && <p className="text-[11px] text-red-500">{errors.roomNumber}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Piso</Label>
                            <Input
                                type="number"
                                min="1"
                                value={form.floor}
                                onChange={(e) => set("floor", e.target.value)}
                                placeholder="Ej. 1, 2, 3..."
                                className={inputCls}
                            />
                            {errors.floor && <p className="text-[11px] text-red-500">{errors.floor}</p>}
                        </div>
                    </div>

                    {/* Tipo + Capacidad */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Tipo de habitación</Label>
                            <FilterCombobox
                                value={form.type}
                                onChange={(v) => set("type", v as RoomType | "all")}
                                options={typeOptions}
                                placeholder="Seleccione un tipo"
                                searchPlaceholder="Buscar..."
                                emptyMessage="No encontrado."
                            />
                            {errors.type && <p className="text-[11px] text-red-500">{errors.type}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Capacidad</Label>
                            <Input
                                type="number"
                                min="1"
                                max="4"
                                value={form.capacity}
                                onChange={(e) => set("capacity", e.target.value)}
                                placeholder="Ej. 1, 2..."
                                className={inputCls}
                            />
                            {errors.capacity && <p className="text-[11px] text-red-500">{errors.capacity}</p>}
                        </div>
                    </div>

                    {/* Estado inicial */}
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-600">Estado inicial</Label>
                        <FilterCombobox
                            value={form.status}
                            onChange={(v) => set("status", v as RoomStatus)}
                            options={statusOptions}
                            placeholder="Estado"
                            searchPlaceholder="Buscar..."
                            emptyMessage="No encontrado."
                        />
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-slate-600">
                            Observaciones <span className="text-slate-400">(opcional)</span>
                        </Label>
                        <textarea
                            value={form.observations}
                            onChange={(e) => set("observations", e.target.value)}
                            placeholder="Notas adicionales sobre la habitación..."
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
                            Guardar Habitación
                        </Button>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
}