import { habitacionesService } from './habitaciones.service';

export interface RoomOption {
  label: string;
  value: string;
  id: number;
  numero: string;
  tipo: string;
  estado: string;
}

export async function getRoomsForSelect(): Promise<RoomOption[]> {
  try {
    const habitaciones = await habitacionesService.getAll();
    
    return habitaciones.map(habitacion => ({
      label: `${habitacion.Numero_Habitacion} - ${habitacion.Tipo?.Nombre_Tipo || 'Sin tipo'}`,
      value: habitacion.idHabitacion.toString(),
      id: habitacion.idHabitacion,
      numero: habitacion.Numero_Habitacion,
      tipo: habitacion.Tipo?.Nombre_Tipo || 'Sin tipo',
      estado: habitacion.Estado?.Descripcion_Estado || 'Sin estado'
    }));
  } catch (error) {
    console.error('Error loading rooms for select:', error);
    return [];
  }
}
