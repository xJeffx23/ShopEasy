import { ReservationForm } from "@/src/components/reservations/reservation-form";
import { ReservationsHeader } from "@/src/components/reservations/reservations-header";
import { ReservationsOccupancyCard } from "@/src/components/reservations/reservations-occupancy-card";
import { ReservationsPatientPulse } from "@/src/components/reservations/reservations-patient-pulse";
import { ReservationsRecentActivity } from "@/src/components/reservations/reservations-recent-activity";

export default function ReservationsPage() {
    return (
        <section className="space-y-8 bg-slate-50 p-6">
            <ReservationsHeader />

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                <ReservationForm />

                <div className="space-y-6">
                    <ReservationsOccupancyCard
                        totalOccupied={42}
                        totalRooms={50}
                        premiumOccupied={8}
                        premiumTotal={10}
                    />

                    <ReservationsPatientPulse
                        patientName="Arnaldo Rodríguez"
                        nextCheckIn="2:00 PM"
                        note="Arnaldo requiere una habitación en planta baja debido a una evaluación reciente de movilidad."
                    />
                </div>
            </div>

            <ReservationsRecentActivity />
        </section>
    );
}