import { Card, CardContent } from "@/src/components/ui/card";

interface ReservationsPatientPulseProps {
    patientName: string;
    nextCheckIn: string;
    note: string;
}

export function ReservationsPatientPulse({
    patientName,
    nextCheckIn,
    note,
}: ReservationsPatientPulseProps) {
    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-slate-700">
                    Pulso del paciente
                </h3>

                <div className="mt-5 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
                        AR
                    </div>

                    <div className="flex-1">
                        <p className="font-semibold text-slate-900">{patientName}</p>
                        <p className="text-sm text-slate-500">
                            Próxima revisión: {nextCheckIn}
                        </p>
                    </div>

                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                    “{note}”
                </p>
            </CardContent>
        </Card>
    );
}