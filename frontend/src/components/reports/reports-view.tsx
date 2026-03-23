"use client";

import { Button } from "@/src/components/ui/button";
import { ReportsSummaryCards } from "@/src/components/reports/reports-summary-cards";
import { ReportsOccupancyCard } from "@/src/components/reports/reports-occupancy-card";
import { ReportsPatientPulseCard } from "@/src/components/reports/reports-patient-pulse-card";
import { ReportsPatientsChart } from "@/src/components/reports/reports-patients-chart";
import { DepartmentalBreakdownTable } from "@/src/components/reports/departmental-breakdown-table";

export function ReportsView() {
    return (
        <main className="space-y-6 p-6">
            <section className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports Dashboard</h1>
                    <p className="text-muted-foreground">
                        Performance overview and clinical capacity metrics.
                    </p>
                </div>

                <div className="flex w-fit flex-wrap items-center gap-2 rounded-xl border bg-card p-1">
                    <Button variant="secondary" size="sm">
                        Last 30 Days
                    </Button>
                    <Button variant="ghost" size="sm">
                        Quarterly
                    </Button>
                    <Button variant="ghost" size="sm">
                        Custom Range
                    </Button>
                </div>
            </section>

            <section className="grid gap-4 xl:grid-cols-12">
                <div className="grid gap-4 sm:grid-cols-2 xl:col-span-5">
                    <ReportsSummaryCards />
                    <ReportsOccupancyCard />
                    <ReportsPatientPulseCard />
                </div>

                <div className="xl:col-span-7">
                    <ReportsPatientsChart />
                </div>
            </section>

            <section>
                <DepartmentalBreakdownTable />
            </section>
        </main>
    );
}