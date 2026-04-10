import { dashboardIcons } from "@/src/lib/dashboard-icons";
import { Card, CardContent } from "@/src/components/ui/card";
import { DashboardStat, StatAccent } from "@/src/types/dashboard";

interface StatCardProps {
    stat: DashboardStat;
}

function getAccentStyles(accent: StatAccent) {
    switch (accent) {
        case "blue":
            return { icon: "bg-blue-50 text-blue-500", badge: "text-blue-500" };
        case "green":
            return { icon: "bg-teal-50 text-teal-500", badge: "text-teal-500" };
        case "indigo":
            return { icon: "bg-indigo-50 text-indigo-400", badge: "text-indigo-400" };
        case "amber":
            return { icon: "bg-green-50 text-green-500", badge: "text-green-500" };
        default:
            return { icon: "bg-slate-100 text-slate-500", badge: "text-slate-500" };
    }
}

export default function StatCard({ stat }: StatCardProps) {
    const Icon = dashboardIcons[stat.iconName];
    const styles = getAccentStyles(stat.accent);

    return (
        <Card className="rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            <CardContent className="p-6">
                {/* Fila superior: label + icono */}
                <div className="flex items-start justify-between">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${styles.icon}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>

                {/* Valor principal */}
                <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                </p>

                {/* Descripción */}
                <p className="mt-1 text-sm text-slate-500">{stat.description}</p>
            </CardContent>
        </Card>
    );
}