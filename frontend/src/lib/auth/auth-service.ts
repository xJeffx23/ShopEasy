import { MOCK_USERS } from "@/src/data/mock-users";
import { saveSession } from "./auth-storage";
import type {
    AuthSession,
    AuthUser,
    LoginCredentials,
    LoginResult,
} from "./auth-types";

function createMockToken(userId: string): string {
    return `mock-token-${userId}-${Date.now()}`;
}

function sanitizeUser(user: AuthUser): AuthSession["user"] {
    const { password, ...safeUser } = user;
    return safeUser;
}

export async function loginWithMock(
    credentials: LoginCredentials
): Promise<LoginResult> {
    const { username, password } = credentials;

    await new Promise((resolve) => setTimeout(resolve, 700));

    const user = MOCK_USERS.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return {
            success: false,
            message: "Usuario o contraseña incorrectos.",
        };
    }

    const session: AuthSession = {
        user: sanitizeUser(user),
        token: createMockToken(user.id),
    };

    saveSession(session);

    return {
        success: true,
        message: "Inicio de sesión exitoso.",
        session,
    };
}

export async function login(
    credentials: LoginCredentials
): Promise<LoginResult> {
    return loginWithMock(credentials);
}