import { RoomsData } from "@/src/types/room";

export const roomsMock: RoomsData = {
    title: "Habitaciones",
    subtitle: "Gestión de habitaciones del asilo",

    stats: {
        available: 3,
        reserved: 5,
        maintenance: 1,
        closed: 1,
        total: 10,
    },

    rooms: [
        {
            id: "room-1", roomNumber: "101", floor: 1,
            type: "Individual", capacity: 1,
            status: "reservada",
            patientName: "Carmen Villalobos Ruiz", patientId: "pat-1",
            cleanings: [
                { id: "cl-1", date: "05/04/2026", employeeName: "José Fernández Ulate", notes: "Limpieza rutinaria completa" },
                { id: "cl-2", date: "01/04/2026", employeeName: "José Fernández Ulate" },
            ],
            maintenances: [],
        },
        {
            id: "room-2", roomNumber: "102", floor: 1,
            type: "Individual", capacity: 1,
            status: "reservada",
            patientName: "Fernando Mora Quesada", patientId: "pat-2",
            cleanings: [
                { id: "cl-3", date: "05/04/2026", employeeName: "José Fernández Ulate" },
            ],
            maintenances: [],
        },
        {
            id: "room-3", roomNumber: "103", floor: 1,
            type: "Compartida", capacity: 2,
            status: "reservada",
            patientName: "Marta Rojas Vindas", patientId: "pat-5",
            cleanings: [],
            maintenances: [],
        },
        {
            id: "room-4", roomNumber: "104", floor: 1,
            type: "Compartida", capacity: 2,
            status: "disponible",
            cleanings: [
                { id: "cl-4", date: "06/04/2026", employeeName: "José Fernández Ulate", notes: "Preparada para nueva admisión" },
            ],
            maintenances: [],
        },
        {
            id: "room-5", roomNumber: "105", floor: 1,
            type: "Individual cama matrimonial", capacity: 1,
            status: "mantenimiento",
            observations: "Problema con sistema eléctrico",
            cleanings: [],
            maintenances: [
                {
                    id: "mnt-1",
                    date: "04/04/2026",
                    repairDescription: "Revisión y reparación del sistema eléctrico de tomacorrientes",
                    furnitureUpdate: false,
                    recommendedRepairs: "Cambio de tomacorrientes y revisión del tablero eléctrico",
                    completed: false,
                    employeeName: "José Fernández Ulate",
                },
            ],
        },
        {
            id: "room-6", roomNumber: "201", floor: 2,
            type: "Individual", capacity: 1,
            status: "reservada",
            patientName: "Isabel Chacón Navarro", patientId: "pat-3",
            cleanings: [
                { id: "cl-5", date: "06/04/2026", employeeName: "José Fernández Ulate" },
            ],
            maintenances: [
                {
                    id: "mnt-2",
                    date: "15/03/2026",
                    repairDescription: "Reparación de persiana y revisión de plomería",
                    furnitureUpdate: true,
                    furnitureDetail: "Cambio de colchón y almohadas",
                    recommendedRepairs: "Pintura de paredes próximo mes",
                    completed: true,
                    employeeName: "José Fernández Ulate",
                },
            ],
        },
        {
            id: "room-7", roomNumber: "202", floor: 2,
            type: "Individual", capacity: 1,
            status: "reservada",
            patientName: "Alberto Méndez Solís", patientId: "pat-4",
            cleanings: [],
            maintenances: [],
        },
        {
            id: "room-8", roomNumber: "203", floor: 2,
            type: "Compartida", capacity: 2,
            status: "disponible",
            cleanings: [],
            maintenances: [],
        },
        {
            id: "room-9", roomNumber: "204", floor: 2,
            type: "Cuidados especiales", capacity: 1,
            status: "cerrada",
            observations: "Fuera de servicio por remodelación",
            cleanings: [],
            maintenances: [],
        },
        {
            id: "room-10", roomNumber: "205", floor: 2,
            type: "Individual", capacity: 1,
            status: "disponible",
            cleanings: [
                { id: "cl-6", date: "06/04/2026", employeeName: "José Fernández Ulate" },
            ],
            maintenances: [],
        },
    ],
};