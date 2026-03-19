import CapacityTrend from "@/components/dashboard/capacity-trend";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import PatientPulse from "@/components/dashboard/patient-pulse";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";
import StatsGrid from "@/components/dashboard/stats-grid";
import { dashboardMock } from "@/data/dashboard.mock";

export default function DashboardView() {
    const data = dashboardMock;

    return (
        <section className="space-y-8">
            <DashboardHeader title={data.title} subtitle={data.subtitle} />

            <StatsGrid stats={data.stats} />

            <div className="grid grid-cols-[2fr_0.95fr] gap-6">
                <RecentActivity items={data.recentActivity} />

                <div className="space-y-6">
                    <PatientPulse pulse={data.pulse} />
                    <QuickActions actions={data.quickActions} />
                    <CapacityTrend trend={{ occupancyRate: 82 }} />
                </div>
            </div>
        </section>
    );
}