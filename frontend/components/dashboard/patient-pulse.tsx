import { DashboardPulse } from "@/types/dashboard";

interface PatientPulseProps {
    pulse: DashboardPulse;
}

export default function PatientPulse({ pulse }: PatientPulseProps) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
            <div className="mb-5 flex items-start justify-between">
                <h3 className="text-[18px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                    Estado de pacientes
                </h3>
                <span className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-end gap-2">
                <span className="text-[58px] font-semibold leading-none text-blue-600">
                    {pulse.pendingCount}
                </span>
                <span className="pb-2 text-[18px] text-gray-500">{pulse.label}</span>
            </div>

            <p className="mt-5 text-[16px] leading-7 text-gray-500">
                {pulse.description}
            </p>

            <div className="mt-6 flex items-center">
                <div className="flex -space-x-2">
                    {pulse.members.map((member) => (
                        <div
                            key={member.id}
                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-gray-700 ${member.bgClass}`}
                            title={member.name}
                        >
                            {member.initials}
                        </div>
                    ))}
                </div>

                <div className="ml-3 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                    +{pulse.extraCount}
                </div>
            </div>
        </div>
    );
}