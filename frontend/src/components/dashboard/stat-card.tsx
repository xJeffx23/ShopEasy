import { dashboardIcons } from "@/src/lib/dashboard-icons";
import { Card, CardContent } from "@/src/components/ui/card";
import { DashboardStat, StatAccent } from "@/src/types/dashboard";

interface StatCardProps {
    stat: DashboardStat;
}

function getAccentStyles(accent: StatAccent) {
    switch (accent) {
        case "blue":
            return {
                iconWrap: "bg-blue-50 text-blue-600",
                badge: "bg-blue-100 text-blue-600",
            };
        case "green":
            return {
                iconWrap: "bg-emerald-50 text-emerald-600",
                badge: "bg-emerald-100 text-emerald-600",
            };
        case "indigo":
            return {
                iconWrap: "bg-indigo-50 text-indigo-600",
                badge: "bg-indigo-100 text-indigo-600",
            };
        case "amber":
            return {
                iconWrap: "bg-amber-50 text-amber-700",
                badge: "bg-amber-100 text-amber-700",
            };
        default:
            return {
                iconWrap: "bg-slate-100 text-slate-600",
                badge: "bg-slate-100 text-slate-600",
            };
    }
}

export default function StatCard({ stat }: StatCardProps) {
    const Icon = dashboardIcons[stat.iconName];
    const styles = getAccentStyles(stat.accent);

    return (
        <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.iconWrap}`}
                    >
                        <Icon className="h-4 w-4" />
                    </div>

                    <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${styles.badge}`}
                    >
                        {stat.badge}
                    </span>
                </div>

                <div className="mt-5 space-y-2">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="text-2xl font-semibold tracking-tight text-slate-900">
                        {stat.value}
                    </p>
                    <p className="text-sm text-slate-600">{stat.description}</p>
                </div>
            </CardContent>
        </Card>
    );
}