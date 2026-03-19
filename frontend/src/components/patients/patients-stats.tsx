import { Card, CardContent } from "@/src/components/ui/card";

interface PatientsStatsProps {
    totalResidents: number;
    capacityPercentage: number;
    highAssistance: number;
    activeTransfers: number;
}

export function PatientsStats({
    totalResidents,
    capacityPercentage,
    highAssistance,
    activeTransfers,
}: PatientsStatsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            Censo Actual
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            {capacityPercentage}% Capacidad
                        </span>
                    </div>

                    <div className="flex items-end gap-2">
                        <span className="text-5xl font-bold text-slate-900">
                            {totalResidents}
                        </span>
                        <span className="pb-1 text-sm text-slate-500">
                            Total de Residentes
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Alta Asistencia
                    </p>

                    <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                        <span className="text-4xl font-bold text-slate-900">
                            {String(highAssistance).padStart(2, "0")}
                        </span>
                        <span className="pt-2 text-sm text-slate-500">Pacientes</span>
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-2xl border border-slate-200 shadow-sm">
                <CardContent className="p-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Traslados Activos
                    </p>

                    <div className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                        <span className="text-4xl font-bold text-slate-900">
                            {String(activeTransfers).padStart(2, "0")}
                        </span>
                        <span className="pt-2 text-sm text-slate-500">Pendientes</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}