import EmployeesView from "@/src/components/employees/employees-view";
import { getEmployeesData } from "@/src/services/employees.service";

export const metadata = {
    title: "Empleados | Patitos del Retiro",
};

export default async function EmployeesPage() {
    const data = await getEmployeesData();
    return <EmployeesView data={data} />;
}