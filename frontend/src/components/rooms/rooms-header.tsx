import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";

export function RoomsHeader() {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Gestión de Habitaciones
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    Vista general de la capacidad clínica y del estado de mantenimiento.
                </p>
            </div>

            <Button className="h-11 rounded-xl bg-blue-600 px-4 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Unidad
            </Button>
        </div>
    );
}