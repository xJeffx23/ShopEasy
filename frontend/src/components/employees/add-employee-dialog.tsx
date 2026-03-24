"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Save, UserPlus, X } from "lucide-react";

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
    | "Enfermería"
    | "Médico"
    | "Administración"
    | "Mantenimiento"
    | "Nutrición"
    | "Seguridad";

interface AddEmployeeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (employee: EmployeeItem) => void;
    nextEmployeeNumber: number;
}

interface EmployeeFormValues {
    fullName: string;
    email: string;
    department: EmployeeDepartment | "";
    role: string;
    status: EmployeeStatus;
}

interface FormErrors {
    fullName?: string;
    email?: string;
    department?: string;
    role?: string;
}

const initialFormValues: EmployeeFormValues = {
    fullName: "",
    email: "",
    department: "",
    role: "",
    status: "activo",
};

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

        if (!formValues.email.trim()) {
            nextErrors.email = "Ingresa el correo electrónico.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
            nextErrors.email = "Ingresa un correo válido.";
        }

        if (!formValues.department) {
            nextErrors.department = "Selecciona un departamento.";
        }

        if (!formValues.role.trim()) {
            nextErrors.role = "Ingresa el cargo del empleado.";
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
            status: formValues.status,
            employeeCode: generatedCode,
            hireDate: formatToday(),
            initials: getInitials(formValues.fullName),
            avatarUrl: "",
        };

        onSubmit(newEmployee);
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border-slate-200 sm:max-w-[640px]">
                <DialogHeader className="space-y-2">
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
                    className="space-y-5"
                >
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Nombre completo</Label>
                            <Input
                                id="fullName"
                                value={formValues.fullName}
                                onChange={(e) => updateField("fullName", e.target.value)}
                                placeholder="Ej. Laura González Mora"
                            />
                            {errors.fullName && (
                                <p className="text-xs text-red-600">{errors.fullName}</p>
                            )}
                        </div>

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
                                    className="pl-9"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="department">Departamento</Label>
                            <select
                                id="department"
                                value={formValues.department}
                                onChange={(e) =>
                                    updateField(
                                        "department",
                                        e.target.value as EmployeeFormValues["department"]
                                    )
                                }
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-background transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-blue-100"
                            >
                                <option value="">Seleccionar departamento</option>
                                <option value="Enfermería">Enfermería</option>
                                <option value="Médico">Médico</option>
                                <option value="Administración">Administración</option>
                                <option value="Mantenimiento">Mantenimiento</option>
                                <option value="Nutrición">Nutrición</option>
                                <option value="Seguridad">Seguridad</option>
                            </select>
                            {errors.department && (
                                <p className="text-xs text-red-600">{errors.department}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Cargo</Label>
                            <Input
                                id="role"
                                value={formValues.role}
                                onChange={(e) => updateField("role", e.target.value)}
                                placeholder="Ej. Enfermera jefe"
                            />
                            {errors.role && (
                                <p className="text-xs text-red-600">{errors.role}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado inicial</Label>
                            <select
                                id="status"
                                value={formValues.status}
                                onChange={(e) =>
                                    updateField("status", e.target.value as EmployeeStatus)
                                }
                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-blue-100"
                            >
                                <option value="activo">Activo</option>
                                <option value="de permiso">De permiso</option>
                                <option value="en capacitación">En capacitación</option>
                                <option value="inactivo">Inactivo</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Código generado</Label>
                            <Input value={generatedCode} disabled />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Cancelar
                        </Button>

                        <Button type="submit" className="rounded-xl bg-blue-600 hover:bg-blue-700">
                            <Save className="mr-2 h-4 w-4" />
                            Guardar empleado
                        </Button>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
}