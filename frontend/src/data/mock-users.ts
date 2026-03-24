import type { AuthUser } from "@/src/lib/auth/auth-types";

export const MOCK_USERS: AuthUser[] = [
    {
        id: "1",
        username: "admin",
        password: "admin",
        fullName: "Administrador General",
        role: "admin",
        email: "admin@shopeasy.com",
    },
];