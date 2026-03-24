import { EmployeeMetric } from "@/src/types/employee";

interface EmployeeStatsProps {
    metrics: EmployeeMetric[];
}

function getAccentIconBg(accent: EmployeeMetric["accent"]) {
    switch (accent) {
        case "green":
            return "bg-emerald-50 text-emerald-600";
        case "blue":
            return "bg-blue-50 text-blue-600";
        case "amber":
            return "bg-amber-50 text-amber-700";
    }
}

export default function EmployeeStats({ metrics }: EmployeeStatsProps) {
    return (
        <div className="grid grid-cols-3 gap-5">
            {metrics.map((metric) => (
                <div
                    key={metric.id}
                    className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.03)]"
                >
                    <div className="flex items-start gap-4">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${getAccentIconBg(
                                metric.accent
                            )}`}
                        >
                            <div className="h-2.5 w-2.5 rounded-full bg-current" />
                        </div>

                        <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                                {metric.label}
                            </p>
                            <p className="mt-2 text-[28px] font-semibold leading-none text-gray-900">
                                {metric.value}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">{metric.helper}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}