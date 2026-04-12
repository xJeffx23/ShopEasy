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
      roomType: 'Individual' as const,
      startDate: new Date(reservacion.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: reservacion.Fecha_Fin ? new Date(reservacion.Fecha_Fin).toLocaleDateString('es-CR') : undefined,
      indefinite: !reservacion.Fecha_Fin,
      schedule: 'Full estancia' as const,
      status: mapReservationStatus(reservacion.idCatalogo_Estado_Reservacion),
      createdBy: 'Sistema',
      observations: ''
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
  return (roomType || 'Individual') as ReservationRoomType;
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
      Catalogo_Tipo_Estancia_idEstancia: parseInt(reservationData.stayType) || 4,
      Catalogo_Estado_Reservacion_idEstado: mapStatusToId(reservationData.status || 'pendiente'),
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
      roomType: mapRoomType('Individual'),
      startDate: new Date(response.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: response.Fecha_Fin ? new Date(response.Fecha_Fin).toLocaleDateString('es-CR') : undefined,
      indefinite: !response.Fecha_Fin,
      schedule: mapStayType(4),
      status: mapReservationStatus(4),
      createdBy: 'Sistema',
      observations: ''
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

    const backendData = {
      Paciente_idPaciente: reservationData.patientId ? parseInt(reservationData.patientId) : undefined,
      Habitacion_idHabitacion: reservationData.roomId ? parseInt(reservationData.roomId) : undefined,
      Fecha_Inicio: startDate ? startDate.toISOString() : undefined,
      Fecha_Fin: endDate ? endDate.toISOString() : null,
      Catalogo_Estado_Reservacion_idEstado: reservationData.status ? mapStatusToId(reservationData.status) : undefined,
      Costo_Total: reservationData.totalCost,
      Activo: true
    };

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
      indefinite: !response.Fecha_Fin,
      schedule: 'Full estancia' as const,
      status: mapReservationStatus(response.idCatalogo_Estado_Reservacion),
      createdBy: 'Sistema',
      observations: ''
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
      roomType: 'Individual' as const,
      startDate: new Date(response.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: response.Fecha_Fin ? new Date(response.Fecha_Fin).toLocaleDateString('es-CR') : undefined,
      indefinite: !response.Fecha_Fin,
      schedule: 'Full estancia' as const,
      status: mapReservationStatus(response.idCatalogo_Estado_Reservacion),
      createdBy: 'Sistema',
      observations: ''
    };
  } catch (error) {
    console.error('Error updating reservation status:', error);
    throw error;
  }
}