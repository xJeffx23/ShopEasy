export const dynamic = "force-dynamic";
import ReservationsView from "@/components/reservations/reservations-view";
import { getReservationsData } from "@/services/reservations.service";

export const metadata = {
    title: "Reservaciones | Patitos del Retiro",
};

export default async function ReservationsPage() {
    const data = await getReservationsData();
    return <ReservationsView data={data} />;
}