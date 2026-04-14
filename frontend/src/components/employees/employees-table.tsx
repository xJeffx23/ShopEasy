"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { MoreHorizontal, Pencil, Trash2, Eye, ExternalLink, UserX, UserCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import {
    EmployeeItem,
    EmployeeStatus,
    EmployeeDepartment,
    EmployeeProfile,
} from "@/src/types/employee";

// ─── Props ────────────────────────────────────────────────────────────────────

interface EmployeesTableProps {
    employees: EmployeeItem[];
    onEdit?: (employee: EmployeeItem) => void;
    onDelete?: (id: string) => void;
    onToggleStatus?: (id: string, newStatus: EmployeeStatus) => void;
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function getDepartmentBadge(department: EmployeeDepartment) {
    switch (department) {
        case "Gerencia": return "bg-violet-100 text-violet-700";
        case "Administrativo": return "bg-blue-100 text-blue-700";
        case "DTI": return "bg-teal-100 text-teal-700";
        case "Financiero": return "bg-amber-100 text-amber-700";
        default: return "bg-slate-100 text-slate-600";
    }
}

function getProfileBadge(profile: EmployeeProfile) {
    switch (profile) {
        case "Gerencia": return "bg-violet-50 text-violet-700 border border-violet-200";
        case "Gestión de pacientes": return "bg-blue-50 text-blue-700 border border-blue-200";
        case "Mantenimiento": return "bg-amber-50 text-amber-700 border border-amber-200";
        case "Recepción": return "bg-teal-50 text-teal-700 border border-teal-200";
        default: return "bg-slate-50 text-slate-600 border border-slate-200";
    }
}

function getStatusBadge(status: EmployeeStatus) {
    switch (status) {
        case "activo": return "bg-emerald-100 text-emerald-700";
        case "de permiso": return "bg-blue-100 text-blue-700";
        case "en capacitación": return "bg-amber-100 text-amber-700";
        case "inactivo": return "bg-slate-100 text-slate-500";
    }
}

function getStatusLabel(status: EmployeeStatus) {
    switch (status) {
        case "activo": return "Activo";
        case "de permiso": return "De permiso";
        case "en capacitación": return "Capacitación";
        case "inactivo": return "Inactivo";
    }
}

// ─── Menú de acciones por fila ────────────────────────────────────────────────

interface RowActionsProps {
    employee: EmployeeItem;
    onEdit?: (employee: EmployeeItem) => void;
    onDelete?: (id: string) => void;
    onToggleStatus?: (id: string, newStatus: EmployeeStatus) => void;
}

function RowActions({ employee, onEdit, onDelete, onToggleStatus }: RowActionsProps) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    const isActive = employee.status === "activo";
    const nextStatus: EmployeeStatus = isActive ? "inactivo" : "activo";

    const openEmployeePortal = () => {
        // Abrir el portal de empleados en una nueva pestaña
        window.open('/auth/login', '_blank');
    };

    return (
        <>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none"
                        aria-label="Acciones"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        align="end"
                        sideOffset={4}
                        className="z-[9999] min-w-[200px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
                    >
                        {/* Editar */}
                        <DropdownMenu.Item
                            onSelect={() => onEdit?.(employee)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100 focus:bg-slate-100"
                        >
                            <Pencil className="h-3.5 w-3.5 text-slate-400" />
                            Editar información
                        </DropdownMenu.Item>

                        {/* Ver portal */}
                        <DropdownMenu.Item
                            onSelect={openEmployeePortal}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-blue-700 outline-none hover:bg-blue-50"
                        >
                            <ExternalLink className="h-3.5 w-3.5 text-blue-500" />
                            Ver portal de empleado
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />

                        {/* Toggle status */}
                        <DropdownMenu.Item
                            onSelect={() => onToggleStatus?.(employee.id, nextStatus)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none hover:bg-slate-100"
                        >
                            {isActive
                                ? <UserX className="h-3.5 w-3.5 text-amber-500" />
                                : <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                            }
                            {isActive ? "Desactivar empleado" : "Activar empleado"}
                        </DropdownMenu.Item>

                        {/* Eliminar */}
                        <DropdownMenu.Item
                            onSelect={() => setConfirmOpen(true)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 outline-none hover:bg-red-50 focus:bg-red-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar empleado
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Dialog de confirmación de eliminación */}
            <AlertDialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialog.Portal>
                    <AlertDialog.Overlay className="fixed inset-0 z-[9998] bg-black/40 animate-in fade-in-0" />
                    <AlertDialog.Content className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
                        {/* Icono */}
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                            <Trash2 className="h-5 w-5 text-red-500" />
                        </div>

                        <AlertDialog.Title className="text-center text-base font-semibold text-slate-900">
                            Eliminar empleado
                        </AlertDialog.Title>

                        <AlertDialog.Description className="mt-2 text-center text-sm text-slate-500">
                            ¿Estás seguro de que deseas eliminar a{" "}
                            <span className="font-medium text-slate-700">{employee.fullName}</span>?
                            Esta acción no se puede deshacer.
                        </AlertDialog.Description>

                        <div className="mt-6 flex gap-3">
                            <AlertDialog.Cancel asChild>
                                <button className="h-10 flex-1 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                                    Cancelar
                                </button>
                            </AlertDialog.Cancel>

                            <AlertDialog.Action asChild>
                                <button
                                    onClick={() => onDelete?.(employee.id)}
                                    className="h-10 flex-1 rounded-xl bg-red-600 text-sm font-medium text-white transition hover:bg-red-700 active:scale-[0.98]"
                                >
                                    Sí, eliminar
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </AlertDialog.Portal>
            </AlertDialog.Root>
        </>
    );
}

// ─── Tabla principal ──────────────────────────────────────────────────────────

export default function EmployeesTable({
    employees,
    onEdit,
    onDelete,
    onToggleStatus,
}: EmployeesTableProps) {
    if (employees.length === 0) {
        return (
            <div className="flex items-center justify-center rounded-2xl border border-slate-200/60 bg-white py-16 shadow-sm">
                <p className="text-sm text-slate-400">
                    No se encontraron empleados con los filtros aplicados.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
            {/* Cabecera */}
            <div className="grid grid-cols-[2.2fr_1.1fr_0.9fr_1.1fr_1.2fr_1fr_40px] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                <span>Nombre</span>
                <span>Código</span>
                <span>Ingreso</span>
                <span>Departamento</span>
                <span>Perfil de acceso</span>
                <span>Estado</span>
                <span />
            </div>

            {/* Filas */}
            {employees.map((employee) => (
                <div
                    key={employee.id}
                    className="grid grid-cols-[2.2fr_1.1fr_0.9fr_1.1fr_1.2fr_1fr_40px] items-center border-t border-slate-100 px-6 py-4 transition-colors hover:bg-slate-50/50"
                >
                    {/* Nombre + email */}
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />
                            <AvatarFallback className="bg-blue-50 text-sm font-semibold text-blue-600">
                                {employee.initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {employee.fullName}
                            </p>
                            <p className="truncate text-xs text-slate-500">{employee.email}</p>
                        </div>
                    </div>

                    {/* Código */}
                    <div className="text-sm font-medium text-slate-500">
                        {employee.employeeCode}
                    </div>

                    {/* Ingreso */}
                    <div className="text-sm text-slate-500">{employee.hireDate}</div>

                    {/* Departamento */}
                    <div>
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getDepartmentBadge(employee.department)}`}>
                            {employee.department}
                        </span>
                    </div>

                    {/* Perfil */}
                    <div>
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getProfileBadge(employee.profile)}`}>
                            {employee.profile}
                        </span>
                    </div>

                    {/* Estado */}
                    <div>
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(employee.status)}`}>
                            {getStatusLabel(employee.status)}
                        </span>
                    </div>

                    {/* Acciones */}
                    <div className="flex justify-end">
                        <RowActions
                            employee={employee}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleStatus={onToggleStatus}
                        />
                    </div>
                </div>
            ))}

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
                <p className="text-xs text-slate-400">
                    Mostrando {employees.length} empleado{employees.length !== 1 ? "s" : ""}
                </p>
            </div>
        </div>
    );
}
