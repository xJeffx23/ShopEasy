import { saveSession } from "./auth-storage";
import type {
  LoginCredentials,
  LoginResult,
  AuthSession,
  ChangePasswordCredentials,
} from "./auth-types";

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResult> {
  try {
    const res = await fetch("http://localhost:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Nombre_usuario: credentials.username,
        Contrasena: credentials.password,
      }),
    });

    if (!res.ok) {
      return { success: false, message: "Usuario o contraseña incorrectos." };
    }

    const data = (await res.json()) as {
      access_token: string;
      perfil: string;
      nombre: string;
      Cambio_Contrasena: boolean;
    };

    const session: AuthSession = {
      user: {
        id: credentials.username,
        username: credentials.username,
        fullName: data.nombre,
        role: data.perfil as AuthSession["user"]["role"],
        email: "",
      },
      token: data.access_token,
      mustChangePassword: data.Cambio_Contrasena,
    };

    saveSession(session);

    return {
      success: true,
      message: "Inicio de sesión exitoso.",
      session,
      mustChangePassword: data.Cambio_Contrasena,
    };
  } catch {
    return { success: false, message: "Error al conectar con el servidor." };
  }
}

/**
 * Cambia la contraseña del empleado en el primer login.
 * Backend: PATCH /api/auth/change-password
 */
export async function changePassword(
  credentials: ChangePasswordCredentials,
  token: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch("http://localhost:3001/api/auth/change-password", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        Nombre_usuario: credentials.username,
        Contrasena_actual: credentials.oldPassword,
        Contrasena_nueva: credentials.newPassword,
      }),
    });

    if (!res.ok) {
      return { success: false, message: "No se pudo cambiar la contraseña." };
    }

    return { success: true, message: "Contraseña actualizada correctamente." };
  } catch {
    return { success: false, message: "Error al conectar con el servidor." };
  }
}