"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import api from "@/src/services/api";
import { authService } from "@/src/services/auth.service";

export default function CambiarContrasenaPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        contrasenaActual: "",
        contrasenaNueva: "",
        confirmarContrasena: ""
    });
    const [showPasswords, setShowPasswords] = useState({
        actual: false,
        nueva: false,
        confirmar: false
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = authService.getUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validaciones
        if (formData.contrasenaNueva.length < 6) {
            setError("La nueva contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (formData.contrasenaNueva !== formData.confirmarContrasena) {
            setError("Las contraseñas no coinciden");
            return;
        }

        if (formData.contrasenaActual === formData.contrasenaNueva) {
            setError("La nueva contraseña debe ser diferente a la actual");
            return;
        }

        setLoading(true);

        try {
            await api.post("/auth/cambiar-contrasena", {
                contrasenaActual: formData.contrasenaActual,
                contrasenaNueva: formData.contrasenaNueva
            });

            // Actualizar el estado del usuario en localStorage
            const currentUser = authService.getUser();
            if (currentUser) {
                localStorage.setItem('user', JSON.stringify({
                    ...currentUser,
                    cambioContrasena: false
                }));
            }

            setSuccess(true);

            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
                router.push('/sistema/dashboard');
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.message || "Error al cambiar la contraseña");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                        ¡Contraseña actualizada!
                    </h2>
                    <p className="text-slate-500">
                        Serás redirigido al sistema en unos segundos...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">
                        Cambio de Contraseña
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {user?.nombre}, es tu primer ingreso al sistema.
                        Por seguridad, debes cambiar tu contraseña.
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Contraseña actual */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Contraseña actual
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.actual ? "text" : "password"}
                                value={formData.contrasenaActual}
                                onChange={(e) => setFormData({ ...formData, contrasenaActual: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                                placeholder="Ingresa tu contraseña actual"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, actual: !showPasswords.actual })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPasswords.actual ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Nueva contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.nueva ? "text" : "password"}
                                value={formData.contrasenaNueva}
                                onChange={(e) => setFormData({ ...formData, contrasenaNueva: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                                placeholder="Mínimo 6 caracteres"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, nueva: !showPasswords.nueva })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPasswords.nueva ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirmar contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Confirmar nueva contraseña
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirmar ? "text" : "password"}
                                value={formData.confirmarContrasena}
                                onChange={(e) => setFormData({ ...formData, confirmarContrasena: e.target.value })}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                                placeholder="Repite la nueva contraseña"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirmar: !showPasswords.confirmar })}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPasswords.confirmar ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Actualizando...
                            </>
                        ) : (
                            "Cambiar contraseña"
                        )}
                    </button>
                </form>

                {/* Info */}
                <p className="mt-6 text-center text-xs text-slate-400">
                    Esta acción es obligatoria por políticas de seguridad del sistema.
                </p>
            </div>
        </div>
    );
}