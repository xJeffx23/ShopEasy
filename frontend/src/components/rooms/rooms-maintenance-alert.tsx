import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { BellRing } from "lucide-react";

interface RoomsMaintenanceAlertProps {
    title: string;
    description: string;
}

export function RoomsMaintenanceAlert({
    title,
    description,
}: RoomsMaintenanceAlertProps) {
    return (
        <Card className="rounded-3xl border-0 bg-blue-700 text-white shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                    <BellRing className="h-4 w-4" />
                    Alerta de mantenimiento
                </div>

                <h3 className="mt-6 text-3xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-blue-100">{description}</p>

                <Button className="mt-8 h-11 w-full rounded-xl bg-white text-blue-700 hover:bg-blue-50">
                    Ver ticket
                </Button>
            </CardContent>
        </Card>
    );
}