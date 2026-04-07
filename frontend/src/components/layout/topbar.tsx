"use client";

import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";

// TODO: Reemplazar con datos reales del contexto de autenticación
const MOCK_USER = {
    name: "Administrador",
    initials: "AD",
    notificationCount: 3,
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
                    {/* Notificaciones */}
                    <button
                        type="button"
                        className="relative flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Notificaciones"
                    >
                        <Bell size={17} strokeWidth={2} />
                        {MOCK_USER.notificationCount > 0 && (
                            <Badge className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white">
                                {MOCK_USER.notificationCount}
                            </Badge>
                        )}
                    </button>

                    {/* Separador visual */}
                    <div className="h-6 w-px bg-slate-200" />

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