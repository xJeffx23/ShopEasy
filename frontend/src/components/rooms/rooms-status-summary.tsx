import { Card, CardContent } from "@/src/components/ui/card";

interface RoomsStatusSummaryProps {
    available: number;
    occupied: number;
    maintenance: number;
    closed: number;
}

const summaryItems = [
    {
        key: "available",
        label: "Disponibles",
        dotClassName: "bg-emerald-500",
    },
    {
        key: "occupied",
        label: "Ocupadas",
        dotClassName: "bg-blue-500",
    },
    {
        key: "maintenance",
        label: "Mantenimiento",
        dotClassName: "bg-amber-500",
    },
    {
        key: "closed",
        label: "Cerradas",
        dotClassName: "bg-slate-400",
    },
] as const;

export function RoomsStatusSummary({
    available,
    occupied,
    maintenance,
    closed,
}: RoomsStatusSummaryProps) {
    const values = {
        available,
        occupied,
        maintenance,
        closed,
    };

    return (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {summaryItems.map((item) => (
                <Card
                    key={item.key}
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                    <CardContent className="flex items-center gap-3 p-4">
                        <span className={`h-2.5 w-2.5 rounded-full ${item.dotClassName}`} />
                        <span className="text-sm font-medium text-slate-700">
                            {item.label} ({values[item.key]})
                        </span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}