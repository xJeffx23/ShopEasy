import ReservationsView from "@/src/components/reservations/reservations-view";
import { getReservationsData } from "@/src/services/reservations.service";

export const metadata = {
    title: "Reservaciones | Patitos del Retiro",
};

export default async function ReservationsPage() {
    const data = await getReservationsData();
    return <ReservationsView data={data} />;
}