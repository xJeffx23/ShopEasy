import { PatientPanelData } from "@/src/types/patient-panel";

export const patientPanelMock: PatientPanelData = {
    patient: {
        id: "pat-1",
        name: "Carmen Villalobos Ruiz",
        patientCode: "PT-001",
        roomNumber: "101",
    },

    activeReservations: [
        {
            id: "res-1",
            patientId: "pat-1",
            patientName: "Carmen Villalobos Ruiz",
            roomId: "room-1",
            roomNumber: "101",
            roomType: "Individual",
            startDate: "13/02/2023",
            endDate: "13/02/2025",
            indefinite: false,
            schedule: "Full estancia",
            status: "activa",
            createdBy: "Carlos Rodríguez Mora",
        },
    ],

    historyReservations: [
        {
            id: "res-old-1",
            patientId: "pat-1",
            patientName: "Carmen Villalobos Ruiz",
            roomId: "room-old-1",
            roomNumber: "205",
            roomType: "Compartida",
            startDate: "01/06/2022",
            endDate: "12/02/2023",
            indefinite: false,
            schedule: "Full estancia",
            status: "finalizada",
            createdBy: "Ana Martínez Solano",
        },
        {
            id: "res-old-2",
            patientId: "pat-1",
            patientName: "Carmen Villalobos Ruiz",
            roomId: "room-old-2",
            roomNumber: "103",
            roomType: "Compartida",
            startDate: "15/03/2022",
            endDate: "31/05/2022",
            indefinite: false,
            schedule: "Mañana (8am - 2pm)",
            status: "finalizada",
            createdBy: "Ana Martínez Solano",
        },
    ],
};