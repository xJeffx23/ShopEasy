"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

interface CapacityTrendProps {
    trend?: {
        occupancyRate?: number;
    };
}

const capacityData = [
    { mes: "Lun", ocupacion: 68 },
    { mes: "Mar", ocupacion: 72 },
    { mes: "Mié", ocupacion: 70 },
    { mes: "Jue", ocupacion: 76 },
    { mes: "Vie", ocupacion: 82 },
    { mes: "Dom", ocupacion: 79 },
];

const chartConfig = {
    ocupacion: {
        label: "Ocupación",
        color: "#2563eb",
    },
} satisfies ChartConfig;

export default function CapacityTrend({ trend }: CapacityTrendProps) {
    const currentOccupancy = trend?.occupancyRate ?? 82;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
            <div className="mb-5">
                <h3 className="text-[18px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Tendencia de capacidad
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                    Evolución reciente de la ocupación del centro.
                </p>
            </div>

            <div className="mb-4">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Ocupación actual</p>
                        <p className="text-[30px] font-semibold leading-none text-gray-900">
                            {currentOccupancy}%
                        </p>
                    </div>

                    <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        Estable
                    </div>
                </div>
            </div>

            <ChartContainer config={chartConfig} className="h-[220px] w-full">
                <AreaChart
                    accessibilityLayer
                    data={capacityData}
                    margin={{
                        left: 4,
                        right: 4,
                        top: 8,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="fillOcupacion" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-ocupacion)" stopOpacity={0.28} />
                            <stop offset="95%" stopColor="var(--color-ocupacion)" stopOpacity={0.04} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} strokeDasharray="3 3" />

                    <XAxis
                        dataKey="mes"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                    />

                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />

                    <Area
                        dataKey="ocupacion"
                        type="monotone"
                        fill="url(#fillOcupacion)"
                        stroke="var(--color-ocupacion)"
                        strokeWidth={2.5}
                        dot={{
                            r: 4,
                            fill: "var(--color-ocupacion)",
                            strokeWidth: 0,
                        }}
                        activeDot={{
                            r: 5,
                            fill: "var(--color-ocupacion)",
                            strokeWidth: 0,
                        }}
                    />
                </AreaChart>
            </ChartContainer>

            <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span>Inicio de semana</span>
                <span>Cierre semanal</span>
            </div>
        </div>
    );
}