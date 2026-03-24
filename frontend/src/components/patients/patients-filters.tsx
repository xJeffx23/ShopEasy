"use client";

import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";
import FilterCombobox, {
    FilterComboboxOption,
} from "@/src/components/ui/filter-combobox";

interface PatientsFiltersProps {
    assistanceFilter: string;
    departmentFilter: string;
    search: string;
    onAssistanceChange: (value: string) => void;
    onDepartmentChange: (value: string) => void;
    onSearchChange: (value: string) => void;
}

const assistanceOptions: FilterComboboxOption[] = [
    { label: "Nivel de asistencia: Todos", value: "all" },
    { label: "Independiente", value: "Independent" },
    { label: "Asistencia Parcial", value: "Partial Assistance" },
    { label: "Asistencia Completa", value: "Full Assistance" },
];

const departmentOptions: FilterComboboxOption[] = [
    { label: "Departamento: Todos", value: "all" },
    { label: "Cuidado General", value: "General Care" },
    { label: "Soporte Intensivo", value: "Intensive Support" },
    { label: "Rehabilitación", value: "Rehabilitation" },
];

export function PatientsFilters({
    assistanceFilter,
    departmentFilter,
    search,
    onAssistanceChange,
    onDepartmentChange,
    onSearchChange,
}: PatientsFiltersProps) {
    return (
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 md:flex-row">
                <div className="w-full md:max-w-[320px]">
                    <FilterCombobox
                        value={assistanceFilter}
                        onChange={onAssistanceChange}
                        options={assistanceOptions}
                        placeholder="Nivel de asistencia"
                        searchPlaceholder="Buscar nivel..."
                    />
                </div>

                <div className="w-full md:max-w-[320px]">
                    <FilterCombobox
                        value={departmentFilter}
                        onChange={onDepartmentChange}
                        options={departmentOptions}
                        placeholder="Departamento"
                        searchPlaceholder="Buscar departamento..."
                    />
                </div>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar paciente..."
                        className="h-12 rounded-xl pl-10"
                    />
                </div>
            </div>
        </div>
    );
}