"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Mail, Save, UserPlus, X } from "lucide-react";

import FilterCombobox from "@/src/components/ui/filter-combobox";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import type { EmployeeItem, EmployeeStatus } from "@/src/types/employee";

type EmployeeDepartment =
    | "Administrativo"
    | "Gerencia"
    | "DTI"
    | "Financiero";

type DepartmentSelectValue = EmployeeDepartment | "all";
type StatusSelectValue = EmployeeStatus | "all";

interface AddEmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (employee: EmployeeItem) => void;
    nextEmployeeNumber: number;
}

interface EmployeeFormValues {
    fullName: string;
    idNumber: string;
    email: string;
    department: DepartmentSelectValue;
    role: string;
    status: StatusSelectValue;
}

interface FormErrors {
    fullName?: string;
    idNumber?: string;
    email?: string;
    department?: string;
    role?: string;
    status?: string;
}

const initialFormValues: EmployeeFormValues = {
    fullName: "",
    idNumber: "",
    email: "",
    department: "all",
    role: "",
    status: "activo",
};

const departmentOptions = [
    { label: "Seleccionar departamento", value: "all" },
    { label: "Administrativo", value: "Administrativo" },
    { label: "Gerencia", value: "Gerencia" },
    { label: "DTI", value: "DTI" },
    { label: "Financiero", value: "Financiero" },
];

const statusOptions = [
    { label: "Seleccionar estado", value: "all" },
    { label: "Activo", value: "activo" },
    { label: "De permiso", value: "de permiso" },
    { label: "En capacitación", value: "en capacitación" },
    { label: "Inactivo", value: "inactivo" },
];

function getInitials(fullName: string) {
    return fullName
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

function formatToday() {
    return new Intl.DateTimeFormat("es-CR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date());
}

function buildEmployeeCode(nextEmployeeNumber: number) {
    return `EMP-${String(nextEmployeeNumber).padStart(3, "0")}`;
}

function normalizeIdNumber(value: string) {
    return value.replace(/[^\d-]/g, "");
}

export default function AddEmployeeDialog({
    open,
    onOpenChange,
    onSubmit,
    nextEmployeeNumber,
}: AddEmployeeDialogProps) {
    const [formValues, setFormValues] =
        useState<EmployeeFormValues>(initialFormValues);
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (!open) {
            setFormValues(initialFormValues);
            setErrors({});
        }
    }, [open]);

    const generatedCode = useMemo(
        () => buildEmployeeCode(nextEmployeeNumber),
        [nextEmployeeNumber]
    );

    function updateField<K extends keyof EmployeeFormValues>(
        field: K,
        value: EmployeeFormValues[K]
    ) {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [field]: undefined,
        }));
    }

    function validateForm() {
        const nextErrors: FormErrors = {};

        if (!formValues.fullName.trim()) {
            nextErrors.fullName = "Ingresa el nombre completo.";
        }

        if (!formValues.idNumber.trim()) {
            nextErrors.idNumber = "Ingresa la cédula del empleado.";
        } else if (formValues.idNumber.trim().length < 9) {
            nextErrors.idNumber = "Ingresa una cédula válida.";
        }

        if (!formValues.email.trim()) {
            nextErrors.email = "Ingresa el correo electrónico.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            nextErrors.email = "Ingresa un correo válido.";
        }

        if (formValues.department === "all") {
            nextErrors.department = "Selecciona un departamento.";
        }

        if (!formValues.role.trim()) {
            nextErrors.role = "Ingresa el cargo del empleado.";
        }

        if (formValues.status === "all") {
            nextErrors.status = "Selecciona un estado inicial.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!validateForm()) return;

        const newEmployee: EmployeeItem = {
            id: crypto.randomUUID(),
            fullName: formValues.fullName.trim(),
            email: formValues.email.trim().toLowerCase(),
            department: formValues.department as EmployeeDepartment,
            role: formValues.role.trim(),
            status: formValues.status as EmployeeStatus,
            employeeCode: generatedCode,
            hireDate: formatToday(),
            initials: getInitials(formValues.fullName),
            avatarUrl: "",
            idNumber: formValues.idNumber.trim(),
        } as EmployeeItem;

        onSubmit(newEmployee);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-gray-100 bg-white p-0 shadow-[0_10px_30px_rgba(16,24,40,0.08)] sm:max-w-[640px]">
                <DialogHeader className="border-b border-gray-100 px-6 py-5">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        Agregar empleado
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        Registra un nuevo miembro del personal. El código y la fecha de
                        ingreso se generan automáticamente por ahora.
                    </DialogDescription>
                </DialogHeader>

                <motion.form
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    onSubmit={handleSubmit}
                    className="space-y-5 px-6 py-5"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nombre completo</Label>
                            <Input
                                id="fullName"
                                value={formValues.fullName}
                                onChange={(e) => updateField("fullName", e.target.value)}
                                placeholder="Ej. Laura González Mora"
                                className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.fullName && (
                                <p className="text-xs text-red-600">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="idNumber">Cédula</Label>
                            <div className="relative">
                                <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="idNumber"
                                    value={formValues.idNumber}
                                    onChange={(e) =>
                                        updateField(
                                            "idNumber",
                                            normalizeIdNumber(e.target.value)
                                        )
                                    }
                                    placeholder="Ej. 1-2345-6789"
                                    className="h-12 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            {errors.idNumber && (
                                <p className="text-xs text-red-600">{errors.idNumber}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={formValues.email}
                                    onChange={(e) => updateField("email", e.target.value)}
                                    placeholder="empleado@patitos.com"
                                    className="h-12 rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Cargo</Label>
                            <Input
                                id="role"
                                value={formValues.role}
                                onChange={(e) => updateField("role", e.target.value)}
                                placeholder="Ej. Analista, Coordinador, Asistente..."
                                className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                            />
                            {errors.role && (
                                <p className="text-xs text-red-600">{errors.role}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Departamento</Label>
                            <FilterCombobox
                                value={formValues.department}
                                onChange={(value) =>
                                    updateField("department", value as DepartmentSelectValue)
                                }
                                options={departmentOptions}
                                placeholder="Seleccionar departamento"
                                searchPlaceholder="Buscar departamento..."
                                emptyMessage="No se encontró ningún departamento."
                            />
                            {errors.department && (
                                <p className="text-xs text-red-600">{errors.department}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Estado inicial</Label>
                            <FilterCombobox
                                value={formValues.status}
                                onChange={(value) =>
                                    updateField("status", value as StatusSelectValue)
                                }
                                options={statusOptions}
                                placeholder="Seleccionar estado"
                                searchPlaceholder="Buscar estado..."
                                emptyMessage="No se encontró ningún estado."
                            />
                            {errors.status && (
                                <p className="text-xs text-red-600">{errors.status}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Código generado</Label>
                            <Input
                                value={generatedCode}
                                disabled
                                className="h-12 rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm text-gray-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Fecha de ingreso</Label>
                            <Input
                                value={formatToday()}
                                disabled
                                className="h-12 rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="h-11 rounded-xl border-gray-200"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>

                        <Button
                            type="submit"
                            className="h-11 rounded-xl bg-blue-600 hover:bg-blue-700"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Guardar empleado
                        </Button>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
}