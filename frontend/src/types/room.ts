export type RoomStatus =
    | "available"
    | "occupied"
    | "maintenance"
    | "closed";

export interface RoomPatient {
    id: string;
    fullName: string;
    avatarUrl?: string;
}

export interface RoomIssue {
    title: string;
    description: string;
}

export interface Room {
    id: string;
    roomNumber: string;
    wing: string;
    floor: number;
    status: RoomStatus;
    patient?: RoomPatient | null;
    issue?: RoomIssue | null;
    isIsolation?: boolean;
}