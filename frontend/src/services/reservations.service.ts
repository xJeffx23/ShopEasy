import { reservacionesService } from './reservaciones.service';
import type { Reservation, ReservationStats, ReservationStatus, ReservationRoomType, StaySchedule, ReservationsData } from "@/src/types/reservation";

export async function getReservationsData(): Promise<ReservationsData> {
  try {
    const reservaciones = await reservacionesService.getAll();

    function mapStaySchedule(scheduleId: number): string {
      const scheduleMapping: Record<number, string> = {
        1: 'Día (8am - 5pm)',
        2: 'Mañana (8am - 2pm)',
        3: 'Tarde (2pm - 6pm)',
        4: 'Full estancia'
      };
      return scheduleMapping[scheduleId] || 'Full estancia';
    }

    function mapRoomTypeFromId(roomTypeId: number): string {
      const roomTypeMapping: Record<number, string> = {
        1: 'Compartida',
        2: 'Individual',
        3: 'Individual cama matrimonial',
        4: 'Cuidados especiales'
      };
      return roomTypeMapping[roomTypeId] || 'Individual';
    }

    const reservations: Reservation[] = reservaciones.map(reservacion => ({
      id: reservacion.idReservacion.toString(),
      patientId: reservacion.Paciente_idPaciente.toString(),
      patientName: reservacion.Paciente?.Nombre || 'Paciente no encontrado',
      roomId: reservacion.Habitacion_idHabitacion.toString(),
      roomNumber: reservacion.Habitacion?.Numero_Habitacion || 'No asignada',
      roomType: mapRoomTypeFromId(reservacion.Habitacion?.Tipo?.idCatalogo_Tipo_Habitacion || 1) as ReservationRoomType,
      startDate: new Date(reservacion.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: reservacion.Fecha_Fin ? new Date(reservacion.Fecha_Fin).toLocaleDateString('es-CR') : '',
      indefinite: reservacion.Indefinido || false,
      schedule: mapStaySchedule(reservacion.Catalogo_Tipo_Estancia_idEstancia || 4) as StaySchedule,
      status: reservacion.Estado?.Descripcion_Estado?.toLowerCase() as ReservationStatus || 'pendiente',
      createdBy: reservacion.Empleado_Registra?.Nombre || 'Sistema',
      observations: reservacion.Observaciones || ''
    }));

    const stats: ReservationStats = {
      active: reservations.filter(r => r.status === 'activa').length,
      permanent: reservations.filter(r => r.indefinite === true).length,
      respite: reservations.filter(r => r.indefinite === false).length
    };

    return {
      title: "Gestión de Reservaciones",
      subtitle: "Administra las reservaciones y ocupación de habitaciones",
      reservations,
      stats
    };
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return {
      title: "Gestión de Reservaciones",
      subtitle: "Administra las reservaciones y ocupación de habitaciones",
      reservations: [],
      stats: {
        active: 0,
        permanent: 0,
        respite: 0
      }
    };
  }
}

function mapReservationStatus(statusId: number): ReservationStatus {
  const mapping: Record<number, ReservationStatus> = {
    1: 'activa',
    2: 'finalizada',
    3: 'cancelada',
    4: 'pendiente'
  };
  return mapping[statusId] || 'pendiente';
}

function mapStatusToId(status: string): number {
  const mapping: { [key: string]: number } = {
    'activa': 1,
    '1': 1,
    'finalizada': 2,
    '2': 2,
    'cancelada': 3,
    '3': 3,
    'pendiente': 4,
    '4': 4
  };
  return mapping[status] || 4;
}

function mapRoomType(roomType: string): ReservationRoomType {
  return (roomType || 'Individual') as ReservationRoomType;
}

function mapStayType(stayTypeId: number): StaySchedule {
  const mapping: { [key: number]: StaySchedule } = {
    1: 'Día (8am - 5pm)',
    2: 'Mañana (8am - 2pm)',
    3: 'Tarde (2pm - 6pm)',
    4: 'Full estancia'
  };
  return mapping[stayTypeId] || 'Full estancia';
}

function mapStayTypeToId(schedule: StaySchedule | string): number {
  const mapping: Record<string, number> = {
    'Día (8am - 5pm)': 1,
    'Mañana (8am - 2pm)': 2,
    'Tarde (2pm - 6pm)': 3,
    'Full estancia': 4,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4
  };
  return mapping[schedule] || 4;
}

function parseLocalDate(dateString: string): Date {
  if (!dateString) {
    throw new Error('Fecha vacía');
  }
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (year < 1900 || year > 2100) {
      throw new Error(`Año inválido: ${year}`);
    }
    const date = new Date(year, month, day, 12, 0, 0);
    if (isNaN(date.getTime())) {
      throw new Error(`Fecha inválida: ${dateString}`);
    }
    return date;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Formato de fecha no reconocido: ${dateString}`);
  }
  return date;
}

function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}T12:00:00.000Z`;
}

export async function createReservation(reservationData: any): Promise<Reservation> {
  try {
    console.log('Raw reservation data:', reservationData);

    const startDate = parseLocalDate(reservationData.startDate);
    let endDate: Date | null = null;

    if (reservationData.endDate && reservationData.endDate !== '' && !reservationData.indefinite) {
      endDate = parseLocalDate(reservationData.endDate);
    }

    const now = new Date();

    const backendData = {
      Paciente_idPaciente: parseInt(reservationData.patientId),
      Habitacion_idHabitacion: parseInt(reservationData.roomId),
      Fecha_Inicio: toISODateString(startDate),
      Fecha_Fin: endDate ? toISODateString(endDate) : null,
      Fecha_Registro: now.toISOString(),
      Indefinido: reservationData.indefinite || false,
      Catalogo_Tipo_Estancia_idEstancia: parseInt(reservationData.stayType) || 4,
      Catalogo_Estado_Reservacion_idEstado: mapStatusToId(reservationData.status || 'activa'),
      Empleado_idEmpleado_Registra: reservationData.createdBy ? parseInt(reservationData.createdBy) : 1,
      Observaciones: reservationData.observations || null,
      Activo: true
    };

    console.log('Backend data to send:', backendData);

    const response = await reservacionesService.create(backendData as any);

    return {
      id: response.idReservacion.toString(),
      patientId: response.Paciente_idPaciente.toString(),
      patientName: response.Paciente?.Nombre || 'Paciente',
      roomId: response.Habitacion_idHabitacion.toString(),
      roomNumber: response.Habitacion?.Numero_Habitacion || 'No asignada',
      roomType: mapRoomType('Individual'),
      startDate: new Date(response.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: response.Fecha_Fin ? new Date(response.Fecha_Fin).toLocaleDateString('es-CR') : undefined,
      indefinite: response.Indefinido || !response.Fecha_Fin,
      schedule: mapStayType(response.Catalogo_Tipo_Estancia_idEstancia || 4),
      status: mapReservationStatus(response.Catalogo_Estado_Reservacion_idEstado || 1),
      createdBy: response.Empleado_Registra?.Nombre || 'Sistema',
      observations: response.Observaciones || ''
    };
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

export async function updateReservation(id: string, reservationData: any): Promise<Reservation> {
  try {
    const backendData: any = {
      Activo: true
    };

    if (reservationData.patientId) {
      backendData.Paciente_idPaciente = parseInt(reservationData.patientId);
    }
    if (reservationData.roomId) {
      backendData.Habitacion_idHabitacion = parseInt(reservationData.roomId);
    }
    if (reservationData.startDate) {
      const startDate = parseLocalDate(reservationData.startDate);
      backendData.Fecha_Inicio = toISODateString(startDate);
    }
    if (reservationData.endDate) {
      const endDate = parseLocalDate(reservationData.endDate);
      backendData.Fecha_Fin = toISODateString(endDate);
    } else if (reservationData.indefinite) {
      backendData.Fecha_Fin = null;
      backendData.Indefinido = true;
    }
    if (reservationData.schedule) {
      backendData.Catalogo_Tipo_Estancia_idEstancia = mapStayTypeToId(reservationData.schedule);
    }
    if (reservationData.status) {
      backendData.Catalogo_Estado_Reservacion_idEstado = mapStatusToId(reservationData.status);
    }
    if (reservationData.observations !== undefined) {
      backendData.Observaciones = reservationData.observations;
    }

    const response = await reservacionesService.update(parseInt(id), backendData);

    return {
      id: response.idReservacion.toString(),
      patientId: response.Paciente_idPaciente.toString(),
      patientName: response.Paciente?.Nombre || 'Paciente',
      roomId: response.Habitacion_idHabitacion.toString(),
      roomNumber: response.Habitacion?.Numero_Habitacion || 'No asignada',
      roomType: 'Individual' as const,
      startDate: new Date(response.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: response.Fecha_Fin ? new Date(response.Fecha_Fin).toLocaleDateString('es-CR') : undefined,
      indefinite: response.Indefinido || !response.Fecha_Fin,
      schedule: 'Full estancia' as const,
      status: mapReservationStatus(response.Catalogo_Estado_Reservacion_idEstado || 4),
      createdBy: 'Sistema',
      observations: response.Observaciones || ''
    };
  } catch (error) {
    console.error('Error updating reservation:', error);
    throw error;
  }
}

export async function deleteReservation(id: string): Promise<void> {
  try {
    await reservacionesService.delete(parseInt(id));
  } catch (error) {
    console.error('Error deleting reservation:', error);
    throw error;
  }
}

export async function updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
  try {
    const backendData = {
      Catalogo_Estado_Reservacion_idEstado: mapStatusToId(status),
      Activo: true
    };

    const response = await reservacionesService.update(parseInt(id), backendData);

    function mapRoomTypeFromId(roomTypeId: number): string {
      const roomTypeMapping: Record<number, string> = {
        1: 'Compartida',
        2: 'Individual',
        3: 'Individual cama matrimonial',
        4: 'Cuidados especiales'
      };
      return roomTypeMapping[roomTypeId] || 'Individual';
    }

    function mapStaySchedule(scheduleId: number): string {
      const scheduleMapping: Record<number, string> = {
        1: 'Día (8am - 5pm)',
        2: 'Mañana (8am - 2pm)',
        3: 'Tarde (2pm - 6pm)',
        4: 'Full estancia'
      };
      return scheduleMapping[scheduleId] || 'Full estancia';
    }

    return {
      id: response.idReservacion.toString(),
      patientId: response.Paciente_idPaciente.toString(),
      patientName: response.Paciente?.Nombre || 'Paciente',
      roomId: response.Habitacion_idHabitacion.toString(),
      roomNumber: response.Habitacion?.Numero_Habitacion || 'No asignada',
      roomType: mapRoomTypeFromId(response.Habitacion?.Tipo?.idCatalogo_Tipo_Habitacion || 1) as ReservationRoomType,
      startDate: new Date(response.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: response.Fecha_Fin ? new Date(response.Fecha_Fin).toLocaleDateString('es-CR') : '',
      indefinite: response.Indefinido || false,
      schedule: mapStaySchedule(response.Catalogo_Tipo_Estancia_idEstancia || 4) as StaySchedule,
      status: response.Estado?.Descripcion_Estado?.toLowerCase() as ReservationStatus || 'pendiente',
      createdBy: response.Empleado_Registra?.Nombre || 'Sistema',
      observations: response.Observaciones || ''
    };
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
}
