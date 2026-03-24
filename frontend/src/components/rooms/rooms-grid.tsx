import { PlusCircle } from "lucide-react";
import { Room } from "@/src/types/room";
import { RoomCard } from "./room-card";

interface RoomsGridProps {
    rooms: Room[];
}

export function RoomsGrid({ rooms }: RoomsGridProps) {
    return (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
            ))}

            <div className="flex min-h-[320px] items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white p-6 text-center">
                <div>
                    <PlusCircle className="mx-auto h-8 w-8 text-slate-400" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-700">
                        Agregar Nueva Unidad
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Registrar una nueva habitación o área de tratamiento.
                    </p>
                </div>
            </div>
        </div>
    );
}