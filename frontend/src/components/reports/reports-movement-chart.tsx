"use client";

import { ArrowDownUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer, ChartLegend, ChartLegendContent,
    ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import { PatientMovement } from "@/types/report";

interface ReportsMovementChartProps {
    data: PatientMovement[];
}

const chartConfig = {
    ingresos: { label: "Ingresos", color: "#22c55e" },
    egresos: { label: "Egresos", color: "#ef4444" },
} satisfies ChartConfig;

export function ReportsMovementChart({ data }: ReportsMovementChartProps) {
    return (
        <Card className="rounded-2xl border border-slate-200/60 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <ArrowDownUp className="h-4 w-4 text-slate-500" />
                    <CardTitle className="text-base font-semibold text-slate-800">
                        Ingresos y Egresos de Pacientes
                    </CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-500">
                    Movimiento mensual de pacientes en el asilo
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[240px] w-full">
                    <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tick={{ fontSize: 12, fill: "#94a3b8" }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 12, fill: "#94a3b8" }}
                            allowDecimals={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <Line
                            dataKey="ingresos"
                            type="monotone"
                            stroke="var(--color-ingresos)"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "var(--color-ingresos)", strokeWidth: 0 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            dataKey="egresos"
                            type="monotone"
                            stroke="var(--color-egresos)"
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: "var(--color-egresos)", strokeWidth: 0 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}