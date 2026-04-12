"use client";

import { useMemo, useState } from "react";

import AddEmployeeDialog from "@/components/employees/add-employee-dialog";
import EmployeesFilters from "@/components/employees/employees-filters";
import EmployeesHeader from "@/components/employees/employees-header";
import EmployeesTable from "@/components/employees/employees-table";
import { createEmployee, deleteEmployee, updateEmployeeStatus } from "@/services/employees.service";
import type { EmployeeItem, EmployeesData, EmployeeStatus } from "@/types/employee";

interface EmployeesViewProps {
    data: EmployeesData;
}

function normalize(str: string): string {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export default function EmployeesView({ data }: EmployeesViewProps) {
    const [employees, setEmployees] = useState<EmployeeItem[]>(data.employees);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const [profile, setProfile] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const filtered = useMemo(() => {
        const q = normalize(search.trim());
        return employees.filter((emp) => {
            const matchSearch =
                q.length === 0 ||
                normalize(emp.fullName).includes(q) ||
                normalize(emp.email).includes(q) ||
                normalize(emp.department).includes(q) ||
                normalize(emp.role).includes(q) ||
                normalize(emp.employeeCode).includes(q) ||
                normalize(emp.idNumber).includes(q);

            const matchDept = department === "all" || emp.department === department;
            const matchProfile = profile === "all" || emp.profile === profile;

            return matchSearch && matchDept && matchProfile;
        });
    }, [employees, search, department, profile]);

    async function handleAdd(employeeData: any) {
        setIsLoading(true);
        try {
            const newEmployee = await createEmployee(employeeData);
            setEmployees((prev) => [newEmployee, ...prev]);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error creating employee:", error);
            alert("Error al crear empleado");
        } finally {
            setIsLoading(false);
        }
    }

    function handleEdit(employee: EmployeeItem) {
        console.log("[handleEdit] Empleado a editar:", employee);
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Estás seguro de eliminar este empleado?")) return;

        setIsLoading(true);
        try {
            await deleteEmployee(id);
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        } catch (error) {
            console.error("Error deleting employee:", error);
            alert("Error al eliminar empleado");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleToggleStatus(id: string, newStatus: EmployeeStatus) {
        setIsLoading(true);
        try {
            await updateEmployeeStatus(id, newStatus);
            setEmployees((prev) =>
                prev.map((emp) => emp.id === id ? { ...emp, status: newStatus } : emp)
            );
        } catch (error) {
            console.error("Error updating employee status:", error);
            alert("Error al actualizar estado");
        } finally {
            setIsLoading(false);
        }
    }

    function handleCreateAccess(employeeId: string, username: string, password: string) {
        console.log("[handleCreateAccess]", { employeeId, username, password });
    }

    return (
        <>
            <section className="space-y-6">
                <EmployeesHeader
                    title={data.title}
                    subtitle={data.subtitle}
                    onAddEmployee={() => setIsDialogOpen(true)}
                />

                <EmployeesFilters
                    search={search}
                    onSearchChange={setSearch}
                    department={department}
                    onDepartmentChange={setDepartment}
                    profile={profile}
                    onProfileChange={setProfile}
                />

                <EmployeesTable
                    employees={filtered}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onCreateAccess={handleCreateAccess}
                />
            </section>

            <AddEmployeeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSubmit={handleAdd}
                nextEmployeeNumber={employees.length + 1}
            />
        </>
    );
}