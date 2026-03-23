"use client";

import { BedDouble, Download, Star } from "lucide-react";

import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { departmentalBreakdownData } from "@/src/data/reports-data";

function getStatusStyles(status: string) {
    switch (status) {
        case "OPTIMAL":
            return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
        case "BUSY":
            return "bg-blue-100 text-blue-700 hover:bg-blue-100";
        default:
            return "";
    }
}

export function DepartmentalBreakdownTable() {
    return (
        <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Departmental Breakdown</CardTitle>
                    <CardDescription>
                        Admissions, average stay and service status
                    </CardDescription>
                </div>

                <Button variant="ghost" className="gap-2 text-blue-600">
                    Export CSV
                    <Download className="h-4 w-4" />
                </Button>
            </CardHeader>

            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] border-separate border-spacing-y-2 text-sm">
                        <thead>
                            <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                                <th className="pb-2">Department</th>
                                <th className="pb-2">Total Admissions</th>
                                <th className="pb-2">Avg. Stay</th>
                                <th className="pb-2">Satisfaction</th>
                                <th className="pb-2">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {departmentalBreakdownData.map((item) => (
                                <tr key={item.department} className="bg-background">
                                    <td className="rounded-l-xl px-3 py-4 font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-muted p-2">
                                                <BedDouble className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                            {item.department}
                                        </div>
                                    </td>

                                    <td className="px-3 py-4">{item.totalAdmissions}</td>
                                    <td className="px-3 py-4">{item.avgStay}</td>

                                    <td className="px-3 py-4">
                                        <div className="flex items-center gap-1 font-medium">
                                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                            {item.satisfaction}
                                        </div>
                                    </td>

                                    <td className="rounded-r-xl px-3 py-4">
                                        <Badge variant="secondary" className={getStatusStyles(item.status)}>
                                            {item.status}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}