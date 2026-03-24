"use client";

import { useMemo, useState } from "react";

import AddEmployeeDialog from "@/src/components/employees/add-employee-dialog";
import EmployeeStats from "@/src/components/employees/employee-stats";
import EmployeesFilters from "@/src/components/employees/employees-filters";
import EmployeesHeader from "@/src/components/employees/employees-header";
import EmployeesTable from "@/src/components/employees/employees-table";
import { employeesMock } from "@/src/data/employees.mock";
import type { EmployeeItem } from "@/src/types/employee";

export default function EmployeesView() {
    const data = employeesMock;

    const [employees, setEmployees] = useState<EmployeeItem[]>(data.employees);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const [role, setRole] = useState("all");
    const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

    const filteredEmployees = useMemo(() => {
        return employees.filter((employee) => {
            const normalizedSearch = search.trim().toLowerCase();

            const matchesSearch =
                normalizedSearch.length === 0 ||
                employee.fullName.toLowerCase().includes(normalizedSearch) ||
                employee.email.toLowerCase().includes(normalizedSearch) ||
                employee.department.toLowerCase().includes(normalizedSearch) ||
                employee.role.toLowerCase().includes(normalizedSearch);

            const matchesDepartment =
                department === "all" || employee.department === department;

            const matchesRole = role === "all" || employee.role === role;

            return matchesSearch && matchesDepartment && matchesRole;
        });
    }, [employees, search, department, role]);

    function handleAddEmployee(newEmployee: EmployeeItem) {
        setEmployees((prev) => [newEmployee, ...prev]);
    }

    return (
        <>
            <section className="space-y-6">
                <EmployeesHeader
                    title={data.title}
                    subtitle={data.subtitle}
                    onAddEmployee={() => setIsAddEmployeeOpen(true)}
                />

                <EmployeesFilters
                    search={search}
                    onSearchChange={setSearch}
                    department={department}
                    onDepartmentChange={setDepartment}
                    role={role}
                    onRoleChange={setRole}
                />

                <EmployeesTable employees={filteredEmployees} />

                <EmployeeStats metrics={data.metrics} />
            </section>

            <AddEmployeeDialog
                open={isAddEmployeeOpen}
                onOpenChange={setIsAddEmployeeOpen}
                onSubmit={handleAddEmployee}
                nextEmployeeNumber={employees.length + 1}
            />
        </>
    );
}