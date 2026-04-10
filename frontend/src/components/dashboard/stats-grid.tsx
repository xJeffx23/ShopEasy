import StatCard from "@/src/components/dashboard/stat-card";
import { DashboardStat } from "@/src/types/dashboard";

interface StatsGridProps {
    stats: DashboardStat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
    // Verificar que stats sea un array antes de mapear
    if (!Array.isArray(stats)) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="text-center text-gray-500 col-span-full">
                    No hay estadísticas disponibles
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
                <StatCard key={stat.id} stat={stat} />
            ))}
        </div>
    );
}