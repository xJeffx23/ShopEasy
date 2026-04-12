export const dynamic = "force-dynamic";
import EmployeesView from "@/components/employees/employees-view";
import { getEmployeesData } from "@/services/employees.service";

export const metadata = {
    title: "Empleados | Patitos del Retiro",
};

export default async function EmployeesPage() {
    const data = await getEmployeesData();
    return <EmployeesView data={data} />;
}