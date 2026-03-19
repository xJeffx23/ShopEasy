"use client";

import { useState } from "react";
import { Bell, Search } from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

export default function Topbar() {
    const [searchValue, setSearchValue] = useState("");

    return (
        <header className="shrink-0 border-b border-gray-200 bg-white px-6 py-3">
            <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6">
                <div className="flex items-center gap-6 text-sm text-gray-400">
                    <span className="cursor-pointer transition hover:text-gray-600">
                        Inicio
                    </span>
                    <span className="cursor-pointer font-medium text-blue-600">
                        Dashboard
                    </span>
                    <span className="cursor-pointer transition hover:text-gray-600">
                        Resumen
                    </span>
                    <span className="cursor-pointer transition hover:text-gray-600">
                        Agenda
                    </span>
                    <span className="cursor-pointer transition hover:text-gray-600">
                        Inventario
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-[260px]">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder="Buscar pacientes..."
                            className="h-10 w-full rounded-full border border-transparent bg-gray-100 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Notificaciones"
                    >
                        <Bell size={18} strokeWidth={2} />
                    </button>

                    <Avatar className="h-10 w-10 ring-1 ring-gray-200">
                        <AvatarImage src="" alt="Usuario" />
                        <AvatarFallback className="bg-teal-200 text-sm font-semibold text-teal-800">
                            DR
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}