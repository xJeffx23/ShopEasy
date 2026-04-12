import StatCard from "@/components/dashboard/stat-card";
import { DashboardStat } from "@/types/dashboard";

interface StatsGridProps {
    stats: DashboardStat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <StatCard key={stat.id} stat={stat} />
            ))}
        </div>
    );
}