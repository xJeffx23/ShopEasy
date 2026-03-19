import { QuickActionItem } from "@/src/types/dashboard";

interface QuickActionsProps {
    actions: QuickActionItem[];
}

function getAccentColor(accent: QuickActionItem["accent"]) {
    switch (accent) {
        case "blue":
            return "text-blue-600";
        case "green":
            return "text-emerald-600";
        case "amber":
            return "text-amber-700";
    }
}

export default function QuickActions({ actions }: QuickActionsProps) {
    return (
        <div>
            <h3 className="mb-4 text-[18px] font-semibold uppercase tracking-[0.08em] text-gray-500">
                Acciones rápidas
            </h3>

            <div className="space-y-4">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.id}
                            className="flex h-14 w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 text-[18px] font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            <Icon size={18} className={getAccentColor(action.accent)} />
                            {action.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}