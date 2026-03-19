export type StayType = "long-term" | "short-term";
export type RoomCategory = "standard" | "premium";
export type ReservationStatus = "active" | "reserved" | "pending";

export interface ReservationPatient {
    id: string;
    fullName: string;
}

export interface ReservationRoom {
    id: string;
    roomNumber: string;
    category: RoomCategory;
}

export interface Reservation {
    id: string;
    patient: ReservationPatient;
    room: ReservationRoom;
    startDate: string;
    endDate: string | null;
    indefiniteStay: boolean;
    stayType: StayType;
    status: ReservationStatus;
}