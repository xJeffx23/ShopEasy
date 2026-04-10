import { Card, CardContent } from "@/src/components/ui/card";

interface RoomsOperationalPulseProps {
    occupancyPercentage: number;
    turnoverRateHours: number;
    weeklyCleaningPercentage: number;
}

export function RoomsOperationalPulse({
    occupancyPercentage,
    turnoverRateHours,
    weeklyCleaningPercentage,
}: RoomsOperationalPulseProps) {
    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div>
                    <h3 className="text-3xl font-bold text-slate-900">
                        Pulso Operativo
                    </h3>
                    <p className="mt-3 max-w-lg text-sm text-slate-500">
                        El ala B está alcanzando el 95% de capacidad. Considere redistribuir
                        al personal de limpieza para acelerar la rotación.
                    </p>

                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Tasa de rotación
                            </p>
                            <p className="mt-2 text-3xl font-bold text-blue-600">
                                {turnoverRateHours.toFixed(1)}h
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Limpieza semanal
                            </p>
                            <p className="mt-2 text-3xl font-bold text-emerald-600">
                                {weeklyCleaningPercentage}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mx-auto flex h-48 w-48 flex-col items-center justify-center rounded-3xl border-4 border-blue-100 bg-slate-50 text-center">
                    <p className="text-5xl font-bold text-slate-900">
                        {occupancyPercentage}%
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ocupación total
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}