"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Mail, Phone, Save, Settings2, UserPlus, X } from "lucide-react";

import FilterCombobox from "@/components/ui/filter-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type {
    EmployeeItem,
    EmployeeDepartment,
    EmployeeProfile,
    EmployeeStatus,
} from "@/types/employee";

// ─── Opciones ─────────────────────────────────────────────────────────────────

const departmentOptions = [
    { label: "Seleccione un departamento", value: "all" },
    { label: "Administrativo", value: "Administrativo" },
    { label: "Gerencia", value: "Gerencia" },
    { label: "DTI", value: "DTI" },
    { label: "Financiero", value: "Financiero" },
];

const profileOptions = [
    { label: "Seleccione un rol", value: "all" },
    { label: "Gerencia", value: "Gerencia" },
    { label: "Gestión de pacientes", value: "Gestión de pacientes" },
    { label: "Mantenimiento", value: "Mantenimiento" },
    { label: "Recepción", value: "Recepción" },
];

const statusOptions = [
    { label: "Seleccionar estado", value: "all" },
    { label: "Activo", value: "activo" },
    { label: "De permiso", value: "de permiso" },
    { label: "En capacitación", value: "en capacitación" },
    { label: "Inactivo", value: "inactivo" },
];

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface EmployeeFormValues {
    fullName: string;
    idNumber: string;
    email: string;
    phone: string;
    department: EmployeeDepartment | "all";
    role: string;
    profile: EmployeeProfile | "all";
    status: EmployeeStatus | "all";
    manualCode: string;
    manualDate: string;
}

interface FormErrors {
    fullName?: string;
    idNumber?: string;
    email?: string;
    department?: string;
    role?: string;
    profile?: string;
    status?: string;
    manualCode?: string;
    manualDate?: string;
}

const initialValues: EmployeeFormValues = {
    fullName: "",
    idNumber: "",
    email: "",
    phone: "",
    department: "all",
    role: "",
    profile: "all",
    status: "activo",
    manualCode: "",
    manualDate: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
    return name.trim().split(" ").filter(Boolean)
        .slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
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

function buildCode(n: number) {
    return `EMP-${String(n).padStart(3, "0")}`;
}

function normalizeId(value: string) {
    return value.replace(/[^\d-]/g, "");
}

function normalizePhone(value: string) {
    return value.replace(/[^\d-]/g, "");
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddEmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (employee: EmployeeItem) => void;
    nextEmployeeNumber: number;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AddEmployeeDialog({
    open,
    onOpenChange,
    onSubmit,
    nextEmployeeNumber,
}: AddEmployeeDialogProps) {
    const [form, setForm] = useState<EmployeeFormValues>(initialValues);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isManual, setIsManual] = useState(false);

    useEffect(() => {
        if (!open) {
            setForm(initialValues);
            setErrors({});
            setIsManual(false);
        }
    }, [open]);

    const generatedCode = useMemo(() => buildCode(nextEmployeeNumber), [nextEmployeeNumber]);
    const generatedDate = formatToday();

    function set<K extends keyof EmployeeFormValues>(field: K, value: EmployeeFormValues[K]) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function validate(): boolean {
        const e: FormErrors = {};
        if (!form.fullName.trim()) e.fullName = "Requerido.";
        if (!form.idNumber.trim()) e.idNumber = "Requerido.";
        else if (form.idNumber.trim().length < 9) e.idNumber = "Cédula inválida.";
        if (!form.email.trim()) e.email = "Requerido.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Correo inválido.";
        if (form.department === "all") e.department = "Requerido.";
        if (!form.role.trim()) e.role = "Requerido.";
        if (form.profile === "all") e.profile = "Requerido.";
        if (form.status === "all") e.status = "Requerido.";
        if (isManual) {
            if (!form.manualCode.trim()) e.manualCode = "Requerido.";
            if (!form.manualDate) e.manualDate = "Requerido.";
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) return;

        const newEmployee: EmployeeItem = {
            id: crypto.randomUUID(),
            fullName: form.fullName.trim(),
            idNumber: form.idNumber.trim(),
            email: form.email.trim().toLowerCase(),
            phone: form.phone.trim() || undefined,
            department: form.department as EmployeeDepartment,
            role: form.role.trim(),
            profile: form.profile as EmployeeProfile,
            status: form.status as EmployeeStatus,
            employeeCode: isManual ? form.manualCode.trim().toUpperCase() : generatedCode,
            hireDate: isManual ? formatDateFromInput(form.manualDate) : generatedDate,
            initials: getInitials(form.fullName),
            avatarUrl: "",
        };

        onSubmit(newEmployee);
        onOpenChange(false);
    }

    // Clase base reutilizable para inputs
    const inputCls = "h-10 rounded-xl border-slate-200 bg-white text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-slate-100 bg-white p-0 shadow-xl sm:max-w-[600px]">
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 px-6 py-4">
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        Agregar Empleado
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        Complete el formulario para agregar un nuevo empleado
                    </DialogDescription>
                </DialogHeader>

                <motion.form
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    onSubmit={handleSubmit}
                    className="space-y-3 px-6 py-4"
                >
                    {/* Fila 1: Nombre + Cédula */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Nombre Completo</Label>
                            <Input
                                value={form.fullName}
                                onChange={(e) => set("fullName", e.target.value)}
                                placeholder="Nombre del empleado"
                                className={inputCls}
                            />
                            {errors.fullName && <p className="text-[11px] text-red-500">{errors.fullName}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Cédula</Label>
                            <div className="relative">
                                <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={form.idNumber}
                                    onChange={(e) => set("idNumber", normalizeId(e.target.value))}
                                    placeholder="1-2345-6789"
                                    className={`${inputCls} pl-9`}
                                />
                            </div>
                            {errors.idNumber && <p className="text-[11px] text-red-500">{errors.idNumber}</p>}
                        </div>
                    </div>

                    {/* Fila 2: Departamento + Rol */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Departamento</Label>
                            <FilterCombobox
                                value={form.department}
                                onChange={(v) => set("department", v as EmployeeDepartment | "all")}
                                options={departmentOptions}
                                placeholder="Seleccione un departamento"
                                searchPlaceholder="Buscar..."
                                emptyMessage="No encontrado."
                            />
                            {errors.department && <p className="text-[11px] text-red-500">{errors.department}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Rol del Sistema</Label>
                            <FilterCombobox
                                value={form.profile}
                                onChange={(v) => set("profile", v as EmployeeProfile | "all")}
                                options={profileOptions}
                                placeholder="Seleccione un rol"
                                searchPlaceholder="Buscar..."
                                emptyMessage="No encontrado."
                            />
                            {errors.profile && <p className="text-[11px] text-red-500">{errors.profile}</p>}
                        </div>
                    </div>

                    {/* Fila 3: Cargo + Estado */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Cargo</Label>
                            <Input
                                value={form.role}
                                onChange={(e) => set("role", e.target.value)}
                                placeholder="Ej. Analista, Coordinador..."
                                className={inputCls}
                            />
                            {errors.role && <p className="text-[11px] text-red-500">{errors.role}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Estado inicial</Label>
                            <FilterCombobox
                                value={form.status}
                                onChange={(v) => set("status", v as EmployeeStatus | "all")}
                                options={statusOptions}
                                placeholder="Seleccionar estado"
                                searchPlaceholder="Buscar..."
                                emptyMessage="No encontrado."
                            />
                            {errors.status && <p className="text-[11px] text-red-500">{errors.status}</p>}
                        </div>
                    </div>

                    {/* Fila 4: Email + Teléfono */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Correo Electrónico</Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => set("email", e.target.value)}
                                    placeholder="correo@patitos.cr"
                                    className={`${inputCls} pl-9`}
                                />
                            </div>
                            {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-1">
                            <Label className="text-xs font-medium text-slate-600">Teléfono</Label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    value={form.phone}
                                    onChange={(e) => set("phone", normalizePhone(e.target.value))}
                                    placeholder="8888-8888"
                                    className={`${inputCls} pl-9`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Código y fecha */}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <button
                            type="button"
                            onClick={() => setIsManual((v) => !v)}
                            className="flex w-full items-center justify-between"
                        >
                            <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                <Settings2 className="h-3.5 w-3.5 text-slate-400" />
                                Código y fecha de ingreso
                            </span>
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${isManual ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"
                                }`}>
                                {isManual ? "Manual" : "Automático"}
                            </span>
                        </button>

                        <div className="mt-2.5 grid grid-cols-2 gap-3">
                            {isManual ? (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-[11px] text-slate-400">Código</Label>
                                        <Input
                                            value={form.manualCode}
                                            onChange={(e) => set("manualCode", e.target.value.toUpperCase())}
                                            placeholder="EMP-001"
                                            className="h-9 rounded-xl border-slate-200 bg-white text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                        />
                                        {errors.manualCode && <p className="text-[11px] text-red-500">{errors.manualCode}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[11px] text-slate-400">Fecha de ingreso</Label>
                                        <Input
                                            type="date"
                                            value={form.manualDate}
                                            max={todayForInput()}
                                            onChange={(e) => set("manualDate", e.target.value)}
                                            className="h-9 rounded-xl border-slate-200 bg-white text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                        />
                                        {errors.manualDate && <p className="text-[11px] text-red-500">{errors.manualDate}</p>}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-1">
                                        <Label className="text-[11px] text-slate-400">Código generado</Label>
                                        <Input value={generatedCode} disabled className="h-9 rounded-xl border-slate-200 bg-slate-100 text-sm text-slate-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[11px] text-slate-400">Fecha de ingreso</Label>
                                        <Input value={generatedDate} disabled className="h-9 rounded-xl border-slate-200 bg-slate-100 text-sm text-slate-400" />
                                    </div>
                                </>
                            )}
                        </div>

                        <p className="mt-2 text-[11px] text-slate-400">
                            {isManual
                                ? "Estás ingresando el código y la fecha manualmente."
                                : "El código y la fecha se asignan automáticamente al guardar."}
                        </p>
                    </div>

                    {/* Nota primer login */}
                    <p className="rounded-xl bg-blue-50 px-3 py-2.5 text-xs text-blue-700">
                        Al crear el empleado, el sistema le solicitará cambiar su contraseña en el primer inicio de sesión.
                    </p>

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
                            Agregar Empleado
                        </Button>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
}