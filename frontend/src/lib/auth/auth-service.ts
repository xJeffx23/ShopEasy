import { saveSession } from "./auth-storage";
import type { LoginCredentials, LoginResult, AuthSession } from "./auth-types";

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
    };

    saveSession(session);
    return { success: true, message: "Inicio de sesión exitoso.", session };
  } catch {
    return { success: false, message: "Error al conectar con el servidor." };
  }
}
