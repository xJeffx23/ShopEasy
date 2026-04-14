"use client";

import { useState, useEffect } from "react";
import { Search, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { authService } from "@/src/services/auth.service";

export default function Topbar() {
    const [searchValue, setSearchValue] = useState("");
    const [user, setUser] = useState<{ nombre: string; perfil: string } | null>(null);

    useEffect(() => {
        const userData = authService.getUser();
        setUser(userData);
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLogout = () => {
        authService.logout();
    };

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
                <div className="flex items-center gap-4">
                    {/* Perfil */}
                    <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 ring-1 ring-slate-200">
                            <AvatarFallback className="bg-blue-50 text-xs font-semibold text-blue-700">
                                {user ? getInitials(user.nombre) : 'US'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:block">
                            <p className="text-sm font-medium text-slate-700 leading-tight">
                                {user?.nombre || 'Usuario'}
                            </p>
                            <p className="text-xs text-slate-400">
                                {user?.perfil || ''}
                            </p>
                        </div>
                    </div>

                    {/* Botón cerrar sesión */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="Cerrar sesión"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Salir</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
