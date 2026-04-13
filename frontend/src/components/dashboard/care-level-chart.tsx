"use client";

import { Activity } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { CareLevel } from "@/src/types/dashboard";

interface CareLevelChartProps {
    data?: CareLevel[];
}

const FALLBACK_DATA: CareLevel[] = [
    { level: "Básica", count: 1, color: "#10b981" },
    { level: "Movilidad", count: 2, color: "#3b82f6" },
    { level: "Completa", count: 2, color: "#8b5cf6" },
];

export default function CareLevelChart({ data = FALLBACK_DATA }: CareLevelChartProps) {
    return (
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-slate-500" />
                    <CardTitle className="text-base font-semibold text-slate-800">
                        Pacientes por Nivel de Asistencia
                    </CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-500">
                    Distribución según requerimiento de cuidados
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 0, right: 16, top: 4, bottom: 0 }}
                    >
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: "#94a3b8" }}
                            allowDecimals={false}
                        />
                        <YAxis
                            dataKey="level"
                            type="category"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: "#64748b" }}
                            width={85}
                        />
                        <Tooltip
                            formatter={(value: number) => [`${value} paciente(s)`, "Cantidad"]}
                            contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                fontSize: "13px",
                            }}
                        />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}