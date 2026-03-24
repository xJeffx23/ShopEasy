"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Badge } from "@/src/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/src/components/ui/chart";

interface CapacityTrendProps {
    trend?: {
        occupancyRate?: number;
    };
}

const capacityData = [
    { day: "Lun", occupancy: 68 },
    { day: "Mar", occupancy: 72 },
    { day: "Mié", occupancy: 70 },
    { day: "Jue", occupancy: 76 },
    { day: "Vie", occupancy: 82 },
    { day: "Dom", occupancy: 79 },
];

const chartConfig = {
    occupancy: {
        label: "Ocupación",
        color: "#2563eb",
    },
} satisfies ChartConfig;

export default function CapacityTrend({ trend }: CapacityTrendProps) {
    const currentOccupancy = trend?.occupancyRate ?? 82;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
                <CardHeader className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <CardTitle className="text-base font-semibold text-slate-900">
                                Tendencia de capacidad
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-500">
                                Evolución reciente de la ocupación del centro.
                            </CardDescription>
                        </div>

                        <Badge
                            variant="secondary"
                            className="rounded-full bg-blue-50 text-blue-700 hover:bg-blue-50"
                        >
                            <TrendingUp className="mr-1 h-3.5 w-3.5" />
                            Estable
                        </Badge>
                    </div>

                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Ocupación actual</p>
                            <p className="text-3xl font-semibold tracking-tight text-slate-900">
                                {currentOccupancy}%
                            </p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-0">
                    <ChartContainer config={chartConfig} className="h-[220px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={capacityData}
                            margin={{ left: 4, right: 4, top: 8, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="fillOccupancy" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-occupancy)"
                                        stopOpacity={0.28}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-occupancy)"
                                        stopOpacity={0.04}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid vertical={false} strokeDasharray="3 3" />

                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />

                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />

                            <Area
                                dataKey="occupancy"
                                type="monotone"
                                fill="url(#fillOccupancy)"
                                stroke="var(--color-occupancy)"
                                strokeWidth={2.5}
                                dot={{
                                    r: 4,
                                    fill: "var(--color-occupancy)",
                                    strokeWidth: 0,
                                }}
                                activeDot={{
                                    r: 5,
                                    fill: "var(--color-occupancy)",
                                    strokeWidth: 0,
                                }}
                            />
                        </AreaChart>
                    </ChartContainer>

                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                        <span>Inicio de semana</span>
                        <span>Cierre semanal</span>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}