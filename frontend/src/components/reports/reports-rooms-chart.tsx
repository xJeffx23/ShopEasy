"use client";

import { BedDouble } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/src/components/ui/card";
import { RoomStatusDistribution, ReportSummary } from "@/src/types/report";

interface ReportsRoomsChartProps {
    distribution: RoomStatusDistribution[];
    summary: ReportSummary;
}

export function ReportsRoomsChart({ distribution, summary }: ReportsRoomsChartProps) {
    const occupancyPct = Math.round((summary.reservedRooms / summary.totalRooms) * 100);

    return (
        <Card className="rounded-2xl border border-slate-200/60 shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-teal-500" />
                    <CardTitle className="text-base font-semibold text-slate-800">
                        Estado de Habitaciones
                    </CardTitle>
                </div>
                {/* Enunciado a.iv */}
                <CardDescription className="text-sm text-slate-500">
                    Reservadas: <span className="font-semibold text-slate-700">{summary.reservedRooms}</span>
                    {" "}de{" "}
                    <span className="font-semibold text-slate-700">{summary.totalRooms}</span>
                    {" "}habitaciones totales ({occupancyPct}%)
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center pt-2">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={distribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={88}
                            paddingAngle={2}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {distribution.map((entry, i) => (
                                <Cell key={i} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number, name: string) => [`${value}`, name]}
                            contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", fontSize: "13px" }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                    {distribution.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs text-slate-500">{entry.name}</span>
                            <span className="text-xs font-semibold text-slate-700">{entry.value}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}