export type AssistanceLevel =
    | "Independent"
    | "Partial Assistance"
    | "Full Assistance";

export type PatientStatus = "Active" | "Inactive";

export interface Patient {
    id: string;
    fullName: string;
    patientCode: string;
    assistanceLevel: AssistanceLevel;
    roomNumber: string;
    status: PatientStatus;
    department: string;
    age: number;
}