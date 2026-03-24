import { Room } from "@/src/types/room";

export const mockRooms: Room[] = [
    {
        id: "1",
        roomNumber: "204",
        wing: "Ala A",
        floor: 2,
        status: "occupied",
        patient: {
            id: "p1",
            fullName: "Mateo Fernández",
        },
    },
    {
        id: "2",
        roomNumber: "112",
        wing: "Ala B",
        floor: 1,
        status: "available",
    },
    {
        id: "3",
        roomNumber: "301",
        wing: "Ala A",
        floor: 3,
        status: "maintenance",
        issue: {
            title: "Avería HVAC",
            description: "Pendiente",
        },
    },
    {
        id: "4",
        roomNumber: "218",
        wing: "Ala B",
        floor: 2,
        status: "occupied",
        patient: {
            id: "p2",
            fullName: "Lucía Romero",
        },
    },
    {
        id: "5",
        roomNumber: "401",
        wing: "Ala de aislamiento",
        floor: 4,
        status: "closed",
        isIsolation: true,
    },
    {
        id: "6",
        roomNumber: "114",
        wing: "Ala B",
        floor: 1,
        status: "available",
    },
    {
        id: "7",
        roomNumber: "205",
        wing: "Ala A",
        floor: 2,
        status: "occupied",
        patient: {
            id: "p3",
            fullName: "Carla Méndez",
        },
    },
];