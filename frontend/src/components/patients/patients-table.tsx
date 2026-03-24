import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { Patient } from "@/src/types/patient";
import { MoreHorizontal } from "lucide-react";

interface PatientsTableProps {
    patients: Patient[];
    currentPage: number;
    pageSize: number;
    totalItems: number;
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getAssistanceBadgeClass(level: Patient["assistanceLevel"]) {
    switch (level) {
        case "Independent":
            return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";
        case "Partial Assistance":
            return "bg-slate-200 text-slate-700 hover:bg-slate-200";
        case "Full Assistance":
            return "bg-blue-100 text-blue-700 hover:bg-blue-100";
        default:
            return "";
    }
}

function getStatusDotClass(status: Patient["status"]) {
    return status === "Active" ? "bg-emerald-500" : "bg-slate-400";
}

export function PatientsTable({
    patients,
    currentPage,
    pageSize,
    totalItems,
}: PatientsTableProps) {
    const from = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, totalItems);

    return (
        <Card className="rounded-3xl border border-slate-200 shadow-sm">
            <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div className="text-sm text-slate-500">
                        Showing {from}-{to} of {totalItems}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left">
                        <thead className="border-b border-slate-100">
                            <tr className="text-xs uppercase tracking-wide text-slate-400">
                                <th className="px-6 py-4 font-medium">Nombre</th>
                                <th className="px-6 py-4 font-medium">Nivel de Asistencia</th>
                                <th className="px-6 py-4 font-medium">Habitación</th>
                                <th className="px-6 py-4 font-medium">Estado</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            {patients.map((patient) => (
                                <tr
                                    key={patient.id}
                                    className="border-b border-slate-100 last:border-b-0"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-10 w-10 bg-slate-100 text-slate-700">
                                                <AvatarFallback>{getInitials(patient.fullName)}</AvatarFallback>
                                            </Avatar>

                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {patient.fullName}
                                                </p>
                                                <p className="text-sm text-slate-400">
                                                    ID: {patient.patientCode}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-5">
                                        <Badge
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getAssistanceBadgeClass(
                                                patient.assistanceLevel
                                            )}`}
                                        >
                                            {patient.assistanceLevel}
                                        </Badge>
                                    </td>

                                    <td className="px-6 py-5 text-sm font-medium text-slate-700">
                                        {patient.roomNumber}
                                    </td>

                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <span
                                                className={`h-2.5 w-2.5 rounded-full ${getStatusDotClass(
                                                    patient.status
                                                )}`}
                                            />
                                            {patient.status}
                                        </div>
                                    </td>

                                    <td className="px-6 py-5 text-right">
                                        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {patients.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-sm text-slate-500"
                                    >
                                        No se encontraron pacientes con los filtros seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}