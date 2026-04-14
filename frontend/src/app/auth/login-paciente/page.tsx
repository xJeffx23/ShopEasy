"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { authService } from "@/src/services/auth.service";
import AnimatedAuthBackground from "@/src/components/login/AnimatedAuthBackground";

export default function LoginPacientePage() {
    const router = useRouter();

    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await authService.loginPaciente({
                Nombre_usuario: username,
                Contrasena: password,
            });

            router.push("/paciente/dashboard");
        } catch (err: any) {
            console.error("Error al iniciar sesión:", err);
            setError(err.response?.data?.message || "Usuario o contraseña incorrectos");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Panel izquierdo decorativo */}
            <aside className="hidden md:flex relative flex-col justify-center items-center bg-gradient-to-br from-teal-600 to-teal-800 text-white px-12 overflow-hidden">
                <AnimatedAuthBackground />
                
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-md space-y-6"
                >
                    {/* Logo grande */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="flex justify-center"
                    >
                        <Image
                            src="/LogoPatitos.png"
                            alt="Logo Patitos del Retiro"
                            width={180}
                            height={180}
                            className="drop-shadow-2xl"
                        />
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm backdrop-blur-sm"
                    >
                        <Heart className="h-4 w-4 text-red-300" />
                        Portal de Pacientes
                    </motion.div>

                    <h1 className="text-4xl font-semibold leading-tight">
                        Bienvenido a <br />
                        Patitos del <br />
                        Retiro
                    </h1>

                    <p className="text-white/80">
                        Accede a tu portal personal para gestionar tus reservaciones
                        y consultar tu historial de estancias.
                    </p>

                    <div className="flex flex-col gap-3 text-sm text-white/70">
                        <span>✔ Consulta tu historial de reservaciones</span>
                        <span>✔ Realiza nuevas reservaciones</span>
                        <span>✔ Información actualizada de tus estancias</span>
                    </div>
                </motion.div>
            </aside>

            {/* Panel derecho - Formulario */}
            <main className="flex items-center justify-center bg-gradient-to-br from-slate-50 to-teal-50 px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-8"
                >
                    {/* Logo pequeño + título */}
                    <div className="flex items-center gap-3">
                        <Image
                            src="/LogoPatitos.png"
                            alt="Logo Patitos del Retiro"
                            width={48}
                            height={48}
                            className="rounded-xl"
                        />
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">Patitos del Retiro</h2>
                            <p className="text-sm text-slate-500">Portal de Pacientes</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-slate-800">Iniciar Sesión</h3>
                        <p className="text-sm text-slate-500">
                            Ingresa tus credenciales para acceder a tu portal
                        </p>
                    </div>

                    <form onSubmit={manejarEnvio} className="space-y-5">
                        <div>
                            <Label htmlFor="username" className="text-slate-700">Usuario</Label>
                            <div className="relative mt-2">
                                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Ingresa tu usuario"
                                    className="pl-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="contrasena" className="text-slate-700">Contraseña</Label>
                            <div className="relative mt-2">
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                <Input
                                    id="contrasena"
                                    type={mostrarContrasena ? "text" : "password"}
                                    placeholder="Ingresa tu contraseña"
                                    className="pl-10 pr-10 border-slate-200 focus:border-teal-500 focus:ring-teal-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                                >
                                    {mostrarContrasena ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-3 rounded-lg bg-red-50 border border-red-200"
                            >
                                <p className="text-sm text-red-600">{error}</p>
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-teal-600 hover:bg-teal-700"
                            disabled={loading}
                        >
                            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                        </Button>
                    </form>

                    {/* Link al login de empleados */}
                    <div className="text-center pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-500">
                            ¿Eres empleado?{" "}
                            <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
                                Ir al portal de empleados
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
