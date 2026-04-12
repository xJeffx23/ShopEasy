"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Save, X } from "lucide-react";
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EmployeeItem } from "@/types/employee";

interface CreateUserAccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    employee: EmployeeItem | null;
    onSubmit: (employeeId: string, username: string, password: string) => void;
}

interface FormValues {
    username: string;
    password: string;
    confirm: string;
}

interface FormErrors {
    username?: string;
    password?: string;
    confirm?: string;
}

const initial: FormValues = { username: "", password: "", confirm: "" };

function generateUsername(fullName: string): string {
    // Genera usuario tipo: j.calderon
    const parts = fullName.trim().toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(" ").filter(Boolean);
    if (parts.length < 2) return parts[0] ?? "";
    return `${parts[0][0]}.${parts[1]}`;
}

function generateTempPassword(): string {
    // Contraseña temporal segura de 10 caracteres
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
    return Array.from({ length: 10 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");
}

export default function CreateUserAccessDialog({
    open, onOpenChange, employee, onSubmit,
}: CreateUserAccessDialogProps) {
    const [form, setForm] = useState<FormValues>(initial);
    const [errors, setErrors] = useState<FormErrors>({});
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && employee) {
            // Pre-rellenar usuario sugerido basado en el nombre
            setForm({
                username: generateUsername(employee.fullName),
                password: "",
                confirm: "",
            });
            setErrors({});
        }
        if (!open) {
            setForm(initial);
            setErrors({});
            setShowPass(false);
        }
    }, [open, employee]);

    function set<K extends keyof FormValues>(field: K, value: string) {
        setForm((p) => ({ ...p, [field]: value }));
        setErrors((p) => ({ ...p, [field]: undefined }));
    }

    function handleGenerate() {
        set("password", generateTempPassword());
        set("confirm", "");
    }

    function validate(): boolean {
        const e: FormErrors = {};
        if (!form.username.trim())
            e.username = "Requerido.";
        else if (form.username.trim().length < 3)
            e.username = "Mínimo 3 caracteres.";
        if (!form.password)
            e.password = "Requerido.";
        else if (form.password.length < 8)
            e.password = "Mínimo 8 caracteres.";
        if (!form.confirm)
            e.confirm = "Requerido.";
        else if (form.confirm !== form.password)
            e.confirm = "Las contraseñas no coinciden.";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate() || !employee) return;

        setLoading(true);
        try {
            onSubmit(employee.id, form.username.trim(), form.password);
            // TODO: await createEmployeeUser(employee.id, form.username, form.password)
            //   POST /api/users  { employeeId, username, password, profile: employee.profile }
            onOpenChange(false);
        } finally {
            setLoading(false);
        }
    }

    if (!employee) return null;

    const inputCls = "h-10 rounded-xl border-slate-200 bg-white text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-slate-100 bg-white p-0 shadow-xl sm:max-w-[480px]">
                <DialogHeader className="border-b border-slate-100 px-6 py-4">
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <KeyRound className="h-5 w-5 text-blue-600" />
                        Crear acceso al sistema
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        Crea las credenciales de acceso para{" "}
                        <span className="font-medium text-slate-700">{employee.fullName}</span>
                    </DialogDescription>
                </DialogHeader>

                <motion.form
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    onSubmit={handleSubmit}
                    className="space-y-4 px-6 py-5"
                >
                    {/* Info del empleado */}
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-blue-600">
                            {employee.initials}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {employee.fullName}
                            </p>
                            <p className="text-xs text-slate-500">
                                {employee.profile} · {employee.department}
                            </p>
                        </div>
                    </div>

                    {/* Usuario */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-slate-600">
                            Nombre de usuario
                        </Label>
                        <Input
                            value={form.username}
                            onChange={(e) => set("username", e.target.value.toLowerCase().replace(/\s/g, ""))}
                            placeholder="Ej. j.calderon"
                            className={inputCls}
                        />
                        {errors.username
                            ? <p className="text-[11px] text-red-500">{errors.username}</p>
                            : <p className="text-[11px] text-slate-400">El usuario puede ser editado antes de confirmar.</p>
                        }
                    </div>

                    {/* Contraseña */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-medium text-slate-600">
                                Contraseña temporal
                            </Label>
                            <button
                                type="button"
                                onClick={handleGenerate}
                                className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                            >
                                Generar aleatoria
                            </button>
                        </div>
                        <div className="relative">
                            <Input
                                type={showPass ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => set("password", e.target.value)}
                                placeholder="Mínimo 8 caracteres"
                                className={`${inputCls} pr-10`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
                    </div>

                    {/* Confirmar contraseña */}
                    <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-slate-600">
                            Confirmar contraseña
                        </Label>
                        <Input
                            type="password"
                            value={form.confirm}
                            onChange={(e) => set("confirm", e.target.value)}
                            placeholder="Repite la contraseña"
                            className={inputCls}
                        />
                        {errors.confirm && <p className="text-[11px] text-red-500">{errors.confirm}</p>}
                    </div>

                    {/* Nota */}
                    <p className="rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
                        El empleado deberá cambiar esta contraseña en su primer inicio de sesión.
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
                            disabled={loading}
                            className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 active:scale-[0.98]"
                        >
                            <Save className="mr-1.5 h-3.5 w-3.5" />
                            Crear acceso
                        </Button>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
}