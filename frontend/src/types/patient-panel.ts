import { Reservation } from "@/src/types/reservation";

export interface PatientPanelData {
    patient: {
        id: string;
        name: string;
        patientCode: string;
        roomNumber: string;
    };
    activeReservations: Reservation[];
    historyReservations: Reservation[];
}