"use client";

import { Search } from "lucide-react";
import FilterCombobox from "@/src/components/ui/filter-combobox";

interface EmployeesFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    department: string;
    onDepartmentChange: (value: string) => void;
    profile: string;
    onProfileChange: (value: string) => void;
}

// Departamentos reales del proyecto (enunciado 2.d)
const departmentOptions = [
    { label: "Todos los departamentos", value: "all" },
    { label: "Administrativo", value: "Administrativo" },
    { label: "Gerencia", value: "Gerencia" },
    { label: "DTI", value: "DTI" },
    { label: "Financiero", value: "Financiero" },
];

// Perfiles de acceso reales del proyecto (enunciado 2.e)
const profileOptions = [
    { label: "Todos los perfiles", value: "all" },
    { label: "Gerencia", value: "Gerencia" },
    { label: "Gestión de Pacientes", value: "Gestión de Pacientes" },
    { label: "Mantenimiento", value: "Mantenimiento" },
    { label: "Recepción", value: "Recepción" },
];

export default function EmployeesFilters({
    search,
    onSearchChange,
    department,
    onDepartmentChange,
    profile,
    onProfileChange,
}: EmployeesFiltersProps) {
    return (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.8fr_1fr_1fr]">
                {/* Búsqueda por texto */}
                <div className="relative">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por nombre, correo o departamento..."
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Filtro departamento */}
                <FilterCombobox
                    value={department}
                    onChange={onDepartmentChange}
                    options={departmentOptions}
                    placeholder="Todos los departamentos"
                    searchPlaceholder="Buscar departamento..."
                    emptyMessage="No se encontró ningún departamento."
                />

                {/* Filtro perfil */}
                <FilterCombobox
                    value={profile}
                    onChange={onProfileChange}
                    options={profileOptions}
                    placeholder="Todos los perfiles"
                    searchPlaceholder="Buscar perfil..."
                    emptyMessage="No se encontró ningún perfil."
                />
            </div>
        </div>
    );
}