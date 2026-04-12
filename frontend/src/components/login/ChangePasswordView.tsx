"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, KeyRound, Lock, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/auth/auth-service";
import { getSession, markPasswordChanged } from "@/lib/auth/auth-storage";

export default function ChangePasswordView() {
    const router = useRouter();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [token, setToken] = useState("");

    // Verificar que el usuario está autenticado y realmente necesita cambiar contraseña
    useEffect(() => {
        const session = getSession();
        if (!session) {
            router.replace("/auth/login");
            return;
        }
        if (!session.mustChangePassword) {
            router.replace("/sistema/dashboard");
            return;
        }
        setUsername(session.user.username);
        setToken(session.token);
    }, [router]);

    // Validaciones en tiempo real
    const tooShort = newPassword.length > 0 && newPassword.length < 8;
    const noMatch = confirmPass.length > 0 && newPassword !== confirmPass;
    const sameAsOld = newPassword.length > 0 && newPassword === oldPassword;
    const canSubmit = oldPassword && newPassword.length >= 8 && newPassword === confirmPass && !sameAsOld;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;

        setError("");
        setLoading(true);

        try {
            const result = await changePassword(
                { username, oldPassword, newPassword },
                token,
            );

            if (!result.success) {
                setError(result.message);
                return;
            }

            // Marcar en la sesión que ya cambió la contraseña
            markPasswordChanged();
            router.push("/sistema/dashboard");
        } catch {
            setError("Ocurrió un error inesperado. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                    {/* Icono + título */}
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">
                            <KeyRound className="h-7 w-7 text-blue-600" />
                        </div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Cambio de contraseña requerido
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Es tu primer inicio de sesión. Por seguridad, debes establecer
                            una nueva contraseña antes de continuar.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Contraseña actual */}
                        <div className="space-y-1.5">
                            <Label htmlFor="oldPass">Contraseña actual</Label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="oldPass"
                                    type={showOld ? "text" : "password"}
                                    placeholder="Tu contraseña actual"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="h-11 rounded-xl border-slate-200 pl-10 pr-10 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOld(!showOld)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Nueva contraseña */}
                        <div className="space-y-1.5">
                            <Label htmlFor="newPass">Nueva contraseña</Label>
                            <div className="relative">
                                <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="newPass"
                                    type={showNew ? "text" : "password"}
                                    placeholder="Mínimo 8 caracteres"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="h-11 rounded-xl border-slate-200 pl-10 pr-10 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {tooShort && (
                                <p className="text-[11px] text-red-500">Mínimo 8 caracteres.</p>
                            )}
                            {sameAsOld && (
                                <p className="text-[11px] text-red-500">
                                    La nueva contraseña no puede ser igual a la actual.
                                </p>
                            )}
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPass">Confirmar nueva contraseña</Label>
                            <div className="relative">
                                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="confirmPass"
                                    type={showConfirm ? "text" : "password"}
                                    placeholder="Repite la nueva contraseña"
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    className="h-11 rounded-xl border-slate-200 pl-10 pr-10 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {noMatch && (
                                <p className="text-[11px] text-red-500">Las contraseñas no coinciden.</p>
                            )}
                        </div>

                        {/* Indicador de requisitos */}
                        <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 space-y-1">
                            <p className={newPassword.length >= 8 ? "text-emerald-600" : ""}>
                                {newPassword.length >= 8 ? "✔" : "○"} Mínimo 8 caracteres
                            </p>
                            <p className={newPassword === confirmPass && confirmPass.length > 0 ? "text-emerald-600" : ""}>
                                {newPassword === confirmPass && confirmPass.length > 0 ? "✔" : "○"} Las contraseñas coinciden
                            </p>
                            <p className={!sameAsOld && newPassword.length > 0 ? "text-emerald-600" : ""}>
                                {!sameAsOld && newPassword.length > 0 ? "✔" : "○"} Diferente a la contraseña actual
                            </p>
                        </div>

                        {error && (
                            <p className="text-sm font-medium text-red-500">{error}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={!canSubmit || loading}
                            className="h-11 w-full rounded-xl bg-blue-600 text-sm font-medium hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Establecer nueva contraseña"}
                        </Button>
                    </form>
                </div>

                {/* Logo pequeño */}
                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-[10px] font-bold text-white">P</div>
                    Patitos del Retiro
                </div>
            </motion.div>
        </div>
    );
}