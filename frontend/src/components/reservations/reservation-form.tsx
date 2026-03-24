"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { CalendarDays } from "lucide-react";
import {
    mockReservationPatients,
    mockReservationRooms,
} from "@/src/data/mock-reservations";
import { RoomCategory, StayType } from "@/src/types/reservation";

export function ReservationForm() {
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [selectedRoomId, setSelectedRoomId] = useState("r1");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [indefiniteStay, setIndefiniteStay] = useState(false);
    const [stayType, setStayType] = useState<StayType>("long-term");
    const [roomCategory, setRoomCategory] = useState<RoomCategory>("standard");

    const selectedRoom = useMemo(() => {
        return mockReservationRooms.find((room) => room.id === selectedRoomId);
    }, [selectedRoomId]);

    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                        <CalendarDays className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Crear nueva reservación
                    </h2>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Selección de paciente
                        </label>
                        <select
                            value={selectedPatientId}
                            onChange={(e) => setSelectedPatientId(e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                        >
                            <option value="">Selecciona un paciente</option>
                            {mockReservationPatients.map((patient) => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.fullName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Selección de habitación
                        </label>
                        <select
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                        >
                            {mockReservationRooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    Habitación {room.roomNumber} (
                                    {room.category === "standard" ? "Estándar" : "Premium"})
                                </option>
                            ))}
                        </select>

                        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            Habitación {selectedRoom?.roomNumber} disponible para estas fechas.
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Fecha de inicio
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Fecha de salida
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            disabled={indefiniteStay}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none disabled:bg-slate-50 focus:border-blue-500"
                        />

                        <label className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                            <input
                                type="checkbox"
                                checked={indefiniteStay}
                                onChange={(e) => setIndefiniteStay(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300"
                            />
                            Estadía indefinida
                        </label>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Tipo de estadía
                        </label>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                type="button"
                                variant={stayType === "long-term" ? "default" : "outline"}
                                onClick={() => setStayType("long-term")}
                                className="rounded-xl"
                            >
                                Largo plazo
                            </Button>
                            <Button
                                type="button"
                                variant={stayType === "short-term" ? "default" : "outline"}
                                onClick={() => setStayType("short-term")}
                                className="rounded-xl"
                            >
                                Corto plazo
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Categoría de habitación
                        </label>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                type="button"
                                variant={roomCategory === "standard" ? "default" : "outline"}
                                onClick={() => setRoomCategory("standard")}
                                className="rounded-xl"
                            >
                                Estándar
                            </Button>
                            <Button
                                type="button"
                                variant={roomCategory === "premium" ? "default" : "outline"}
                                onClick={() => setRoomCategory("premium")}
                                className="rounded-xl"
                            >
                                Premium
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button
                        type="button"
                        variant="ghost"
                        className="rounded-xl text-slate-500 hover:bg-slate-100"
                    >
                        Descartar
                    </Button>
                    <Button
                        type="button"
                        className="rounded-xl bg-blue-600 px-6 hover:bg-blue-700"
                    >
                        Confirmar reservación
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}