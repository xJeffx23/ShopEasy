import { RoomsGrid } from "@/src/components/rooms/rooms-grid";
import { RoomsHeader } from "@/src/components/rooms/rooms-header";
import { RoomsMaintenanceAlert } from "@/src/components/rooms/rooms-maintenance-alert";
import { RoomsOperationalPulse } from "@/src/components/rooms/rooms-operational-pulse";
import { RoomsStatusSummary } from "@/src/components/rooms/rooms-status-summary";
import { mockRooms } from "@/src/data/mock-rooms";

export default function RoomsPage() {
    const availableCount = mockRooms.filter(
        (room) => room.status === "available"
    ).length;

    const occupiedCount = mockRooms.filter(
        (room) => room.status === "occupied"
    ).length;

    const maintenanceCount = mockRooms.filter(
        (room) => room.status === "maintenance"
    ).length;

    const closedCount = mockRooms.filter(
        (room) => room.status === "closed"
    ).length;

    return (
        <section className="space-y-6 bg-slate-50 p-6">
            <RoomsHeader />

            <RoomsStatusSummary
                available={availableCount}
                occupied={occupiedCount}
                maintenance={maintenanceCount}
                closed={closedCount}
            />

            <RoomsGrid rooms={mockRooms} />

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <RoomsOperationalPulse
                    occupancyPercentage={88}
                    turnoverRateHours={2.4}
                    weeklyCleaningPercentage={100}
                />

                <RoomsMaintenanceAlert
                    title="Alerta crítica de HVAC"
                    description="La unidad de calefacción de la habitación 301 no responde. El equipo de mantenimiento ya fue notificado para una atención inmediata."
                />
            </div>
        </section>
    );
}