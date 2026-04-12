"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";

// TODO: Reemplazar con datos reales del contexto de autenticación
const MOCK_USER = {
    name: "Administrador",
    initials: "AD",
};

export default function Topbar() {
    const [searchValue, setSearchValue] = useState("");

    return (
        <header className="shrink-0 border-b border-slate-100 bg-white px-6 py-3">
            <div className="flex items-center justify-between gap-4">
                {/* Búsqueda global */}
                <div className="relative w-[280px]">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="text"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Buscar pacientes, habitaciones..."
                        className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                </div>

                {/* Acciones derecha */}
                <div className="flex items-center gap-3">
                    {/* Perfil */}
                    <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 ring-1 ring-slate-200">
                            <AvatarFallback className="bg-blue-50 text-xs font-semibold text-blue-700">
                                {MOCK_USER.initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-slate-700">
                            {MOCK_USER.name}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}