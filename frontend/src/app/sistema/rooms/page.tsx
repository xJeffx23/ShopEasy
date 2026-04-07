import RoomsView from "@/src/components/rooms/rooms-view";
import { getRoomsData } from "@/src/services/rooms.service";

export const metadata = {
    title: "Habitaciones | Patitos del Retiro",
};

export default async function RoomsPage() {
    const data = await getRoomsData();
    return <RoomsView data={data} />;
}