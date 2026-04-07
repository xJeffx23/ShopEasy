import { BedDouble, Activity, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { QuickSummaryData } from "@/src/types/dashboard";

interface QuickSummaryProps {
    data?: QuickSummaryData;
}

const FALLBACK: QuickSummaryData = {
    occupancyRate: 50,
    roomsInMaintenance: 2,
    staffPerPatient: 1.2,
};

export default function QuickSummary({ data = FALLBACK }: QuickSummaryProps) {
    const items = [
        {
            label: "Tasa de Ocupación",
            value: `${data.occupancyRate}%`,
            icon: BedDouble,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
        },
        {
            label: "Habitaciones en Mantenimiento",
            value: data.roomsInMaintenance,
            icon: Activity,
            iconBg: "bg-slate-100",
            iconColor: "text-slate-500",
        },
        {
            label: "Personal por Paciente",
            value: data.staffPerPatient,
            icon: Users,
            iconBg: "bg-sky-50",
            iconColor: "text-sky-500",
        },
    ];

    return (
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-800">
                    Resumen Rápido
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                    Indicadores clave del sistema
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.label}
                            className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                        >
                            <div>
                                <p className="text-sm text-slate-500">{item.label}</p>
                                <p className="mt-0.5 text-xl font-bold text-slate-900">
                                    {item.value}
                                </p>
                            </div>
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconBg}`}>
                                <Icon className={`h-5 w-5 ${item.iconColor}`} />
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}