import { UserPlus } from "lucide-react";
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
                <p className="mt-1 max-w-2xl text-sm text-slate-500">
                    {subtitle}
                </p>
            </div>

            <Button
                type="button"
                onClick={onAddEmployee}
                className="h-11 shrink-0 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 active:scale-[0.98]"
            >
                <UserPlus className="mr-2 h-4 w-4" />
                Agregar empleado
            </Button>
        </div>
    );
}