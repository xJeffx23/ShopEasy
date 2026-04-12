"use client";

import { Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig,
} from "@/components/ui/chart";
import { PatientsByDay } from "@/types/report";

interface ReportsPatientsByDayProps {
    data: PatientsByDay[];
}

const chartConfig = {
    patients: { label: "Pacientes", color: "#3b82f6" },
} satisfies ChartConfig;

export function ReportsPatientsByDay({ data }: ReportsPatientsByDayProps) {
    return (
        <Card className="rounded-2xl border border-slate-200/60 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-base font-semibold text-slate-800">
                        Pacientes por Día
                    </CardTitle>
                </div>
                {/* Enunciado a.iii */}
                <CardDescription className="text-sm text-slate-500">
                    Cantidad de pacientes alojados en las instalaciones por día
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[240px] w-full">
                    <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                            dataKey="day"
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
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                            dataKey="patients"
                            fill="var(--color-patients)"
                            radius={[6, 6, 0, 0]}
                            barSize={28}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}