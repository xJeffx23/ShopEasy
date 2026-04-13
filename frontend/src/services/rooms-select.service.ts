import api from './api';

interface HabitacionDisponibilidad {
  idHabitacion: number;
  numeroHabitacion: string;
  piso: number;
  tipo: string;
  tipoId: number;
  costoPorDia: number;
  capacidad: number;
  ocupacionActual: number;
  espaciosDisponibles: number;
  disponible: boolean;
  estadoId: number;
  estado: string;
  pacientesActuales: Array<{ id: number; nombre: string }>;
}

/**
 * Obtiene las habitaciones con información de disponibilidad
 * para usar en el selector de reservaciones
 */
export async function getRoomsForSelect(): Promise<Array<{
  label: string;
  value: string;
  disabled: boolean;
  disponibilidad: HabitacionDisponibilidad;
}>> {
  try {
    const response = await api.get<HabitacionDisponibilidad[]>('/reservaciones/disponibilidad');
    const habitaciones = response.data;

    return habitaciones.map(hab => {
      // Construir label descriptivo
      let label = `${hab.numeroHabitacion} - ${hab.tipo}`;

      if (hab.capacidad > 1) {
        // Habitación compartida: mostrar ocupación
        label += ` (${hab.ocupacionActual}/${hab.capacidad} ocupado)`;
      }

      if (!hab.disponible) {
        if (hab.estadoId === 3) {
          label += ' - En mantenimiento';
        } else if (hab.estadoId === 4) {
          label += ' - Cerrada';
        } else if (hab.ocupacionActual >= hab.capacidad) {
          label += ' - Llena';
        }
      }

      return {
        label,
        value: hab.idHabitacion.toString(),
        disabled: !hab.disponible,
        disponibilidad: hab
      };
    });
  } catch (error) {
    console.error('Error fetching rooms for select:', error);
    return [];
  }
}

/**
 * Verifica la disponibilidad de una habitación específica
 */
export async function checkRoomAvailability(habitacionId: number): Promise<HabitacionDisponibilidad | null> {
  try {
    const response = await api.get<HabitacionDisponibilidad>(`/reservaciones/disponibilidad/${habitacionId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking room availability:', error);
    return null;
  }
}