import { Filter, UserPlus } from "lucide-react";

import { Button } from "@/src/components/ui/button";

interface EmployeesHeaderProps {
    title: string;
    subtitle: string;
    onAddEmployee: () => void;
}

export default function EmployeesHeader({
    title,
    subtitle,
    onAddEmployee,
}: EmployeesHeaderProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight text-slate-900">
                    {title}
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 md:text-base">
                    {subtitle}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl border-slate-200 px-4 text-sm font-medium text-slate-700"
                >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                </Button>

                <Button
                    type="button"
                    onClick={onAddEmployee}
                    className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Agregar empleado
                </Button>
            </div>
        </div>
    );
}