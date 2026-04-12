export const dynamic = "force-dynamic";
import RoomsView from "@/components/rooms/rooms-view";
import { getRoomsData } from "@/services/rooms.service";

export const metadata = {
    title: "Habitaciones | Patitos del Retiro",
};

export default async function RoomsPage() {
    const data = await getRoomsData();
    return <RoomsView data={data} />;
}