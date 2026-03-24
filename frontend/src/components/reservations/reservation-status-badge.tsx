import { Badge } from "@/src/components/ui/badge";
import { ReservationStatus } from "@/src/types/reservation";

interface ReservationStatusBadgeProps {
    status: ReservationStatus;
}

function getStatusConfig(status: ReservationStatus) {
    switch (status) {
        case "active":
            return {
                label: "Activo",
                className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
                dotClassName: "bg-emerald-500",
            };
        case "reserved":
            return {
                label: "Reservado",
                className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
                dotClassName: "bg-blue-500",
            };
        case "pending":
            return {
                label: "Pendiente",
                className: "bg-amber-100 text-amber-700 hover:bg-amber-100",
                dotClassName: "bg-amber-500",
            };
        default:
            return {
                label: "",
                className: "",
                dotClassName: "",
            };
    }
}

export function ReservationStatusBadge({
    status,
}: ReservationStatusBadgeProps) {
    const config = getStatusConfig(status);

    return (
        <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${config.dotClassName}`} />
            <Badge className={`rounded-full px-3 py-1 text-xs ${config.className}`}>
                {config.label}
            </Badge>
        </div>
    );
}