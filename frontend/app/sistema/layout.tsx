import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function SistemaLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#f5f7fb] text-[#1f2937]">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex flex-1 flex-col">
                    <Topbar />

                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}