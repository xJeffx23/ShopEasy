import { Button } from "@/src/components/ui/button";
import { Plus } from "lucide-react";

interface RoomsHeaderProps {
    title: string;
    subtitle: string;
    onAdd: () => void;
}

export function RoomsHeader({ title, subtitle, onAdd }: RoomsHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            </div>

            <Button
                onClick={onAdd}
                className="h-10 shrink-0 rounded-xl bg-blue-600 px-5 text-sm hover:bg-blue-700 active:scale-[0.98]"
            >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Habitación
            </Button>
        </div>
    );
}