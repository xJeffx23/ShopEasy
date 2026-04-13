"use client";

import { ClipboardList } from "lucide-react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/src/components/ui/card";
import { AssistanceLevelDistribution } from "@/src/types/report";

interface ReportsAssistanceChartProps {
    data: AssistanceLevelDistribution[];
}

export function ReportsAssistanceChart({ data }: ReportsAssistanceChartProps) {
    return (
        <Card className="rounded-2xl border border-slate-200/60 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <ClipboardList className="h-4 w-4 text-slate-500" />
                    <CardTitle className="text-base font-semibold text-slate-800">
                        Pacientes por Nivel de Asistencia
                    </CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-500">
                    Distribución según requerimientos de cuidado
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 0, right: 24, top: 4, bottom: 0 }}
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
                            contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                        />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={28}>
                            {data.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}