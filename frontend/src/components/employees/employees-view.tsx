"use client";

import { useMemo, useState } from "react";

import AddEmployeeDialog from "@/src/components/employees/add-employee-dialog";
import EmployeesFilters from "@/src/components/employees/employees-filters";
import EmployeesHeader from "@/src/components/employees/employees-header";
import EmployeesTable from "@/src/components/employees/employees-table";
import type { EmployeeItem, EmployeesData, EmployeeStatus } from "@/src/types/employee";

interface EmployeesViewProps {
    data: EmployeesData;
}

/** Elimina tildes y convierte a minúsculas para comparar sin importar acentos */
function normalize(str: string): string {
    return str
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

export default function EmployeesView({ data }: EmployeesViewProps) {
    const [employees, setEmployees] = useState<EmployeeItem[]>(data.employees);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const [profile, setProfile] = useState("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // ── Filtrado ──────────────────────────────────────────────────────────────

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

    // ── Acciones CRUD — preparadas para conectar al backend ──────────────────

    /**
     * Agregar empleado.
     * Backend: POST /api/employees
     */
    function handleAdd(newEmployee: EmployeeItem) {
        setEmployees((prev) => [newEmployee, ...prev]);
    }

    /**
     * Editar empleado.
     * Backend: PUT /api/employees/:id
     * Por ahora abre el mismo dialog de agregar reutilizando los datos.
     * TODO: implementar EditEmployeeDialog cuando el backend esté listo.
     */
    function handleEdit(employee: EmployeeItem) {
        // TODO: abrir dialog de edición con datos precargados
        console.log("[handleEdit] Empleado a editar:", employee);
    }

    /**
     * Eliminar empleado.
     * Backend: DELETE /api/employees/:id
     */
    function handleDelete(id: string) {
        setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        // TODO: await deleteEmployee(id)
    }

    /**
     * Activar / desactivar empleado.
     * Backend: PATCH /api/employees/:id/status  { status: newStatus }
     */
    function handleToggleStatus(id: string, newStatus: EmployeeStatus) {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === id ? { ...emp, status: newStatus } : emp
            )
        );
        // TODO: await updateEmployeeStatus(id, newStatus)
    }

    // ── Render ────────────────────────────────────────────────────────────────

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