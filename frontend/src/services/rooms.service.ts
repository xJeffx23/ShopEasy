import { habitacionesService } from './habitaciones.service';
import { RoomsData, Room, RoomStatus, RoomType, RoomStats } from '@/src/types/room';

export async function getRoomsData(): Promise<RoomsData> {
  try {
    const habitaciones = await habitacionesService.getAll();
    
    // Transformar los datos del backend al formato del frontend
    const rooms: Room[] = habitaciones.map(habitacion => ({
      id: habitacion.idHabitacion.toString(),
      roomNumber: habitacion.Numero_Habitacion,
      type: mapRoomType(habitacion.Tipo_Habitacion?.Nombre_Tipo || 'Individual'),
      status: mapRoomStatus(habitacion.idCatalogo_Estado_Habitacion),
      capacity: habitacion.Capacidad_Maxima,
      floor: habitacion.Piso,
      observations: '',
      cleanings: [], // TODO: Obtener desde limpieza
      maintenances: [] // TODO: Obtener desde mantenimiento
    }));

    // Calcular estadísticas
    const stats: RoomStats = {
      available: rooms.filter(r => r.status === 'disponible').length,
      reserved: rooms.filter(r => r.status === 'reservada').length,
      maintenance: rooms.filter(r => r.status === 'mantenimiento').length,
      closed: rooms.filter(r => r.status === 'cerrada').length,
      total: rooms.length
    };

    return {
      title: "Gestión de Habitaciones",
      subtitle: "Administra el estado y disponibilidad de las habitaciones",
      rooms,
      stats
    };
  } catch (error) {
    console.error('Error fetching rooms:', error);
    // Retornar datos vacíos en caso de error
    return {
      title: "Gestión de Habitaciones",
      subtitle: "Administra el estado y disponibilidad de las habitaciones",
      rooms: [],
      stats: {
        available: 0,
        reserved: 0,
        maintenance: 0,
        closed: 0,
        total: 0
      }
    };
  }
}

function mapRoomType(typeName: string): RoomType {
  const mapping: Record<string, RoomType> = {
    'Habitación compartida': 'Compartida',
    'Habitación individual': 'Individual',
    'Habitación individual cama matrimonial': 'Individual cama matrimonial',
    'Habitación de cuidados especiales': 'Cuidados especiales'
  };
  return mapping[typeName] || 'Individual';
}

function mapRoomStatus(statusId: number): RoomStatus {
  const mapping: Record<number, RoomStatus> = {
    1: 'disponible',
    2: 'reservada',
    3: 'mantenimiento',
    4: 'cerrada'
  };
  return mapping[statusId] || 'mantenimiento';
}
