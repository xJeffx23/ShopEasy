export const dynamic = "force-dynamic";
import DashboardView from "@/components/dashboard/dashboardView";
import { getDashboardData } from "@/services/dashboard.service";

export const metadata = {
    title: "Dashboard | Patitos del Retiro",
};

export default async function DashboardPage() {
    const data = await getDashboardData();
    return <DashboardView data={data} />;
}