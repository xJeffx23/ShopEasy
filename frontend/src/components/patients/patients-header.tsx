import { Button } from "@/src/components/ui/button";
import { Download, Plus } from "lucide-react";

export function PatientsHeader() {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Directorio de Pacientes
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    Administra residentes, niveles de asistencia y asignaciones de
                    habitaciones dentro del centro médico "Patitos del Retiro".
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    variant="outline"
                    className="h-11 rounded-xl border-slate-200 bg-white px-4"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Exportar Reporte
                </Button>

                <Button className="h-11 rounded-xl bg-blue-600 px-4 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Paciente
                </Button>
            </div>
        </div>
    );
}