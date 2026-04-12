import { BedDouble, CalendarCheck, CheckCircle2, Wrench, XCircle } from "lucide-react";
import { RoomStats } from "@/types/room";

interface RoomsStatusSummaryProps {
    stats: RoomStats;
}

const items = [
    {
        key: "available" as const,
        label: "Disponibles",
        icon: CheckCircle2,
        iconColor: "text-emerald-600",
        iconBg: "bg-emerald-50",
    },
    {
        key: "reserved" as const,
        label: "Reservadas",
        icon: CalendarCheck,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
    },
    {
        key: "maintenance" as const,
        label: "Mantenimiento",
        icon: Wrench,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50",
    },
    {
        key: "closed" as const,
        label: "Cerradas",
        icon: XCircle,
        iconColor: "text-red-500",
        iconBg: "bg-red-50",
    },
];

export function RoomsStatusSummary({ stats }: RoomsStatusSummaryProps) {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map(({ key, label, icon: Icon, iconColor, iconBg }) => (
                <div
                    key={key}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm"
                >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
                        <Icon className={`h-5 w-5 ${iconColor}`} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-slate-900">{stats[key]}</p>
                        <p className="text-sm text-slate-500">{label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}