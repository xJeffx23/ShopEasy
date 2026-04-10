import { CalendarCheck, CalendarClock, CalendarDays } from "lucide-react";
import { ReservationStats } from "@/src/types/reservation";

interface ReservationsStatsProps {
    stats: ReservationStats;
}

export function ReservationsStats({ stats }: ReservationsStatsProps) {
    const cards = [
        {
            label: "Reservaciones Activas",
            value: stats.active,
            icon: CalendarCheck,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-500",
        },
        {
            label: "Estancias Permanentes",
            value: stats.permanent,
            icon: CalendarDays,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-500",
        },
        {
            label: "Estancias de Respiro",
            value: stats.respite,
            icon: CalendarClock,
            iconBg: "bg-slate-100",
            iconColor: "text-slate-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {cards.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
                <div
                    key={label}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm"
                >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{value}</p>
                        <p className="text-sm text-slate-500">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}