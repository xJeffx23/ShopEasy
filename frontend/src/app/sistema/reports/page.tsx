import ReportsView from "@/src/components/reports/reports-view";
import { getReportsData } from "@/src/services/reports.service";

export const metadata = {
    title: "Reportes | Patitos del Retiro",
};

export default async function ReportsPage() {
    const data = await getReportsData();
    return <ReportsView data={data} />;
}