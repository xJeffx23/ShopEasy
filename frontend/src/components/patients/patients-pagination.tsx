"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PatientsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PatientsPagination({
    currentPage,
    totalPages,
    onPageChange,
}: PatientsPaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex flex-col gap-4 px-2 pt-4 md:flex-row md:items-center md:justify-between">
            <Button
                variant="ghost"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="justify-start text-slate-500"
            >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Anterior
            </Button>

            <div className="flex items-center justify-center gap-2">
                {pages.map((page) => {
                    const active = currentPage === page;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition ${active
                                ? "bg-blue-600 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            <Button
                variant="ghost"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="justify-end text-slate-500"
            >
                Siguiente
                <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
        </div>
    );
}