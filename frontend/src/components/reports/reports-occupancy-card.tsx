"use client";

import { Pie, PieChart, Cell } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ChartContainer } from "@/src/components/ui/chart";
import { roomOccupancyData, roomOccupancyStats } from "@/src/data/reports-data";

export function ReportsOccupancyCard() {
    return (
        <Card className="rounded-2xl">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Room Occupancy</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="relative mx-auto h-[180px] w-[180px]">
                    <ChartContainer
                        config={{
                            occupied: {
                                label: "Occupied",
                                color: "#2563eb",
                            },
                            available: {
                                label: "Available",
                                color: "#dbeafe",
                            },
                        }}
                        className="h-full w-full"
                    >
                        <PieChart>
                            <Pie
                                data={roomOccupancyData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={55}
                                outerRadius={75}
                                strokeWidth={0}
                            >
                                {roomOccupancyData.map((entry) => (
                                    <Cell key={entry.name} fill={entry.fill} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ChartContainer>

                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold">{roomOccupancyStats.percentage}</span>
                    </div>
                </div>

                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                            Occupied
                        </div>
                        <span className="font-medium">{roomOccupancyStats.occupied}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <span className="h-2.5 w-2.5 rounded-full bg-blue-100" />
                            Available
                        </div>
                        <span className="font-medium">{roomOccupancyStats.available}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}