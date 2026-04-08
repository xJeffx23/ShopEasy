"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import AnimatedAuthBackground from "@/src/components/login/AnimatedAuthBackground";
import { login } from "@/src/lib/auth/auth-service";

export default function LoginView() {
    const router = useRouter();

    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await login({ username, password });

            if (!result.success) {
                setError(result.message);
                return;
            }

            // Si es el primer login, redirigir al cambio de contraseña obligatorio
            if (result.mustChangePassword) {
                router.push("/auth/change-password");
                return;
            }

            router.push("/sistema/dashboard");
        } catch (err) {
            console.error("Error al iniciar sesión:", err);
            setError("Ocurrió un error inesperado al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
            {/* Panel izquierdo */}
            <aside className="relative hidden flex-col items-center justify-center overflow-hidden bg-blue-600 px-12 text-white md:flex">
                <AnimatedAuthBackground />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-md space-y-6"
                >
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm"
                    >
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Sistema de Gestión Clínica
                    </motion.div>

                    <h1 className="text-4xl font-semibold leading-tight">
                        Cuida a tus <br />
                        residentes con <br />
                        dedicación
                    </h1>

                    <p className="text-white/80">
                        Gestiona pacientes, habitaciones, reservaciones y personal del asilo
                        Patitos del Retiro desde un solo lugar.
                    </p>

                    <div className="flex flex-wrap gap-6 text-sm text-white/70">
                        <span>✔ Control de habitaciones</span>
                        <span>✔ Gestión de pacientes</span>
                    </div>
                </motion.div>
            </aside>

            {/* Panel derecho */}
            <main className="flex items-center justify-center bg-white px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                            P
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Patitos del Retiro
                            </h2>
                            <p className="text-xs text-slate-500">Sistema de Gestión Clínica</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-slate-900">Bienvenido</h3>
                        <p className="text-sm text-slate-500">Inicia sesión para continuar</p>
                    </div>

                    <motion.form
                        onSubmit={manejarEnvio}
                        className="space-y-5"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.12 } },
                        }}
                    >
                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <Label htmlFor="username">Usuario</Label>
                            <div className="relative mt-2">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    className="pl-10"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <Label htmlFor="contrasena">Contraseña</Label>
                            <div className="relative mt-2">
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="contrasena"
                                    type={mostrarContrasena ? "text" : "password"}
                                    placeholder="Ingresa tu contraseña"
                                    className="pl-10 pr-10"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                    {mostrarContrasena
                                        ? <EyeOff className="h-4 w-4" />
                                        : <Eye className="h-4 w-4" />
                                    }
                                </button>
                            </div>
                        </motion.div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-medium text-red-500"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.div
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                        >
                            <Button
                                type="submit"
                                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                            </Button>
                        </motion.div>
                    </motion.form>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        <p className="font-medium text-slate-700">Credenciales de prueba</p>
                        <p>Usuario: admin</p>
                        <p>Contraseña: admin</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}