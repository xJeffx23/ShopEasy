// ─── Enums del dominio ────────────────────────────────────────────────────────

export type EmployeeDepartment =
    | "Administrativo"
    | "Gerencia"
    | "DTI"
    | "Financiero";

export type EmployeeProfile =
    | "Gerencia"
    | "Gestión de pacientes"
    | "Mantenimiento"
    | "Recepción";

export type EmployeeStatus =
    | "activo"
    | "de permiso"
    | "en capacitación"
    | "inactivo";

// ─── Entidad principal ────────────────────────────────────────────────────────

export interface EmployeeItem {
    id: string;
    fullName: string;
    idNumber: string;        // Número de cédula
    email: string;
    department: EmployeeDepartment;
    role: string;        // Cargo libre (Ej: Analista, Coordinador...)
    profile: EmployeeProfile; // Perfil de acceso al sistema
    status: EmployeeStatus;
    employeeCode: string;        // EMP-001, EMP-002...
    hireDate: string;        // Fecha de ingreso formateada
    initials: string;        // Para el avatar
    avatarUrl?: string;
    phone?: string;
}

// ─── Datos raíz que consume EmployeesView ────────────────────────────────────

export interface EmployeesData {
    title: string;
    subtitle: string;
    employees: EmployeeItem[];
}