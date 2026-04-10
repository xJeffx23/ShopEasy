"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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

const menuItems = [
    { label: "Dashboard", href: "/sistema/dashboard", icon: LayoutDashboard },
    { label: "Empleados", href: "/sistema/employees", icon: Users },
    { label: "Pacientes", href: "/sistema/patients", icon: UserRound },
    { label: "Habitaciones", href: "/sistema/rooms", icon: BedDouble },
    { label: "Reservaciones", href: "/sistema/reservations", icon: CalendarDays },
    { label: "Reportes", href: "/sistema/reports", icon: FileText },
];

const bottomItems = [
    { label: "Configuración", href: "/sistema/settings", icon: Settings },
    { label: "Ayuda", href: "/sistema/help", icon: CircleHelp },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-slate-100 bg-white px-3 py-5">
            {/* Logo */}
            <div className="mb-6 flex items-center gap-2.5 px-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-[13px] font-bold text-white">
                    P
                </div>
                <div>
                    <p className="text-[13px] font-semibold leading-tight text-slate-900">
                        Patitos del Retiro
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400">
                        Gestión clínica
                    </p>
                </div>
            </div>

            {/* Navegación principal */}
            <nav className="flex-1 space-y-0.5">
                {menuItems.map((item, i) => {
                    const Icon = item.icon;
                    // Dashboard: solo activo en ruta exacta. Resto: activo si la ruta empieza con el href.
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
                {/* CTA principal */}
                <Link
                    href="/sistema/reservations/new"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                >
                    <PlusCircle size={15} />
                    Nueva admisión
                </Link>

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