import { ReservationStatus } from "@/src/types/reservation";

interface ReservationStatusBadgeProps {
    status: ReservationStatus;
}

function getConfig(status: ReservationStatus) {
    switch (status) {
        case "activa":
            return { label: "Activa", badge: "bg-emerald-100 text-emerald-700" };
        case "pendiente":
            return { label: "Pendiente", badge: "bg-amber-100 text-amber-700" };
        case "finalizada":
            return { label: "Finalizada", badge: "bg-slate-100 text-slate-500" };
        case "cancelada":
            return { label: "Cancelada", badge: "bg-red-100 text-red-600" };
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