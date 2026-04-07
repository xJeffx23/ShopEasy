// ─── Catálogos ────────────────────────────────────────────────────────────────

export type AssistanceLevel =
    | "Asistencia básica"
    | "Asistencia para movilidad"
    | "Asistencia para alimentación"
    | "Asistencia para baño"
    | "Asistencia completa";

export type SpecialCare =
    | "Alergias"
    | "Cambios de vendajes"
    | "Dietas especiales";

export type AdditionalPackage =
    | "Disfrute de juegos"
    | "Visitas a los familiares"
    | "Paseos a sitios con acompañamiento";

export type PatientStatus = "activo" | "inactivo";

// ─── Sub-entidades ────────────────────────────────────────────────────────────

export interface PatientMedication {
    id: string;
    name: string;       // Nombre del medicamento
    dose: string;       // Ej. "500mg"
    frequency: string;       // Ej. "2 veces al día"
    schedule: string;       // Ej. "08:00, 20:00"
    notes?: string;
}

export interface PatientSpecialCare {
    id: string;
    type: SpecialCare;
    detail: string;
}

export interface PatientPackage {
    id: string;
    type: AdditionalPackage;
    assignedDate: string;
    active: boolean;
}

export interface EmergencyContact {
    name: string;
    phone: string;
}

// ─── Entidad principal ────────────────────────────────────────────────────────

export interface Patient {
    id: string;
    patientCode: string;         // PT-001, PT-002...
    fullName: string;
    idNumber: string;         // Número de cédula
    birthDate: string;         // DD/MM/YYYY
    age: number;
    admissionDate: string;         // Fecha de ingreso DD/MM/YYYY
    roomNumber: string;         // Número de habitación
    assistanceLevel: AssistanceLevel;
    status: PatientStatus;
    emergencyContact: EmergencyContact;
    medications: PatientMedication[];
    specialCares: PatientSpecialCare[];
    packages: PatientPackage[];
}

// ─── Stats del panel superior ─────────────────────────────────────────────────

export interface PatientStats {
    total: number;
    lowAssistance: number;   // Básica + Movilidad
    midAssistance: number;   // Alimentación + Baño
    highAssistance: number;  // Completa
}

// ─── Datos raíz ───────────────────────────────────────────────────────────────

export interface PatientsData {
    title: string;
    subtitle: string;
    patients: Patient[];
    stats: PatientStats;
}