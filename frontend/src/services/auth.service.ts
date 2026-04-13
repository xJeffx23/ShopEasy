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

// Definición de permisos por perfil según requisitos del proyecto
const PERMISOS_POR_PERFIL: Record<string, string[]> = {
  'Gerencia': ['dashboard', 'employees', 'patients', 'rooms', 'reservations', 'reports'],
  'Gestión de Pacientes': ['dashboard', 'patients', 'rooms', 'reports'],
  'Mantenimiento': ['dashboard', 'rooms'],
  'Recepción': ['dashboard', 'reservations', 'reports'],
};

// Mapeo de rutas a módulos
const RUTA_A_MODULO: Record<string, string> = {
  '/sistema/dashboard': 'dashboard',
  '/sistema/employees': 'employees',
  '/sistema/patients': 'patients',
  '/sistema/rooms': 'rooms',
  '/sistema/reservations': 'reservations',
  '/sistema/reports': 'reports',
  '/sistema/settings': 'settings', // Todos tienen acceso
  '/sistema/help': 'help', // Todos tienen acceso
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);

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

  getUser(): { perfil: string; nombre: string; cambioContrasena: boolean } | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  getPerfil(): string | null {
    const user = this.getUser();
    return user?.perfil || null;
  },

  // Verificar si el usuario tiene acceso a un módulo específico
  tieneAcceso(modulo: string): boolean {
    const user = this.getUser();
    if (!user || !user.perfil) return false;

    // Módulos de acceso universal
    if (['settings', 'help', 'dashboard'].includes(modulo)) return true;

    const permisos = PERMISOS_POR_PERFIL[user.perfil];
    if (!permisos) return false;

    return permisos.includes(modulo);
  },

  // Verificar si el usuario puede acceder a una ruta
  puedeAccederRuta(ruta: string): boolean {
    // Extraer la ruta base (sin parámetros adicionales)
    const rutaBase = '/' + ruta.split('/').slice(1, 3).join('/');
    const modulo = RUTA_A_MODULO[rutaBase];

    if (!modulo) return true; // Rutas no mapeadas son accesibles

    return this.tieneAcceso(modulo);
  },

  // Obtener los módulos permitidos para el usuario actual
  getModulosPermitidos(): string[] {
    const user = this.getUser();
    if (!user || !user.perfil) return [];

    return PERMISOS_POR_PERFIL[user.perfil] || [];
  },

  // Verificar si el usuario tiene permiso para crear admisiones
  canCreateAdmission(): boolean {
    const user = this.getUser();
    if (!user || !user.perfil) return false;

    const allowedRoles = ['Recepción', 'Gestión de Pacientes', 'Gerencia'];
    return allowedRoles.includes(user.perfil);
  },

  // Verificar si debe cambiar contraseña
  debeCambiarContrasena(): boolean {
    const user = this.getUser();
    return user?.cambioContrasena === true;
  }
};