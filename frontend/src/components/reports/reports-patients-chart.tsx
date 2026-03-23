"use client";

import { Ellipsis } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Button } from "@/src/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/src/components/ui/chart";
import { patientsPerDayData } from "@/src/data/reports-data";

const chartConfig = {
    patients: {
        label: "Patients",
        color: "#3b82f6",
    },
} satisfies ChartConfig;

export function ReportsPatientsChart() {
    return (
        <Card className="h-full rounded-2xl">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div>
                    <CardTitle>Patients per Day</CardTitle>
                    <CardDescription>Weekly admission distribution</CardDescription>
                </div>

                <Button variant="ghost" size="icon">
                    <Ellipsis className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig} className="h-[360px] w-full">
                    <BarChart data={patientsPerDayData} accessibilityLayer>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar
                            dataKey="patients"
                            fill="var(--color-patients)"
                            radius={[8, 8, 0, 0]}
                            barSize={30}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}