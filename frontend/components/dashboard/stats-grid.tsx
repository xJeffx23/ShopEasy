import { DashboardStat } from "@/types/dashboard";
import StatCard from "@/components/dashboard/stat-card";

interface StatsGridProps {
    stats: DashboardStat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-4 gap-6">
            {stats.map((stat) => (
                <StatCard key={stat.id} stat={stat} />
            ))}
        </div>
    );
}