export type UserRole = "admin" | "doctor" | "receptionist";

export interface AuthUser {
    id: string;
    username: string;
    password: string;
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
}

export interface LoginResult {
    success: boolean;
    message: string;
    session?: AuthSession;
}