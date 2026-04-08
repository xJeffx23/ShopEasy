import type { AuthSession } from "./auth-types";

const AUTH_STORAGE_KEY = "patitos_session";

export function saveSession(session: AuthSession) {
    if (typeof window === "undefined") return;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthSession;
    } catch {
        return null;
    }
}

export function clearSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(AUTH_STORAGE_KEY);
}

/** Marca en la sesión que el cambio de contraseña ya fue completado */
export function markPasswordChanged() {
    const session = getSession();
    if (!session) return;
    session.mustChangePassword = false;
    saveSession(session);
}