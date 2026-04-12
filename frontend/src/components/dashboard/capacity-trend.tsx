"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { CapacityDataPoint } from "@/types/dashboard";

interface CapacityTrendProps {
    occupancyRate?: number;
    weeklyData?: CapacityDataPoint[];
}

const FALLBACK_DATA: CapacityDataPoint[] = [
    { day: "Ene", occupancy: 75 },
    { day: "Feb", occupancy: 78 },
    { day: "Mar", occupancy: 82 },
    { day: "Abr", occupancy: 80 },
    { day: "May", occupancy: 79 },
    { day: "Jun", occupancy: 85 },
];

const chartConfig = {
    occupancy: {
        label: "Ocupación",
        color: "#eab308",
    },
} satisfies ChartConfig;

export default function CapacityTrend({
    occupancyRate = 82,
    weeklyData = FALLBACK_DATA,
}: CapacityTrendProps) {
    return (
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-amber-500" />
                    <CardTitle className="text-base font-semibold text-slate-800">
                        Tendencia de Ocupación
                    </CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-500">
                    Porcentaje de ocupación en los últimos 6 meses
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="h-[260px] w-full">
                    <AreaChart
                        accessibilityLayer
                        data={weeklyData}
                        margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="fillOccupancy" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#eab308" stopOpacity={0.35} />
                                <stop offset="95%" stopColor="#eab308" stopOpacity={0.04} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />

                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            tick={{ fontSize: 12, fill: "#94a3b8" }}
                        />

                        <YAxis
                            domain={[0, 100]}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 12, fill: "#94a3b8" }}
                            ticks={[0, 25, 50, 75, 100]}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dot" />}
                        />

                        <Area
                            dataKey="occupancy"
                            type="monotone"
                            fill="url(#fillOccupancy)"
                            stroke="#eab308"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}