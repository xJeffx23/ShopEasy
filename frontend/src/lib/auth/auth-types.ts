// Roles reales del sistema según el enunciado
export type UserRole =
    | "Gerencia"
    | "Gestión de pacientes"
    | "Mantenimiento"
    | "Recepción";

export interface AuthUser {
    id: string;
    username: string;
    fullName: string;
    role: UserRole;
    email: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthSession {
    user: Omit<AuthUser, "password">;
    token: string;
    mustChangePassword: boolean; // flag del backend: Cambio_Contrasena
}

export interface LoginResult {
    success: boolean;
    message: string;
    session?: AuthSession;
    mustChangePassword?: boolean;
}

export interface ChangePasswordCredentials {
    username: string;
    oldPassword: string;
    newPassword: string;
}