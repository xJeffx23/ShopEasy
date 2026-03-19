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
    {
        label: "Dashboard",
        href: "/sistema/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Empleados",
        href: "/sistema/employees",
        icon: Users,
    },
    {
        label: "Pacientes",
        href: "/sistema/patients",
        icon: UserRound,
    },
    {
        label: "Habitaciones",
        href: "/sistema/rooms",
        icon: BedDouble,
    },
    {
        label: "Reservaciones",
        href: "/sistema/reservations",
        icon: CalendarDays,
    },
    {
        label: "Reportes",
        href: "/sistema/reports",
        icon: FileText,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex w-[260px] flex-col justify-between border-r bg-white px-4 py-6">
            <div>
                <div className="mb-8">
                    <h1 className="text-xl font-bold">Patitos del Retiro</h1>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                        Clinical Management
                    </p>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${isActive
                                        ? "bg-blue-50 text-blue-600 font-medium"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                    }`}
                            >
                                <Icon size={18} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="space-y-3">
                <button className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                    New Admission
                </button>

                <div className="space-y-2 pt-3">
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800">
                        <Settings size={18} />
                        <span>Settings</span>
                    </button>

                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800">
                        <CircleHelp size={18} />
                        <span>Help</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}