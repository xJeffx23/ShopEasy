import DashboardView from "@/src/components/dashboard/dashboardView";
import { getDashboardData } from "@/src/services/dashboard.service";

export const metadata = {
    title: "Dashboard | Patitos del Retiro",
};

export default async function DashboardPage() {
    const data = await getDashboardData();
    return <DashboardView data={data} />;
}