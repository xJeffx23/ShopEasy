"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
    LayoutDashboard,
    Users,
    UserRound,
    BedDouble,
    CalendarDays,
    FileText,
    Settings,
    CircleHelp,
    PlusCircle,
} from "lucide-react";
import { authService } from "@/src/services/auth.service";

// Definición de items del menú con el módulo asociado
const allMenuItems = [
    { label: "Dashboard", href: "/sistema/dashboard", icon: LayoutDashboard, modulo: "dashboard" },
    { label: "Empleados", href: "/sistema/employees", icon: Users, modulo: "employees" },
    { label: "Pacientes", href: "/sistema/patients", icon: UserRound, modulo: "patients" },
    { label: "Habitaciones", href: "/sistema/rooms", icon: BedDouble, modulo: "rooms" },
    { label: "Reservaciones", href: "/sistema/reservations", icon: CalendarDays, modulo: "reservations" },
    { label: "Reportes", href: "/sistema/reports", icon: FileText, modulo: "reports" },
];

const bottomItems = [
    { label: "Configuración", href: "/sistema/settings", icon: Settings },
    { label: "Ayuda", href: "/sistema/help", icon: CircleHelp },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [menuItems, setMenuItems] = React.useState<typeof allMenuItems>([]);
    const [canCreateAdmission, setCanCreateAdmission] = React.useState(false);
    const [userInfo, setUserInfo] = React.useState<{ perfil: string; nombre: string } | null>(null);

    // Filtrar menú según permisos del usuario
    React.useEffect(() => {
        const user = authService.getUser();
        setUserInfo(user);

        // Filtrar los items del menú según los permisos
        const itemsFiltrados = allMenuItems.filter(item =>
            authService.tieneAcceso(item.modulo)
        );
        setMenuItems(itemsFiltrados);

        setCanCreateAdmission(authService.canCreateAdmission());
    }, []);

    return (
        <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-slate-100 bg-white px-3 py-5">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-2.5 px-2">
                <Image
                    src="/LogoPatitos.png"
                    alt="Logo Patitos del Retiro"
                    width={36}
                    height={36}
                    className="shrink-0 rounded-lg"
                />
                <div>
                    <p className="text-[13px] font-semibold leading-tight text-slate-900">
                        Patitos del Retiro
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">
                        Gestión clínica
                    </p>
                </div>
            </div>

            {/* Info del usuario */}
            {userInfo && (
                <div className="mb-4 px-2">
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                        <p className="text-[11px] text-slate-400">Sesión iniciada como</p>
                        <p className="text-[12px] font-medium text-slate-700 truncate">{userInfo.nombre}</p>
                        <p className="text-[10px] text-blue-600 font-medium">{userInfo.perfil}</p>
                    </div>
                </div>
            )}

            {/* Navegación principal */}
            <nav className="flex-1 space-y-0.5">
                {menuItems.map((item, i) => {
                    const Icon = item.icon;
                    const isActive =
                        item.href === "/sistema/dashboard"
                            ? pathname === item.href
                            : pathname.startsWith(item.href);

                    return (
                        <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.18, delay: i * 0.04 }}
                        >
                            <Link
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive
                                    ? "bg-blue-50 font-medium text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <Icon
                                    size={16}
                                    className={isActive ? "text-blue-600" : "text-slate-400"}
                                />
                                <span>{item.label}</span>
                                {isActive && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-500" />
                                )}
                            </Link>
                        </motion.div>
                    );
                })}
            </nav>

            {/* Parte inferior */}
            <div className="mt-4 space-y-3">
                {/* CTA principal - Solo visible para roles autorizados */}
                {canCreateAdmission && (
                    <Link
                        href="/sistema/reservations"
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                    >
                        <PlusCircle size={15} />
                        Nueva admisión
                    </Link>
                )}

                {/* Configuración y ayuda */}
                <div className="space-y-0.5">
                    {bottomItems.map(({ label, href, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
                        >
                            <Icon size={16} className="text-slate-400" />
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </aside>
    );
}
