"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import AnimatedAuthBackground from "@/src/components/login/AnimatedAuthBackground";
import { authService } from "@/src/services/auth.service";

export default function LoginView() {
    const router = useRouter();

    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [username, setUsername] = useState("cmendez");
    const [password, setPassword] = useState("123");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const manejarEnvio = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await authService.login({
                Nombre_usuario: username,
                Contrasena: password,
            });

            router.push("/sistema/dashboard");
        } catch (err: any) {
            console.error("Error al iniciar sesión:", err);
            setError(err.response?.data?.message || "Ocurrió un error inesperado al iniciar sesión.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <aside className="hidden md:flex relative flex-col justify-center items-center bg-[#243C8F] text-white px-12 overflow-hidden">
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
                        Plataforma inteligente
                    </motion.div>

                    <h1 className="text-4xl font-semibold leading-tight">
                        Gestiona tus <br />
                        clientes con <br />
                        confianza
                    </h1>

                    <p className="text-white/80">
                        Centraliza datos, optimiza pedidos y mejora la experiencia del cliente
                        con automatización avanzada.
                    </p>

                    <div className="flex gap-6 text-sm text-white/70">
                        <span>✔ Analítica en tiempo real</span>
                        <span>✔ Automatización inteligente</span>
                    </div>
                </motion.div>
            </aside>

            <main className="flex items-center justify-center bg-background px-6 py-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md space-y-8"
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-[#243C8F] text-white flex items-center justify-center font-semibold">
                            SE
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">ShopEasy CRM</h2>
                            <p className="text-sm text-muted-foreground">por NextCR</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold">Bienvenido</h3>
                        <p className="text-sm text-muted-foreground">
                            Inicia sesión para continuar
                        </p>
                    </div>

                    <motion.form
                        onSubmit={manejarEnvio}
                        className="space-y-5"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: {
                                transition: { staggerChildren: 0.12 },
                            },
                        }}
                    >
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <Label htmlFor="username">Usuario</Label>
                            <div className="relative mt-2">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
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
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <Label htmlFor="contrasena">Contraseña</Label>
                            <div className="relative mt-2">
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
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
                                    className="absolute right-3 top-3.5 text-muted-foreground"
                                >
                                    {mostrarContrasena ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
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
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <Button
                                type="submit"
                                className="w-full bg-[#243C8F] hover:bg-[#1f3277]"
                                disabled={loading}
                            >
                                {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                            </Button>
                        </motion.div>
                    </motion.form>

                    <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                        <p className="font-medium text-foreground">Credenciales de prueba</p>
                        <p>Usuario: cmendez</p>
                        <p>Contraseña: 123</p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}