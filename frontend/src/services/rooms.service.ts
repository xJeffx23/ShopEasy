import { habitacionesService } from './habitaciones.service';
import { RoomsData, Room, RoomStatus, RoomType, RoomStats } from '@/types/room';

export async function getRoomsData(): Promise<RoomsData> {
  try {
    const habitaciones = await habitacionesService.getAll();

    const rooms: Room[] = habitaciones.map(habitacion => ({
      id: habitacion.idHabitacion.toString(),
      roomNumber: habitacion.Numero_Habitacion,
      type: mapRoomType(habitacion.Tipo_Habitacion?.Nombre_Tipo || 'Individual'),
      status: mapRoomStatus(habitacion.idCatalogo_Estado_Habitacion),
      capacity: habitacion.Capacidad_Maxima,
      floor: habitacion.Piso,
      observations: '',
      cleanings: [],
      maintenances: []
    }));

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
    return {
      title: "Gestión de Habitaciones",
      subtitle: "Administra el estado y disponibilidad de las habitaciones",
      rooms: [],
      stats: { available: 0, reserved: 0, maintenance: 0, closed: 0, total: 0 }
    };
  }
}

export async function createRoom(roomData: any): Promise<Room> {
  const backendData = {
    Numero_Habitacion: roomData.roomNumber,
    idCatalogo_Tipo_Habitacion: mapRoomTypeToId(roomData.type),
    idCatalogo_Estado_Habitacion: mapRoomStatusToId(roomData.status || 'disponible'),
    Piso: roomData.floor || 1,
    Capacidad_Maxima: roomData.capacity || 1,
    Activo: true
  };

  const response = await habitacionesService.create(backendData as any);

  return {
    id: response.idHabitacion.toString(),
    roomNumber: response.Numero_Habitacion,
    type: mapRoomType(response.Tipo_Habitacion?.Nombre_Tipo || 'Individual'),
    status: mapRoomStatus(response.idCatalogo_Estado_Habitacion),
    capacity: response.Capacidad_Maxima,
    floor: response.Piso,
    observations: '',
    cleanings: [],
    maintenances: []
  };
}

export async function updateRoomStatus(id: string, status: RoomStatus): Promise<Room> {
  const backendData = {
    idCatalogo_Estado_Habitacion: mapRoomStatusToId(status)
  };

  const response = await habitacionesService.update(parseInt(id), backendData);

  return {
    id: response.idHabitacion.toString(),
    roomNumber: response.Numero_Habitacion,
    type: mapRoomType(response.Tipo_Habitacion?.Nombre_Tipo || 'Individual'),
    status: mapRoomStatus(response.idCatalogo_Estado_Habitacion),
    capacity: response.Capacidad_Maxima,
    floor: response.Piso,
    observations: '',
    cleanings: [],
    maintenances: []
  };
}

export async function deleteRoom(id: string): Promise<void> {
  await habitacionesService.delete(parseInt(id));
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

function mapRoomTypeToId(type: string): number {
  const mapping: Record<string, number> = {
    'Compartida': 1,
    'Individual': 2,
    'Individual cama matrimonial': 3,
    'Cuidados especiales': 4
  };
  return mapping[type] || 2;
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

function mapRoomStatusToId(status: string): number {
  const mapping: Record<string, number> = {
    'disponible': 1,
    'reservada': 2,
    'mantenimiento': 3,
    'cerrada': 4
  };
  return mapping[status] || 1;
}