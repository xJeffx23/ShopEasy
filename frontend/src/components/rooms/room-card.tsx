import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { AlertTriangle, BedDouble, Lock, User } from "lucide-react";
import { Room } from "@/src/types/room";

interface RoomCardProps {
    room: Room;
}

function getStatusLabel(status: Room["status"]) {
    switch (status) {
        case "available":
            return "Disponible";
        case "occupied":
            return "Ocupada";
        case "maintenance":
            return "Mantenimiento";
        case "closed":
            return "Cerrada";
        default:
            return "";
    }
}

function getStatusBadgeClass(status: Room["status"]) {
    switch (status) {
        case "available":
            return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
        case "occupied":
            return "bg-blue-100 text-blue-700 hover:bg-blue-100";
        case "maintenance":
            return "bg-amber-100 text-amber-700 hover:bg-amber-100";
        case "closed":
            return "bg-slate-200 text-slate-600 hover:bg-slate-200";
        default:
            return "";
    }
}

export function RoomCard({ room }: RoomCardProps) {
    const isAvailable = room.status === "available";
    const isOccupied = room.status === "occupied";
    const isMaintenance = room.status === "maintenance";
    const isClosed = room.status === "closed";

    return (
        <Card className="h-full rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="flex h-full flex-col p-5">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            {room.wing} • Piso {room.floor}
                        </p>
                        <h3 className="mt-2 text-3xl font-bold leading-none text-slate-900">
                            Habitación
                        </h3>
                        <p className="mt-1 text-4xl font-bold leading-none text-slate-900">
                            {room.roomNumber}
                        </p>
                    </div>

                    <Badge
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(
                            room.status
                        )}`}
                    >
                        {getStatusLabel(room.status)}
                    </Badge>
                </div>

                <div className="flex-1">
                    {isOccupied && room.patient && (
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">Paciente</p>
                                    <p className="font-semibold text-slate-900">
                                        {room.patient.fullName}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isAvailable && (
                        <div className="flex h-[92px] items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-center">
                            <div>
                                <BedDouble className="mx-auto h-6 w-6 text-emerald-600" />
                                <p className="mt-2 text-sm font-medium text-emerald-700">
                                    Lista para admisión
                                </p>
                            </div>
                        </div>
                    )}

                    {isMaintenance && room.issue && (
                        <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                                    <AlertTriangle className="h-5 w-5 text-amber-700" />
                                </div>

                                <div>
                                    <p className="text-xs text-slate-500">Incidencia</p>
                                    <p className="font-semibold text-slate-900">
                                        {room.issue.title}
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        {room.issue.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {isClosed && (
                        <div className="flex h-[92px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
                            <div>
                                <Lock className="mx-auto h-6 w-6 text-slate-400" />
                                <p className="mt-2 text-sm font-medium text-slate-500">
                                    Sector inactivo
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        className="rounded-xl border-slate-200 bg-white text-slate-700"
                    >
                        Limpiar
                    </Button>

                    {isMaintenance ? (
                        <Button className="rounded-xl bg-blue-600 hover:bg-blue-700">
                            Resolver
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            className="rounded-xl border-slate-200 bg-white text-slate-700"
                        >
                            Servicio
                        </Button>
                    )}
                </div>

                {isClosed && (
                    <p className="mt-4 text-center text-sm text-slate-400">
                        Actualmente no disponible
                    </p>
                )}
            </CardContent>
        </Card>
    );
}