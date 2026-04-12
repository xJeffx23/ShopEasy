export const dynamic = "force-dynamic";
import ReportsView from "@/components/reports/reports-view";
import { getReportsData } from "@/services/reports.service";

export const metadata = {
    title: "Reportes | Patitos del Retiro",
};

export default async function ReportsPage() {
    const data = await getReportsData();
    return <ReportsView data={data} />;
}