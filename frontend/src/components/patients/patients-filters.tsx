"use client";

import { Search } from "lucide-react";
import FilterCombobox from "@/components/ui/filter-combobox";

interface PatientsFiltersProps {
    search: string;
    assistanceFilter: string;
    statusFilter: string;
    onSearchChange: (v: string) => void;
    onAssistanceChange: (v: string) => void;
    onStatusChange: (v: string) => void;
}

const assistanceOptions = [
    { label: "Todos los niveles", value: "all" },
    { label: "Asistencia básica", value: "Asistencia básica" },
    { label: "Asistencia para movilidad", value: "Asistencia para movilidad" },
    { label: "Asistencia para alimentación", value: "Asistencia para alimentación" },
    { label: "Asistencia para baño", value: "Asistencia para baño" },
    { label: "Asistencia completa", value: "Asistencia completa" },
];

const statusOptions = [
    { label: "Todos los estados", value: "all" },
    { label: "Activo", value: "activo" },
    { label: "Inactivo", value: "inactivo" },
];

export function PatientsFilters({
    search,
    assistanceFilter,
    statusFilter,
    onSearchChange,
    onAssistanceChange,
    onStatusChange,
}: PatientsFiltersProps) {
    return (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.8fr_1fr_1fr]">
                {/* Búsqueda */}
                <div className="relative">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Buscar por nombre o habitación..."
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Nivel de asistencia */}
                <FilterCombobox
                    value={assistanceFilter}
                    onChange={onAssistanceChange}
                    options={assistanceOptions}
                    placeholder="Nivel de asistencia"
                    searchPlaceholder="Buscar nivel..."
                    emptyMessage="No encontrado."
                />

                {/* Estado */}
                <FilterCombobox
                    value={statusFilter}
                    onChange={onStatusChange}
                    options={statusOptions}
                    placeholder="Estado"
                    searchPlaceholder="Buscar estado..."
                    emptyMessage="No encontrado."
                />
            </div>
        </div>
    );
}