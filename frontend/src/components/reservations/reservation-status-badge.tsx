import { ReservationStatus } from "@/src/types/reservation";

interface ReservationStatusBadgeProps {
    status: ReservationStatus;
}

function getConfig(status: ReservationStatus) {
    switch (status) {
        case "activa":
            return { label: "Activa", badge: "bg-green-100 text-green-800 border border-green-200 font-medium" };
        case "pendiente":
            return { label: "Pendiente", badge: "bg-yellow-100 text-yellow-800 border border-yellow-200 font-medium" };
        case "finalizada":
            return { label: "Finalizada", badge: "bg-gray-100 text-gray-700 border border-gray-200 font-medium" };
        case "cancelada":
            return { label: "Cancelada", badge: "bg-red-100 text-red-800 border border-red-200 font-medium" };
        default:
            return { label: "Desconocido", badge: "bg-gray-100 text-gray-700 border border-gray-200 font-medium" };
    }
}

export function ReservationStatusBadge({ status }: ReservationStatusBadgeProps) {
    const { label, badge } = getConfig(status);
    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge}`}>
            {label}
        </span>
    );
}