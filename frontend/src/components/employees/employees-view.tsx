"use client";

import { useMemo, useState } from "react";

import AddEmployeeDialog from "@/src/components/employees/add-employee-dialog";
import { EditEmployeeDialog } from "@/src/components/employees/edit-employee-dialog";
import EmployeesFilters from "@/src/components/employees/employees-filters";
import EmployeesHeader from "@/src/components/employees/employees-header";
import EmployeesTable from "@/src/components/employees/employees-table";
import { createEmployee, deleteEmployee, updateEmployeeStatus } from "@/src/services/employees.service";
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
    const [editingEmployee, setEditingEmployee] = useState<EmployeeItem | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

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
            const matchProfile = profile === "all" || emp.role === profile;

            return matchSearch && matchDept && matchProfile;
        });
    }, [employees, search, department, profile]);

    // ── Acciones CRUD — preparadas para conectar al backend ──────────────────

    /**
     * Agregar empleado.
     * Backend: POST /api/employees
     */
    async function handleAdd(newEmployee: EmployeeItem) {
        try {
            const createdEmployee = await createEmployee(newEmployee);
            setEmployees((prev) => [createdEmployee, ...prev]);
            console.log("[handleAdd] Empleado creado:", createdEmployee);
        } catch (error) {
            console.error('Error creating employee:', error);
            // TODO: Mostrar mensaje de error al usuario
        }
    }

    /**
     * Editar empleado.
     * Backend: PUT /api/employees/:id
     */
    function handleEdit(employee: EmployeeItem) {
        setEditingEmployee(employee);
        setEditDialogOpen(true);
        console.log("[handleEdit] Empleado a editar:", employee);
    }

    /**
     * Eliminar empleado.
     * Backend: DELETE /api/employees/:id
     */
    async function handleDelete(id: string) {
        try {
            await deleteEmployee(id);
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
            console.log("[handleDelete] Empleado eliminado:", id);
        } catch (error) {
            console.error('Error deleting employee:', error);
            // TODO: Mostrar mensaje de error al usuario
        }
    }

    /**
     * Activar / desactivar empleado.
     * Backend: PATCH /api/employees/:id/status  { status: newStatus }
     */
    async function handleToggleStatus(id: string, newStatus: EmployeeStatus) {
        try {
            const updatedEmployee = await updateEmployeeStatus(id, newStatus);
            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.id === id ? updatedEmployee : emp
                )
            );
            console.log("[handleToggleStatus] Estado actualizado:", id, newStatus);
        } catch (error) {
            console.error('Error updating employee status:', error);
            // TODO: Mostrar mensaje de error al usuario
        }
    }

    /**
     * Manejar actualización de empleado después de editar
     */
    function handleEmployeeUpdated(updatedEmployee: EmployeeItem) {
        setEmployees((prev) =>
            prev.map((emp) =>
                emp.id === updatedEmployee.id ? updatedEmployee : emp
            )
        );
        console.log("[handleEmployeeUpdated] Empleado actualizado en la lista:", updatedEmployee);
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

            <EditEmployeeDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                employee={editingEmployee}
                onEmployeeUpdated={handleEmployeeUpdated}
            />
        </>
    );
}