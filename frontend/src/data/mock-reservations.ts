import { Reservation } from "@/src/types/reservation";

export const mockReservationPatients = [
    { id: "p1", fullName: "Elena Rivas" },
    { id: "p2", fullName: "Jorge Marín" },
    { id: "p3", fullName: "Sara Duarte" },
    { id: "p4", fullName: "Arnaldo Rodríguez" },
    { id: "p5", fullName: "Lucía Romero" },
];

export const mockReservationRooms = [
    { id: "r1", roomNumber: "102", category: "standard" as const },
    { id: "r2", roomNumber: "105", category: "standard" as const },
    { id: "r3", roomNumber: "204", category: "premium" as const },
    { id: "r4", roomNumber: "301", category: "premium" as const },
];

export const mockReservations: Reservation[] = [
    {
        id: "1",
        patient: {
            id: "p1",
            fullName: "Elena Rivas",
        },
        room: {
            id: "r1",
            roomNumber: "102",
            category: "standard",
        },
        startDate: "2026-10-12",
        endDate: null,
        indefiniteStay: true,
        stayType: "long-term",
        status: "active",
    },
    {
        id: "2",
        patient: {
            id: "p2",
            fullName: "Jorge Marín",
        },
        room: {
            id: "r3",
            roomNumber: "204",
            category: "premium",
        },
        startDate: "2026-11-01",
        endDate: "2026-11-15",
        indefiniteStay: false,
        stayType: "short-term",
        status: "reserved",
    },
    {
        id: "3",
        patient: {
            id: "p3",
            fullName: "Sara Duarte",
        },
        room: {
            id: "r2",
            roomNumber: "105",
            category: "standard",
        },
        startDate: "2026-10-28",
        endDate: "2026-11-10",
        indefiniteStay: false,
        stayType: "short-term",
        status: "pending",
    },
];