"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    UserRound,
    BedDouble,
    CalendarDays,
    FileText,
    Settings,
    CircleHelp,
} from "lucide-react";

const menuItems = [
    { label: "Dashboard", href: "/sistema/dashboard", icon: LayoutDashboard },
    { label: "Empleados", href: "/sistema/employees", icon: Users },
    { label: "Pacientes", href: "/sistema/patients", icon: UserRound },
    { label: "Habitaciones", href: "/sistema/rooms", icon: BedDouble },
    { label: "Reservaciones", href: "/sistema/reservations", icon: CalendarDays },
    { label: "Reportes", href: "/sistema/reports", icon: FileText },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-[220px] shrink-0 flex-col border-r border-gray-200 bg-white px-3 py-4">
            <div>
                <div className="mb-6 px-2">
                    <h1 className="text-[15px] font-semibold text-gray-900">
                        Patitos del Retiro
                    </h1>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-gray-400">
                        Clinical Management
                    </p>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive
                                        ? "bg-blue-50 font-medium text-blue-600"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                    }`}
                            >
                                <Icon size={17} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto px-1">
                <button className="mb-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    Nueva admisión
                </button>

                <div className="space-y-1">
                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800">
                        <Settings size={17} />
                        Configuración
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800">
                        <CircleHelp size={17} />
                        Ayuda
                    </button>
                </div>
            </div>
        </aside>
    );
}