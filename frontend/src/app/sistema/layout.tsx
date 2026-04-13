"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/src/components/layout/sidebar";
import Topbar from "@/src/components/layout/topbar";
import { authService } from "@/src/services/auth.service";

export default function SistemaLayout({
    children,
}: {
    children: ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar autenticación
        if (!authService.isAuthenticated()) {
            router.push('/auth/login');
            return;
        }

        // Verificar si debe cambiar contraseña
        if (authService.debeCambiarContrasena() && pathname !== '/sistema/cambiar-contrasena') {
            router.push('/sistema/cambiar-contrasena');
            return;
        }

        // Verificar acceso a la ruta actual
        if (!authService.puedeAccederRuta(pathname)) {
            // Redirigir al dashboard si no tiene acceso
            router.push('/sistema/dashboard');
            return;
        }

        setIsAuthorized(true);
        setIsLoading(false);
    }, [pathname, router]);

    // Mostrar loading mientras verifica
    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#f5f7fb]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-500">Verificando acceso...</p>
                </div>
            </div>
        );
    }

    // No renderizar si no está autorizado
    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="h-screen overflow-hidden bg-[#f5f7fb]">
            <div className="flex h-full">
                <Sidebar />

                <div className="flex flex-1 flex-col overflow-hidden">
                    <Topbar />

                    <main className="flex-1 overflow-y-auto px-6 py-5">
                        <div className="mx-auto w-full max-w-[1280px]">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}