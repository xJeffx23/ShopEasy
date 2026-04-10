"use client"

import { motion } from "framer-motion"

type Burbuja = {
    id: number
    tamaño: number
    izquierda: string
    arriba: string
    retraso: number
    duracion: number
}

const burbujas: Burbuja[] = [
    { id: 1, tamaño: 300, izquierda: "-10%", arriba: "5%", retraso: 0, duracion: 18 },
    { id: 2, tamaño: 420, izquierda: "20%", arriba: "30%", retraso: 1, duracion: 22 },
    { id: 3, tamaño: 250, izquierda: "65%", arriba: "65%", retraso: 0.5, duracion: 20 },
    { id: 4, tamaño: 500, izquierda: "50%", arriba: "-10%", retraso: 1.5, duracion: 25 },
]

export default function AnimatedAuthBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">

            {/* Glow central */}
            <motion.div
                className="absolute top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[180px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.08, 0.15, 0.08],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Burbujas dinámicas */}
            {burbujas.map((b) => (
                <motion.div
                    key={b.id}
                    className="absolute rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-3xl"
                    style={{
                        width: b.tamaño,
                        height: b.tamaño,
                        left: b.izquierda,
                        top: b.arriba,
                    }}
                    animate={{
                        x: [0, 80, -40, 0],
                        y: [0, -60, 50, 0],
                        scale: [1, 1.25, 1.1, 1],
                        rotate: [0, 8, -6, 0],
                    }}
                    transition={{
                        duration: b.duracion,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: b.retraso,
                    }}
                />
            ))}

            {/* Líneas flotantes */}
            <motion.div
                className="absolute left-[-30%] top-[20%] h-[140px] w-[80%] rotate-12 bg-white/10 blur-2xl"
                animate={{ x: [0, 200, 0], opacity: [0.05, 0.15, 0.05] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                className="absolute right-[-30%] bottom-[20%] h-[160px] w-[80%] -rotate-12 bg-white/10 blur-2xl"
                animate={{ x: [0, -200, 0], opacity: [0.05, 0.15, 0.05] }}
                transition={{
                    duration: 16,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />

            {/* Patrón de puntos */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                }}
            />

            {/* Overlay superior */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        </div>
    )
}
