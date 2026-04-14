"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    CalendarDays, 
    History, 
    LogOut, 
    User,
    Heart
} from "lucide-react";
import { authService } from "@/src/services/auth.service";

const menuItems = [
    { label: "Inicio", href: "/paciente/dashboard", icon: LayoutDashboard },
    { label: "Nueva Reservación", href: "/paciente/nueva-reservacion", icon: CalendarDays },
    { label: "Mi Historial", href: "/paciente/historial", icon: History },
];

export default function PacienteLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const token = authService.getToken();
        if (!token) {
            window.location.href = '/auth/login-paciente';
            return;
        }

        const userType = localStorage.getItem('userType');
        const user = authService.getUser();

        if (userType !== 'paciente' && user?.perfil !== 'paciente') {
            window.location.href = '/auth/login-paciente';
            return;
        }

        setUserName(user?.nombre || 'Paciente');
        setIsAuthorized(true);
        setIsLoading(false);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        window.location.href = '/auth/login-paciente';
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-slate-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 to-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                                P
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Patitos del Retiro</p>
                                <p className="text-xs text-slate-500">Portal de Pacientes</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                                    <User className="h-4 w-4 text-teal-600" />
                                </div>
                                <span className="text-slate-700 font-medium hidden sm:block">{userName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:block">Salir</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-1 overflow-x-auto py-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                                        isActive ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-50"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Main content - flex-1 para que ocupe el espacio disponible */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Footer - siempre al fondo */}
            <footer className="bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Heart className="h-4 w-4 text-red-400" />
                            <span>Patitos del Retiro - Cuidamos de ti</span>
                        </div>
                        <p className="text-xs text-slate-400">© 2026 Todos los derechos reservados</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
