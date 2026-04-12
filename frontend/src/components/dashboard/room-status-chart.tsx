"use client";

import { BedDouble } from "lucide-react";
import { Cell, Pie, PieChart, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RoomStatusData } from "@/types/dashboard";

interface RoomStatusChartProps {
    data?: RoomStatusData[];
}

const FALLBACK_DATA: RoomStatusData[] = [
    { name: "Ocupadas", value: 5, color: "#eab308" },
    { name: "Disponibles", value: 3, color: "#38bdf8" },
    { name: "Mantenimiento", value: 2, color: "#92400e" },
    { name: "Cerradas", value: 1, color: "#22c55e" },
];

export default function RoomStatusChart({ data = FALLBACK_DATA }: RoomStatusChartProps) {
    return (
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-teal-500" />
                    <CardTitle className="text-base font-semibold text-slate-800">
                        Estado de Habitaciones
                    </CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-500">
                    Distribución por estado actual
                </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col items-center pt-2">
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={68}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            strokeWidth={0}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value: number, name: string) => [`${value}`, name]}
                            contentStyle={{
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                fontSize: "13px",
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Leyenda manual igual al v0 */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                    {data.map((entry) => (
                        <div key={entry.name} className="flex items-center gap-1.5">
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs text-slate-500">{entry.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}