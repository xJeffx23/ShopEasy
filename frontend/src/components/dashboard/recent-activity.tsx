import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ActivityItem } from "@/src/types/dashboard";

interface RecentActivityProps {
    items: ActivityItem[];
}

function getTypeBadge(color: ActivityItem["typeColor"]) {
    switch (color) {
        case "green":
            return "bg-emerald-100 text-emerald-700";
        case "blue":
            return "bg-blue-100 text-blue-700";
        case "amber":
            return "bg-amber-100 text-amber-700";
        default:
            return "bg-slate-100 text-slate-600";
    }
}

export default function RecentActivity({ items }: RecentActivityProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Actividad reciente
                    </h2>
                    <p className="text-sm text-slate-500">
                        Últimos movimientos registrados en el sistema.
                    </p>
                </div>

                <Button variant="ghost" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Ver todo
                </Button>
            </div>

            <Card className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-sm">
                <CardHeader className="border-b border-slate-100 px-6 py-4">
                    <CardTitle className="text-sm font-medium text-slate-700">
                        Resumen de actividad
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                    <div className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                        <span>Paciente / Evento</span>
                        <span>Tipo</span>
                        <span>Habitación</span>
                        <span>Tiempo</span>
                    </div>

                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] items-center border-t border-slate-100 px-6 py-5"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                                    {item.initials}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900 md:text-base">
                                        {item.patientName}
                                    </p>
                                    <p className="truncate text-sm text-slate-500">
                                        {item.eventDescription}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${getTypeBadge(
                                        item.typeColor
                                    )}`}
                                >
                                    {item.type}
                                </span>
                            </div>

                            <div className="text-sm text-slate-600 md:text-base">{item.room}</div>
                            <div className="text-sm text-slate-400">{item.timeAgo}</div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}