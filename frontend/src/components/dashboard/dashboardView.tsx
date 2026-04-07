import DashboardHeader from "@/src/components/dashboard/dashboard-header";
import StatsGrid from "@/src/components/dashboard/stats-grid";
import CapacityTrend from "@/src/components/dashboard/capacity-trend";
import RoomStatusChart from "@/src/components/dashboard/room-status-chart";
import CareLevelChart from "@/src/components/dashboard/care-level-chart";
import QuickSummary from "@/src/components/dashboard/quick-summary";
import RecentActivity from "@/src/components/dashboard/recent-activity";
import { DashboardData } from "@/src/types/dashboard";

interface DashboardViewProps {
    data: DashboardData;
}

export default function DashboardView({ data }: DashboardViewProps) {
    return (
        <section className="space-y-6">
            {/* Título */}
            <DashboardHeader title={data.title} subtitle={data.subtitle} />

            {/* Fila 1: 4 stat cards */}
            <StatsGrid stats={data.stats} />

            {/* Fila 2: Tendencia | Estado de habitaciones */}
            <div className="grid gap-6 lg:grid-cols-2">
                <CapacityTrend
                    occupancyRate={data.trend.occupancyRate}
                    weeklyData={data.trend.weeklyData}
                />
                <RoomStatusChart data={data.roomStatus} />
            </div>

            {/* Fila 3: Niveles de asistencia | Resumen rápido */}
            <div className="grid gap-6 lg:grid-cols-2">
                <CareLevelChart data={data.careLevels} />
                <QuickSummary data={data.quickSummary} />
            </div>

            {/* Fila 4: Actividad reciente (ancho completo) */}
            <RecentActivity items={data.recentActivity} />
        </section>
    );
}