"use client";

import { HeartPulse } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { patientPulseData } from "@/src/data/reports-data";

export function ReportsPatientPulseCard() {
    return (
        <Card className="rounded-2xl">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Patient Pulse</CardTitle>
                    <span className="h-3 w-3 rounded-full bg-emerald-600" />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="rounded-xl border bg-muted/30 p-4">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                            <HeartPulse className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="font-medium">{patientPulseData.title}</p>
                            <p className="text-sm text-muted-foreground">
                                {patientPulseData.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                <Button className="w-full" variant="secondary">
                    VIEW DETAILS
                </Button>
            </CardContent>
        </Card>
    );
}