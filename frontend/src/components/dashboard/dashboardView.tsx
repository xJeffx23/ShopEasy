import CapacityTrend from "@/src/components/dashboard/capacity-trend";
import DashboardHeader from "@/src/components/dashboard/dashboard-header";
import PatientPulse from "@/src/components/dashboard/patient-pulse";
import QuickActions from "@/src/components/dashboard/quick-actions";
import RecentActivity from "@/src/components/dashboard/recent-activity";
import StatsGrid from "@/src/components/dashboard/stats-grid";
import { dashboardMock } from "@/src/data/dashboard.mock";

export default function DashboardView() {
    const data = dashboardMock;

    return (
        <section className="space-y-8">
            <DashboardHeader title={data.title} subtitle={data.subtitle} />

            <StatsGrid stats={data.stats} />

            <div className="grid gap-6 xl:grid-cols-[1.6fr_0.95fr]">
                <RecentActivity items={data.recentActivity} />

                <aside className="space-y-6">
                    <PatientPulse pulse={data.pulse} />
                    <QuickActions actions={data.quickActions} />
                    <CapacityTrend trend={{ occupancyRate: 82 }} />
                </aside>
            </div>
        </section>
    );
}