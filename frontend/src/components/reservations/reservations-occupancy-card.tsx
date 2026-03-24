import { Card, CardContent } from "@/src/components/ui/card";

interface ReservationsOccupancyCardProps {
    totalOccupied: number;
    totalRooms: number;
    premiumOccupied: number;
    premiumTotal: number;
}

export function ReservationsOccupancyCard({
    totalOccupied,
    totalRooms,
    premiumOccupied,
    premiumTotal,
}: ReservationsOccupancyCardProps) {
    const totalPercentage = Math.round((totalOccupied / totalRooms) * 100);
    const premiumPercentage = Math.round((premiumOccupied / premiumTotal) * 100);

    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="text-emerald-500">▣</span>
                    Ocupación en vivo
                </div>

                <div className="mt-5 space-y-4">
                    <div>
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                            <span>Total de habitaciones</span>
                            <span className="font-medium text-slate-700">
                                {totalOccupied}/{totalRooms}
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                            <div
                                className="h-2 rounded-full bg-slate-900"
                                style={{ width: `${totalPercentage}%` }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                            <span>Suites premium</span>
                            <span className="font-medium text-slate-700">
                                {premiumOccupied}/{premiumTotal}
                            </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                            <div
                                className="h-2 rounded-full bg-blue-600"
                                style={{ width: `${premiumPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}