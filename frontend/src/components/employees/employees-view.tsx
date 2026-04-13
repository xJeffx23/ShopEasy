"use client";

import { useMemo, useState } from "react";

import AddEmployeeDialog from "@/src/components/employees/add-employee-dialog";
import { EditEmployeeDialog } from "@/src/components/employees/edit-employee-dialog";
import EmployeesFilters from "@/src/components/employees/employees-filters";
import EmployeesHeader from "@/src/components/employees/employees-header";
import EmployeesTable from "@/src/components/employees/employees-table";
import { createEmployee, deleteEmployee, updateEmployeeStatus } from "@/src/services/employees.service";
import { AlertCircle, CheckCircle, X } from "lucide-react";
import type { EmployeeItem, EmployeesData, EmployeeStatus } from "@/src/types/employee";

interface EmployeesViewProps {
    data: EmployeesData;
}

interface Notification {
    id: string;
    type: 'success' | 'error';
    message: string;
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
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // ── Funciones de notificación ─────────────────────────────────────────────

    function showNotification(type: 'success' | 'error', message: string) {
        const id = crypto.randomUUID();
        setNotifications(prev => [...prev, { id, type, message }]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 6000);
    }

    function dismissNotification(id: string) {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    function getErrorMessage(error: any): string {
        if (error.response?.data?.message) {
            if (Array.isArray(error.response.data.message)) {
                return error.response.data.message.join(', ');
            }
            return error.response.data.message;
        }
        return error.message || 'Ha ocurrido un error inesperado';
    }

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
            showNotification('success', `Empleado ${createdEmployee.fullName} registrado exitosamente`);
            console.log("[handleAdd] Empleado creado:", createdEmployee);
        } catch (error: any) {
            console.error('Error creating employee:', error);
            showNotification('error', getErrorMessage(error));
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
            const deletedEmployee = employees.find(emp => emp.id === id);
            await deleteEmployee(id);
            setEmployees((prev) => prev.filter((emp) => emp.id !== id));
            showNotification('success', `Empleado ${deletedEmployee?.fullName || ''} eliminado`);
            console.log("[handleDelete] Empleado eliminado:", id);
        } catch (error: any) {
            console.error('Error deleting employee:', error);
            showNotification('error', getErrorMessage(error));
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
            const statusText = newStatus === 'activo' ? 'activado' : 'desactivado';
            showNotification('success', `Empleado ${updatedEmployee.fullName} ${statusText}`);
            console.log("[handleToggleStatus] Estado actualizado:", id, newStatus);
        } catch (error: any) {
            console.error('Error updating employee status:', error);
            showNotification('error', getErrorMessage(error));
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
        showNotification('success', `Empleado ${updatedEmployee.fullName} actualizado exitosamente`);
        console.log("[handleEmployeeUpdated] Empleado actualizado en la lista:", updatedEmployee);
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            {/* Sistema de notificaciones */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border animate-in slide-in-from-right-5 ${notification.type === 'success'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                    >
                        {notification.type === 'success' ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm flex-1">{notification.message}</p>
                        <button
                            onClick={() => dismissNotification(notification.id)}
                            className="shrink-0 p-1 rounded-lg hover:bg-black/5"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

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