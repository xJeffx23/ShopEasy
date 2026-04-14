import api from './api';

interface LoginResponse {
  access_token: string;
  perfil: string;
  nombre: string;
  Cambio_Contrasena: boolean;
}

interface LoginCredentials {
  Nombre_usuario: string;
  Contrasena: string;
}

// Definición de permisos por perfil según requisitos del proyecto
// - Gerencia: Empleados, Pacientes, Habitaciones, Reservas, Reportes (acceso total)
// - Gestión de Pacientes: Pacientes, Habitaciones
// - Mantenimiento: Solo Habitaciones
// - Recepción: Pacientes (para registrar), Reservas
const PERMISOS_POR_PERFIL: Record<string, string[]> = {
  'Gerencia': ['dashboard', 'employees', 'patients', 'rooms', 'reservations', 'reports'],
  'Gestión de Pacientes': ['dashboard', 'patients', 'rooms'],
  'Mantenimiento': ['dashboard', 'rooms'],
  'Recepción': ['dashboard', 'patients', 'reservations'],
};

// Mapeo de rutas a módulos
const RUTA_A_MODULO: Record<string, string> = {
  '/sistema/dashboard': 'dashboard',
  '/sistema/employees': 'employees',
  '/sistema/patients': 'patients',
  '/sistema/rooms': 'rooms',
  '/sistema/reservations': 'reservations',
  '/sistema/reports': 'reports',
  '/sistema/settings': 'settings',
  '/sistema/help': 'help',
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
      localStorage.setItem('userType', 'empleado');
    }
    return response.data;
  },

  async loginPaciente(credentials: LoginCredentials): Promise<any> {
    const response = await api.post<any>('/auth/login/paciente', credentials);
    if (response.data.access_token && typeof window !== 'undefined') {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify({
        perfil: 'paciente',
        nombre: response.data.nombre,
        idPaciente: response.data.idPaciente
      }));
      localStorage.setItem('userType', 'paciente');
    }
    return response.data;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      const userType = localStorage.getItem('userType');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      
      if (userType === 'paciente') {
        window.location.href = '/auth/login-paciente';
      } else {
        window.location.href = '/auth/login';
      }
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  getUser(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  getUserType(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userType');
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  tieneAcceso(modulo: string): boolean {
    const user = this.getUser();
    if (!user || !user.perfil) return false;

    // Módulos de acceso universal
    if (['settings', 'help', 'dashboard'].includes(modulo)) return true;

    const permisos = PERMISOS_POR_PERFIL[user.perfil];
    if (!permisos) return false;

    return permisos.includes(modulo);
  },

  puedeAccederRuta(ruta: string): boolean {
    const rutaBase = '/' + ruta.split('/').slice(1, 3).join('/');
    const modulo = RUTA_A_MODULO[rutaBase];
    if (!modulo) return true;
    return this.tieneAcceso(modulo);
  },

  getModulosPermitidos(): string[] {
    const user = this.getUser();
    if (!user || !user.perfil) return [];
    return PERMISOS_POR_PERFIL[user.perfil] || [];
  },

  canCreateAdmission(): boolean {
    const user = this.getUser();
    if (!user || !user.perfil) return false;
    const allowedRoles = ['Recepción', 'Gerencia'];
    return allowedRoles.includes(user.perfil);
  },

  debeCambiarContrasena(): boolean {
    const user = this.getUser();
    return user?.cambioContrasena === true;
  },

  async cambiarContrasena(contrasenaActual: string, nuevaContrasena: string): Promise<void> {
    await api.post('/auth/change-password', {
      currentPassword: contrasenaActual,
      newPassword: nuevaContrasena
    });
    
    const user = this.getUser();
    if (user) {
      user.cambioContrasena = false;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }
};
