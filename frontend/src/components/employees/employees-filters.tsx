"use client";

import FilterCombobox from "@/src/components/ui/filter-combobox";

interface EmployeesFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    department: string;
    onDepartmentChange: (value: string) => void;
    role: string;
    onRoleChange: (value: string) => void;
}

const departmentOptions = [
    { label: "Todos los departamentos", value: "all" },
    { label: "Administrativo", value: "Administrativo" },
    { label: "Gerencia", value: "Gerencia" },
    { label: "DTI", value: "DTI" },
    { label: "Financiero", value: "Financiero" },
];

const roleOptions = [
    { label: "Todos los cargos", value: "all" },
    { label: "Enfermera jefe", value: "Enfermera jefe" },
    { label: "Geriatra", value: "Geriatra" },
    { label: "Recepcionista", value: "Recepcionista" },
    { label: "Técnico líder", value: "Técnico líder" },
    { label: "Asistente", value: "Asistente" },
];

export default function EmployeesFilters({
    search,
    onSearchChange,
    department,
    onDepartmentChange,
    role,
    onRoleChange,
}: EmployeesFiltersProps) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
            <div className="grid grid-cols-[1.8fr_1fr_1fr] gap-4">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Buscar por nombre, correo o departamento..."
                    className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />

                <FilterCombobox
                    value={department}
                    onChange={onDepartmentChange}
                    options={departmentOptions}
                    placeholder="Todos los departamentos"
                    searchPlaceholder="Buscar departamento..."
                    emptyMessage="No se encontró ningún departamento."
                />

                <FilterCombobox
                    value={role}
                    onChange={onRoleChange}
                    options={roleOptions}
                    placeholder="Todos los cargos"
                    searchPlaceholder="Buscar cargo..."
                    emptyMessage="No se encontró ningún cargo."
                />
            </div>
        </div>
    );
}