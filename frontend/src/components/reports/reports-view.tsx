import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportsSummaryCards } from "@/components/reports/reports-summary-cards";
import { ReportsPatientsByDay } from "@/components/reports/reports-patients-by-day";
import { ReportsOccupancyTrend } from "@/components/reports/reports-occupancy-trend";
import { ReportsRoomsChart } from "@/components/reports/reports-rooms-chart";
import { ReportsMovementChart } from "@/components/reports/reports-movement-chart";
import { ReportsAssistanceChart } from "@/components/reports/reports-assistance-chart";
import { ReportsData } from "@/types/report";

interface ReportsViewProps {
    data: ReportsData;
}

export default function ReportsView({ data }: ReportsViewProps) {
    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Reportes
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Métricas y estadísticas del sistema
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="h-10 shrink-0 rounded-xl border-slate-200 px-4 text-sm"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Reporte
                </Button>
            </div>

            {/* Fila 1: 4 KPIs del enunciado */}
            <ReportsSummaryCards summary={data.summary} />

            {/* Fila 2: Tendencia de ocupación | Estado de habitaciones */}
            <div className="grid gap-6 lg:grid-cols-2">
                <ReportsOccupancyTrend data={data.occupancyTrend} />
                {/* Enunciado a.iv */}
                <ReportsRoomsChart
                    distribution={data.roomStatusDist}
                    summary={data.summary}
                />
            </div>

            {/* Fila 3: Pacientes por día | Pacientes por nivel de asistencia */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Enunciado a.iii */}
                <ReportsPatientsByDay data={data.patientsByDay} />
                <ReportsAssistanceChart data={data.assistanceLevelDist} />
            </div>

            {/* Fila 4: Ingresos y egresos (ancho completo) */}
            <ReportsMovementChart data={data.patientMovement} />
        </section>
    );
}