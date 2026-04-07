"use client";

import { Search } from "lucide-react";
import FilterCombobox from "@/src/components/ui/filter-combobox";

interface ReservationsFiltersProps {
    search: string;
    statusFilter: string;
    scheduleFilter: string;
    onSearchChange: (v: string) => void;
    onStatusChange: (v: string) => void;
    onScheduleChange: (v: string) => void;
}

const statusOptions = [
    { label: "Todos los estados", value: "all" },
    { label: "Activa", value: "activa" },
    { label: "Pendiente", value: "pendiente" },
    { label: "Finalizada", value: "finalizada" },
    { label: "Cancelada", value: "cancelada" },
];

const scheduleOptions = [
    { label: "Todos los tipos", value: "all" },
    { label: "Full estancia", value: "Full estancia" },
    { label: "Día (8am - 5pm)", value: "Día (8am - 5pm)" },
    { label: "Mañana (8am - 2pm)", value: "Mañana (8am - 2pm)" },
    { label: "Tarde (2pm - 6pm)", value: "Tarde (2pm - 6pm)" },
];

export function ReservationsFilters({
    search, statusFilter, scheduleFilter,
    onSearchChange, onStatusChange, onScheduleChange,
}: ReservationsFiltersProps) {
    return (
        <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.8fr_1fr_1fr]">
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

                <FilterCombobox
                    value={statusFilter}
                    onChange={onStatusChange}
                    options={statusOptions}
                    placeholder="Estado"
                    searchPlaceholder="Buscar estado..."
                    emptyMessage="No encontrado."
                />

                <FilterCombobox
                    value={scheduleFilter}
                    onChange={onScheduleChange}
                    options={scheduleOptions}
                    placeholder="Tipo de estancia"
                    searchPlaceholder="Buscar tipo..."
                    emptyMessage="No encontrado."
                />
            </div>
        </div>
    );
}