import { Card, CardContent } from "@/src/components/ui/card";
import { Lightbulb } from "lucide-react";

export function WeeklyTrendCard() {
    return (
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        <Lightbulb className="h-5 w-5 text-slate-500" />
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                            Análisis de Tendencias Semanales
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            La ocupación ha aumentado un 4% en comparación con el mes pasado. Considere la revisión de las próximas vacantes.
                        </p>
                    </div>
                </div>

                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View Analytics
                </button>
            </CardContent>
        </Card>
    );
}