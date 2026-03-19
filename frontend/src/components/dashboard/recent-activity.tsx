import { ActivityItem } from "@/src/types/dashboard";

interface RecentActivityProps {
    items: ActivityItem[];
}

function getTypeBadge(color: ActivityItem["typeColor"]) {
    switch (color) {
        case "green":
            return "bg-emerald-100 text-emerald-700";
        case "blue":
            return "bg-blue-100 text-blue-700";
        case "amber":
            return "bg-amber-100 text-amber-700";
        default:
            return "bg-gray-100 text-gray-600";
    }
}

export default function RecentActivity({ items }: RecentActivityProps) {
    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-[34px] font-semibold text-gray-900">
                    Actividad reciente
                </h2>
                <button className="text-[18px] font-semibold text-blue-600 transition hover:text-blue-700">
                    Ver todo
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
                <div className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] px-8 py-5 text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                    <span>Paciente / Evento</span>
                    <span>Tipo</span>
                    <span>Habitación</span>
                    <span>Tiempo</span>
                </div>

                {items.map((item) => (
                    <div
                        key={item.id}
                        className="grid grid-cols-[1.6fr_1fr_1fr_0.8fr] items-center border-t border-gray-100 px-8 py-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
                                {item.initials}
                            </div>

                            <div>
                                <p className="text-[20px] font-semibold text-gray-900">
                                    {item.patientName}
                                </p>
                                <p className="text-[15px] text-gray-400">
                                    {item.eventDescription}
                                </p>
                            </div>
                        </div>

                        <div>
                            <span
                                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${getTypeBadge(
                                    item.typeColor
                                )}`}
                            >
                                {item.type}
                            </span>
                        </div>

                        <div className="text-[20px] text-gray-600">{item.room}</div>
                        <div className="text-[16px] text-gray-400">{item.timeAgo}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}