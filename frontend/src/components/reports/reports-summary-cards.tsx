import {
    BedDouble, CalendarCheck, Users, UserCheck,
    type LucideIcon,
} from "lucide-react";
import { ReportSummary } from "@/types/report";

interface ReportsSummaryCardsProps {
    summary: ReportSummary;
}

interface CardDef {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
}

export function ReportsSummaryCards({ summary }: ReportsSummaryCardsProps) {
    const cards: CardDef[] = [
        {
            // a.i Cantidad de pacientes registrados
            label: "Pacientes Registrados",
            value: String(summary.totalPatients),
            description: "Total en el sistema",
            icon: Users,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
        },
        {
            // a.ii Cantidad de pacientes alojados
            label: "Pacientes Alojados",
            value: String(summary.hostedPatients),
            description: "Actualmente en el asilo",
            icon: UserCheck,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
        {
            // a.iv Habitaciones reservadas vs totales
            label: "Habitaciones Reservadas",
            value: `${summary.reservedRooms}/${summary.totalRooms}`,
            description: `${Math.round((summary.reservedRooms / summary.totalRooms) * 100)}% de ocupación`,
            icon: BedDouble,
            iconBg: "bg-amber-50",
            iconColor: "text-amber-600",
        },
        {
            label: "Reservaciones Activas",
            value: String(summary.activeReservations),
            description: "Estancias en curso",
            icon: CalendarCheck,
            iconBg: "bg-violet-50",
            iconColor: "text-violet-600",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.label}
                        className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg}`}>
                                <Icon className={`h-4 w-4 ${card.iconColor}`} />
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">{card.label}</p>
                        <p className="mt-1 text-2xl font-bold text-slate-900">{card.value}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{card.description}</p>
                    </div>
                );
            })}
        </div>
    );
}