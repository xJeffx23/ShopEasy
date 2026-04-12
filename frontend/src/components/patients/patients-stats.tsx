import { PatientStats } from "@/types/patient";

interface PatientsStatsProps {
    stats: PatientStats;
}

export function PatientsStats({ stats }: PatientsStatsProps) {
    const cards = [
        {
            label: "Total Pacientes",
            value: stats.total,
            valueColor: "text-slate-900",
        },
        {
            label: "Asistencia Baja",
            value: stats.lowAssistance,
            valueColor: "text-emerald-600",
        },
        {
            label: "Asistencia Media",
            value: stats.midAssistance,
            valueColor: "text-amber-500",
        },
        {
            label: "Asistencia Alta",
            value: stats.highAssistance,
            valueColor: "text-red-500",
        },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm"
                >
                    <p className={`text-3xl font-bold ${card.valueColor}`}>
                        {card.value}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{card.label}</p>
                </div>
            ))}
        </div>
    );
}