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
    }
}

export default function StatCard({ stat }: StatCardProps) {
    const Icon = stat.icon;
    const styles = getAccentStyles(stat.accent);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
            <div className="flex items-start justify-between">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles.iconWrap}`}
                >
                    <Icon size={18} />
                </div>

                <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide ${styles.badge}`}
                >
                    {stat.badge}
                </span>
            </div>

            <div className="mt-6">
                <p className="text-[13px] text-gray-500">{stat.label}</p>
                <p className="mt-2 text-[26px] font-semibold leading-none text-gray-900">
                    {stat.value}
                </p>
                <p className="mt-3 text-[16px] text-gray-600">{stat.description}</p>
            </div>
        </div>
    );
}