"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import AnimatedAuthBackground from "@/components/login/AnimatedAuthBackground"

export default function LoginView() {
    const [mostrarContrasena, setMostrarContrasena] = useState(false)

    const manejarEnvio = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

            {/* Panel izquierdo */}
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

            {/* Panel derecho */}
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
                            <Label htmlFor="correo">Correo</Label>
                            <div className="relative mt-2">
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="correo"
                                    type="email"
                                    placeholder="tu@empresa.com"
                                    className="pl-10"
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

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 },
                            }}
                        >
                            <Button className="w-full bg-[#243C8F] hover:bg-[#1f3277]">
                                Iniciar sesión
                            </Button>
                        </motion.div>
                    </motion.form>

                </motion.div>
            </main>
        </div>
    )
}
