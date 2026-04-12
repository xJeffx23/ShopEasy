"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityItem } from "@/types/dashboard";

interface RecentActivityProps {
    items: ActivityItem[];
}

function getTypeBadge(color: ActivityItem["typeColor"]) {
    switch (color) {
        case "green": return "bg-emerald-100 text-emerald-700";
        case "blue": return "bg-blue-100 text-blue-700";
        case "amber": return "bg-amber-100 text-amber-700";
        default: return "bg-slate-100 text-slate-600";
    }
}

export default function RecentActivity({ items }: RecentActivityProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Actividad reciente
                    </h2>
                    <p className="text-sm text-slate-500">
                        Últimos movimientos registrados en el sistema.
                    </p>
                </div>

                <Button
                    variant="ghost"
                    asChild
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    <Link href="/sistema/patients">Ver todo</Link>
                </Button>
            </div>

            <Card className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
                <CardHeader className="border-b border-slate-100 px-6 py-4">
                    <CardTitle className="text-sm font-medium text-slate-700">
                        Resumen de actividad
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Cabecera de columnas */}
                    <div className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        <span>Paciente / Evento</span>
                        <span>Tipo</span>
                        <span>Habitación</span>
                        <span>Tiempo</span>
                    </div>

                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.06 }}
                            className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] items-center border-t border-slate-100 px-6 py-4"
                        >
                            {/* Paciente */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                                    {item.initials}
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {item.patientName}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                        {item.eventDescription}
                                    </p>
                                </div>
                            </div>

                            {/* Tipo */}
                            <div>
                                <span
                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getTypeBadge(item.typeColor)}`}
                                >
                                    {item.type}
                                </span>
                            </div>

                            {/* Habitación */}
                            <div className="text-sm text-slate-600">{item.room}</div>

                            {/* Tiempo */}
                            <div className="text-sm text-slate-400">{item.timeAgo}</div>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}