import api from './api';

export interface LoginResponse {
  access_token: string;
  Cambio_Contrasena: boolean;
  perfil: string;
  nombre: string;
}

export interface LoginCredentials {
  Nombre_usuario: string;
  Contrasena: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Guardar el token en localStorage (solo en cliente)
    if (response.data.access_token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        perfil: response.data.perfil,
        nombre: response.data.nombre,
        cambioContrasena: response.data.Cambio_Contrasena
      }));
    }
    
    return response.data;
  },

  async loginPaciente(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login/paciente', credentials);
    
    // Guardar el token en localStorage (solo en cliente)
    if (response.data.access_token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        perfil: 'paciente',
        nombre: response.data.nombre,
        cambioContrasena: response.data.Cambio_Contrasena
      }));
    }
    
    return response.data;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  getUser(): any {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
};
