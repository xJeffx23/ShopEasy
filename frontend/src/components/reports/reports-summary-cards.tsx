"use client";

import { Activity, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui/card";
import { reportSummaryCards } from "@/src/data/reports-data";

function getCardIcon(type: string) {
    switch (type) {
        case "patients":
            return (
                <div className="rounded-xl bg-blue-50 p-2 text-blue-600">
                    <Users className="h-5 w-5" />
                </div>
            );
        case "active":
            return (
                <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                </div>
            );
        default:
            return (
                <div className="rounded-xl bg-muted p-2 text-muted-foreground">
                    <Activity className="h-5 w-5" />
                </div>
            );
    }
}

function getTrendColor(type: string) {
    if (type === "patients") return "text-emerald-600";
    if (type === "active") return "text-emerald-600";
    return "text-muted-foreground";
}

export function ReportsSummaryCards() {
    return (
        <>
            {reportSummaryCards.map((card) => (
                <Card key={card.title} className="rounded-2xl">
                    <CardContent className="p-5">
                        <div className="mb-4 flex items-start justify-between">
                            {getCardIcon(card.type)}
                            <span className={`text-sm font-medium ${getTrendColor(card.type)}`}>
                                {card.trend}
                            </span>
                        </div>

                        <p className="text-sm text-muted-foreground">{card.title}</p>
                        <h3 className="text-3xl font-bold">{card.value}</h3>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}