import type { ReactNode } from "react";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";

export default function SistemaLayout({
    children,
}: {
    children: ReactNode;
}) {
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