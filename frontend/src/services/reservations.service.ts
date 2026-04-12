import { reservacionesService } from './reservaciones.service';
import type { Reservation, ReservationStats, ReservationStatus, ReservationRoomType, StaySchedule, ReservationsData } from "@/types/reservation";

export async function getReservationsData(): Promise<ReservationsData> {
  try {
    const reservaciones = await reservacionesService.getAll();

    const reservations: Reservation[] = reservaciones.map(reservacion => ({
      id: reservacion.idReservacion.toString(),
      patientId: reservacion.Paciente_idPaciente.toString(),
      patientName: reservacion.Paciente?.Nombre || 'Paciente no encontrado',
      roomId: reservacion.Habitacion_idHabitacion.toString(),
      roomNumber: reservacion.Habitacion?.Numero_Habitacion || 'No asignada',
      roomType: mapRoomType(reservacion.Habitacion?.Tipo?.Nombre_Tipo || 'Individual'),
      startDate: new Date(reservacion.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: reservacion.Fecha_Fin ? new Date(reservacion.Fecha_Fin).toLocaleDateString('es-CR') : undefined,
      indefinite: reservacion.Indefinido || !reservacion.Fecha_Fin,
      schedule: mapStayType(reservacion.Catalogo_Tipo_Estancia_idEstancia),
      status: mapReservationStatus(reservacion.Catalogo_Estado_Reservacion_idEstado),
      createdBy: reservacion.Empleado?.Nombre || 'Sistema',
      observations: reservacion.Observaciones || ''
    }));

    const stats: ReservationStats = {
      active: reservations.filter(r => r.status === 'activa').length,
      permanent: reservations.filter(r => r.indefinite).length,
      respite: reservations.filter(r => !r.indefinite).length
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
      stats: { active: 0, permanent: 0, respite: 0 }
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
  const mapping: Record<string, number> = {
    'activa': 1,
    'finalizada': 2,
    'cancelada': 3,
    'pendiente': 4
  };
  return mapping[status] || 4;
}

function mapRoomType(roomType: string): ReservationRoomType {
  const mapping: Record<string, ReservationRoomType> = {
    'Habitación compartida': 'Compartida',
    'Habitación individual': 'Individual',
    'Habitación individual cama matrimonial': 'Individual cama matrimonial',
    'Habitación de cuidados especiales': 'Cuidados especiales'
  };
  return mapping[roomType] || 'Individual';
}

function mapStayType(stayTypeId: number): StaySchedule {
  const mapping: Record<number, StaySchedule> = {
    1: 'Día (8am - 5pm)',
    2: 'Mañana (8am - 2pm)',
    3: 'Tarde (2pm - 6pm)',
    4: 'Full estancia'
  };
  return mapping[stayTypeId] || 'Full estancia';
}

export async function createReservation(reservationData: any): Promise<Reservation> {
  try {
    const startDate = new Date(reservationData.startDate);
    const endDate = reservationData.endDate && reservationData.endDate !== '' ? new Date(reservationData.endDate) : null;

    if (isNaN(startDate.getTime())) {
      throw new Error('Fecha de inicio inválida');
    }

    const backendData = {
      Paciente_idPaciente: parseInt(reservationData.patientId),
      Habitacion_idHabitacion: parseInt(reservationData.roomId),
      Fecha_Inicio: startDate.toISOString(),
      Fecha_Fin: endDate && !isNaN(endDate.getTime()) ? endDate.toISOString() : null,
      Indefinido: !endDate,
      Observaciones: reservationData.observations || '',
      Catalogo_Tipo_Estancia_idEstancia: parseInt(reservationData.stayType) || 4,
      Catalogo_Estado_Reservacion_idEstado: mapStatusToId(reservationData.status || 'activa'),
      Empleado_idEmpleado_Registra: 1,
      Activo: true
    };

    const response = await reservacionesService.create(backendData);

    return {
      id: response.idReservacion.toString(),
      patientId: response.Paciente_idPaciente.toString(),
      patientName: response.Paciente?.Nombre || 'Paciente',
      roomId: response.Habitacion_idHabitacion.toString(),
      roomNumber: response.Habitacion?.Numero_Habitacion || 'No asignada',
      roomType: mapRoomType(response.Habitacion?.Tipo?.Nombre_Tipo || 'Individual'),
      startDate: new Date(response.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: response.Fecha_Fin ? new Date(response.Fecha_Fin).toLocaleDateString('es-CR') : undefined,
      indefinite: response.Indefinido || !response.Fecha_Fin,
      schedule: mapStayType(response.Catalogo_Tipo_Estancia_idEstancia),
      status: mapReservationStatus(response.Catalogo_Estado_Reservacion_idEstado),
      createdBy: response.Empleado?.Nombre || 'Sistema',
      observations: response.Observaciones || ''
    };
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
}

export async function updateReservation(id: string, reservationData: any): Promise<Reservation> {
  try {
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (reservationData.startDate) {
      startDate = new Date(reservationData.startDate);
      if (isNaN(startDate.getTime())) {
        throw new Error('Fecha de inicio inválida');
      }
    }

    if (reservationData.endDate) {
      endDate = new Date(reservationData.endDate);
      if (isNaN(endDate.getTime())) {
        throw new Error('Fecha de fin inválida');
      }
    }

    const backendData: any = {
      Activo: true
    };

    if (reservationData.patientId) {
      backendData.Paciente_idPaciente = parseInt(reservationData.patientId);
    }
    if (reservationData.roomId) {
      backendData.Habitacion_idHabitacion = parseInt(reservationData.roomId);
    }
    if (startDate) {
      backendData.Fecha_Inicio = startDate.toISOString();
    }
    if (endDate) {
      backendData.Fecha_Fin = endDate.toISOString();
      backendData.Indefinido = false;
    } else if (reservationData.indefinite) {
      backendData.Fecha_Fin = null;
      backendData.Indefinido = true;
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
      roomType: mapRoomType(response.Habitacion?.Tipo?.Nombre_Tipo || 'Individual'),
      startDate: new Date(response.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: response.Fecha_Fin ? new Date(response.Fecha_Fin).toLocaleDateString('es-CR') : undefined,
      indefinite: response.Indefinido || !response.Fecha_Fin,
      schedule: mapStayType(response.Catalogo_Tipo_Estancia_idEstancia),
      status: mapReservationStatus(response.Catalogo_Estado_Reservacion_idEstado),
      createdBy: response.Empleado?.Nombre || 'Sistema',
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

    return {
      id: response.idReservacion.toString(),
      patientId: response.Paciente_idPaciente.toString(),
      patientName: response.Paciente?.Nombre || 'Paciente',
      roomId: response.Habitacion_idHabitacion.toString(),
      roomNumber: response.Habitacion?.Numero_Habitacion || 'No asignada',
      roomType: mapRoomType(response.Habitacion?.Tipo?.Nombre_Tipo || 'Individual'),
      startDate: new Date(response.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: response.Fecha_Fin ? new Date(response.Fecha_Fin).toLocaleDateString('es-CR') : undefined,
      indefinite: response.Indefinido || !response.Fecha_Fin,
      schedule: mapStayType(response.Catalogo_Tipo_Estancia_idEstancia),
      status: mapReservationStatus(response.Catalogo_Estado_Reservacion_idEstado),
      createdBy: response.Empleado?.Nombre || 'Sistema',
      observations: response.Observaciones || ''
    };
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
}