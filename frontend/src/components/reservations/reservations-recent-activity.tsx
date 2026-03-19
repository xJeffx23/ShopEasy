import { Card, CardContent } from "@/src/components/ui/card";
import { MoreHorizontal } from "lucide-react";
import { mockReservations } from "@/src/data/mock-reservations";
import { ReservationStatusBadge } from "./reservation-status-badge";

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getStayTypeLabel(stayType: "long-term" | "short-term") {
    return stayType === "long-term" ? "Largo plazo" : "Corto plazo";
}

function formatDateRange(
    startDate: string,
    endDate: string | null,
    indefiniteStay: boolean
) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("es-CR", {
            month: "short",
            day: "2-digit",
        });

    if (indefiniteStay || !endDate) {
        return `${formatDate(startDate)} - Indefinida`;
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function ReservationsRecentActivity() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-900">Actividad reciente</h2>

                <div className="flex items-center gap-2">
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                        <span className="text-sm">≡</span>
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                        <span className="text-sm">↓</span>
                    </button>
                </div>
            </div>

            <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
                            <thead className="border-b border-slate-100">
                                <tr className="text-xs uppercase tracking-wide text-slate-400">
                                    <th className="px-6 py-4 font-medium">Paciente</th>
                                    <th className="px-6 py-4 font-medium">Habitación</th>
                                    <th className="px-6 py-4 font-medium">Duración</th>
                                    <th className="px-6 py-4 font-medium">Tipo</th>
                                    <th className="px-6 py-4 font-medium">Estado</th>
                                    <th className="px-6 py-4 font-medium text-right">Acción</th>
                                </tr>
                            </thead>

                            <tbody>
                                {mockReservations.map((reservation) => (
                                    <tr
                                        key={reservation.id}
                                        className="border-b border-slate-100 last:border-b-0"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                                                    {getInitials(reservation.patient.fullName)}
                                                </div>

                                                <span className="font-medium text-slate-900">
                                                    {reservation.patient.fullName}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                            Habitación {reservation.room.roomNumber}
                                        </td>

                                        <td className="px-6 py-5 text-sm text-slate-500">
                                            {formatDateRange(
                                                reservation.startDate,
                                                reservation.endDate,
                                                reservation.indefiniteStay
                                            )}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                {getStayTypeLabel(reservation.stayType)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5">
                                            <ReservationStatusBadge status={reservation.status} />
                                        </td>

                                        <td className="px-6 py-5 text-right">
                                            <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}