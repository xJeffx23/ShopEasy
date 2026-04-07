import { Button } from "@/src/components/ui/button";
import { Download, UserPlus } from "lucide-react";

interface PatientsHeaderProps {
    title: string;
    subtitle: string;
    onAdd: () => void;
    onExport: () => void;
}

export function PatientsHeader({
    title,
    subtitle,
    onAdd,
    onExport,
}: PatientsHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>

            <div className="flex items-center gap-3">
                <Button
                    variant="outline"
                    onClick={onExport}
                    className="h-10 rounded-xl border-slate-200 px-4 text-sm"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Exportar reporte
                </Button>

                <Button
                    onClick={onAdd}
                    className="h-10 rounded-xl bg-blue-600 px-4 text-sm hover:bg-blue-700"
                >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Agregar Paciente
                </Button>
            </div>
        </div>
    );
}