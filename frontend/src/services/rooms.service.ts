import { habitacionesService } from './habitaciones.service';
import { limpiezasService } from './limpiezas.service';
import { mantenimientosService } from './mantenimientos.service';
import { RoomsData, Room, RoomStatus, RoomType, RoomStats } from '@/src/types/room';

// Mapeos para convertir datos del formulario al formato del backend
function mapRoomTypeToId(type: RoomType): number {
  const typeMapping: Record<RoomType, number> = {
    'Individual': 1,
    'Compartida': 2,
    'Individual cama matrimonial': 3,
    'Cuidados especiales': 4
  };
  return typeMapping[type] || 1; // Default a Individual
}

function mapRoomStatusToId(status: RoomStatus): number {
  const statusMapping: Record<RoomStatus, number> = {
    'disponible': 1,
    'reservada': 2,
    'mantenimiento': 3,
    'cerrada': 4
  };
  return statusMapping[status] || 1; // Default a disponible
}

export async function getRoomsData(): Promise<RoomsData> {
  try {
    const habitaciones = await habitacionesService.getAll();
    
    // Obtener todos los registros de limpieza y mantenimiento
    const limpiezas = await limpiezasService.getAll();
    const mantenimientos = await mantenimientosService.getAll();
    
        
    // Transformar los datos del backend al formato del frontend
    const rooms: Room[] = habitaciones.map(habitacion => {
      // Usar el campo correcto: Catalogo_Estado_Habitacion_idEstado
      const statusId = habitacion.Catalogo_Estado_Habitacion_idEstado || habitacion.Estado?.idCatalogo_Estado_Habitacion;
      const mappedStatus = mapRoomStatus(statusId || 0);
      
      // Filtrar limpiezas y mantenimientos para esta habitación
      const roomLimpiezas = limpiezas
        .filter(limpieza => limpieza.Habitacion_idHabitacion === habitacion.idHabitacion)
        .map(limpieza => ({
          id: limpieza.idLimpieza_Habitacion.toString(),
          date: new Date(limpieza.Fecha_Limpieza).toLocaleDateString('es-ES'),
          employeeName: limpieza.Empleado?.Nombre || 'Empleado no asignado',
          notes: limpieza.Observaciones || undefined
        }));
      
      const roomMantenimientos = mantenimientos
        .filter(mantenimiento => mantenimiento.Habitacion_idHabitacion === habitacion.idHabitacion)
        .map(mantenimiento => ({
          id: mantenimiento.idMantenimiento_Habitacion.toString(),
          date: new Date(mantenimiento.Fecha_Mantenimiento).toLocaleDateString('es-ES'),
          repairDescription: mantenimiento.Descripcion_Reparacion,
          furnitureUpdate: !!mantenimiento.Actualizacion_Mobiliario,
          furnitureDetail: mantenimiento.Actualizacion_Mobiliario || undefined,
          recommendedRepairs: undefined, // Este campo no existe en la interfaz actual
          completed: mantenimiento.Completado,
          employeeName: mantenimiento.Empleado?.Nombre || 'Empleado no asignado'
        }));
      
            
      return {
        id: habitacion.idHabitacion.toString(),
        roomNumber: habitacion.Numero_Habitacion,
        type: mapRoomType(habitacion.Tipo?.Nombre_Tipo || 'Individual'),
        status: mappedStatus,
        capacity: habitacion.Capacidad,
        floor: habitacion.Piso,
        observations: habitacion.Observaciones || '',
        cleanings: roomLimpiezas,
        maintenances: roomMantenimientos
      };
    });

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

// Función para crear una nueva habitación
export async function createRoom(roomData: {
  roomNumber: string;
  floor: number;
  type: RoomType;
  capacity: number;
  status: RoomStatus;
  observations?: string;
}): Promise<Room> {
  try {
    // Mapear datos del formulario al formato del backend
    const backendData = {
      Numero_Habitacion: roomData.roomNumber,
      Piso: roomData.floor,
      Capacidad: roomData.capacity,
      Catalogo_Tipo_Habitacion_idTipo: mapRoomTypeToId(roomData.type),
      Catalogo_Estado_Habitacion_idEstado: mapRoomStatusToId(roomData.status),
      Observaciones: roomData.observations || undefined
    };

    // Llamar al backend
    const newHabitacion = await habitacionesService.create(backendData);

    // Convertir respuesta del backend al formato del frontend
    const newRoom: Room = {
      id: newHabitacion.idHabitacion.toString(),
      roomNumber: newHabitacion.Numero_Habitacion,
      type: mapRoomType(newHabitacion.Tipo?.Nombre_Tipo || roomData.type),
      status: mapRoomStatus(newHabitacion.Catalogo_Estado_Habitacion_idEstado),
      capacity: newHabitacion.Capacidad,
      floor: newHabitacion.Piso,
      observations: newHabitacion.Observaciones || '',
      cleanings: [],
      maintenances: []
    };

    return newRoom;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}

// Función para actualizar el estado de una habitación
export async function updateRoomStatus(id: string, status: RoomStatus): Promise<Room> {
  try {
    // Convertir id a número y status a ID del backend
    const roomId = parseInt(id);
    const statusId = mapRoomStatusToId(status);

    // Llamar al backend
    const updatedHabitacion = await habitacionesService.updateStatus(roomId, statusId);

    // Convertir respuesta del backend al formato del frontend
    const updatedRoom: Room = {
      id: updatedHabitacion.idHabitacion.toString(),
      roomNumber: updatedHabitacion.Numero_Habitacion,
      type: mapRoomType(updatedHabitacion.Tipo?.Nombre_Tipo || 'Individual'),
      status: mapRoomStatus(updatedHabitacion.Catalogo_Estado_Habitacion_idEstado),
      capacity: updatedHabitacion.Capacidad,
      floor: updatedHabitacion.Piso,
      observations: updatedHabitacion.Observaciones || '',
      cleanings: [],
      maintenances: []
    };

    return updatedRoom;
  } catch (error) {
    console.error('Error updating room status:', error);
    throw error;
  }
}

// Función para eliminar una habitación
export async function deleteRoom(id: string): Promise<void> {
  try {
    const roomId = parseInt(id);
    await habitacionesService.remove(roomId);
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
}

// Exportar funciones de mapeo para uso en otros componentes
export { mapRoomTypeToId, mapRoomStatusToId };
