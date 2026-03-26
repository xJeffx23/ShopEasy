export type EmployeeStatus =
    | "activo"
    | "de permiso"
    | "en capacitación"
    | "inactivo";

export type EmployeeDepartment =
    | "Administrativo"
    | "Gerencia"
    | "DTI"
    | "Financiero";

export interface EmployeeItem {
    id: string;
    fullName: string;
    email: string;
    employeeCode: string;
    hireDate: string;
    department: EmployeeDepartment;
    role: string;
    status: EmployeeStatus;
    avatarUrl?: string;
    initials: string;
}

export interface EmployeeMetric {
    id: string;
    label: string;
    value: string;
    helper: string;
    accent: "green" | "blue" | "amber";
}

export interface EmployeeDirectoryData {
    title: string;
    subtitle: string;
    employees: EmployeeItem[];
    metrics: EmployeeMetric[];
}