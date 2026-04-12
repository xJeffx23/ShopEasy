import { Activity } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardPulse } from "@/types/dashboard";

interface PatientPulseProps {
    pulse: DashboardPulse;
}

export default function PatientPulse({ pulse }: PatientPulseProps) {
    return (
        <Card className="rounded-2xl border border-slate-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <CardTitle className="text-base font-semibold text-slate-900">
                    Estado de pacientes
                </CardTitle>

                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <Activity className="h-3.5 w-3.5" />
                    Activo
                </div>
            </CardHeader>

            <CardContent>
                <div className="flex items-end gap-2">
                    <span className="text-5xl font-semibold leading-none tracking-tight text-blue-600">
                        {pulse.pendingCount}
                    </span>
                    <span className="pb-1 text-base text-slate-500">{pulse.label}</span>
                </div>

                <p className="mt-4 text-sm leading-6 text-slate-500">
                    {pulse.description}
                </p>

                <div className="mt-6 flex items-center">
                    <div className="flex -space-x-2">
                        {pulse.members.map((member) => (
                            <Avatar
                                key={member.id}
                                className="h-9 w-9 border-2 border-white"
                                title={member.name}
                            >
                                <AvatarFallback className={`text-xs font-semibold text-slate-700 ${member.bgClass}`}>
                                    {member.initials}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                    </div>

                    <div className="ml-3 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                        +{pulse.extraCount}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}