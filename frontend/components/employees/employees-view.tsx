"use client";

import { useMemo, useState } from "react";
import EmployeeStats from "@/components/employees/employee-stats";
import EmployeesFilters from "@/components/employees/employees-filters";
import EmployeesHeader from "@/components/employees/employees-header";
import EmployeesTable from "@/components/employees/employees-table";
import { employeesMock } from "@/data/employees.mock";

export default function EmployeesView() {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const [role, setRole] = useState("all");

    const data = employeesMock;

    const filteredEmployees = useMemo(() => {
        return data.employees.filter((employee) => {
            const matchesSearch =
                employee.fullName.toLowerCase().includes(search.toLowerCase()) ||
                employee.email.toLowerCase().includes(search.toLowerCase()) ||
                employee.department.toLowerCase().includes(search.toLowerCase());

            const matchesDepartment =
                department === "all" || employee.department === department;

            const matchesRole = role === "all" || employee.role === role;

            return matchesSearch && matchesDepartment && matchesRole;
        });
    }, [data.employees, search, department, role]);

    return (
        <section className="space-y-6">
            <EmployeesHeader title={data.title} subtitle={data.subtitle} />

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
    );
}