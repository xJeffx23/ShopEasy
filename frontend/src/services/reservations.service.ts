import { reservacionesService } from './reservaciones.service';
import { ReservationsData, Reservation, ReservationStatus } from '@/src/types/reservation';

export async function getReservationsData(): Promise<ReservationsData> {
  try {
    const reservaciones = await reservacionesService.getAll();
    
    // Transformar los datos del backend al formato del frontend
    const reservations: Reservation[] = reservaciones.map(reservacion => ({
      id: reservacion.idReservacion.toString(),
      patientId: reservacion.Paciente_idPaciente.toString(),
      patientName: reservacion.Paciente?.Nombre || 'Paciente no encontrado',
      roomId: reservacion.Habitacion_idHabitacion.toString(),
      roomNumber: reservacion.Habitacion?.Numero_Habitacion || 'No asignada',
      roomType: 'Individual' as const, // TODO: Obtener desde tipo de habitación
      startDate: new Date(reservacion.Fecha_Inicio).toLocaleDateString('es-CR'),
      endDate: new Date(reservacion.Fecha_Fin).toLocaleDateString('es-CR'),
      indefinite: false, // TODO: Determinar desde lógica de negocio
      schedule: 'Full estancia' as const, // TODO: Obtener desde tipo de estancia
      status: mapReservationStatus(reservacion.idCatalogo_Estado_Reservacion),
      createdBy: 'Sistema', // TODO: Obtener desde empleado que creó
      observations: '' // TODO: Obtener desde campo de observaciones
    }));

    // Calcular estadísticas
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
    // Retornar datos vacíos en caso de error
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

function mapStatusToId(status: ReservationStatus): number {
  const mapping: Record<ReservationStatus, number> = {
    'activa': 1,
    'finalizada': 2,
    'cancelada': 3,
    'pendiente': 4
  };
  return mapping[status] || 4;
}

// CRUD Functions
export async function createReservation(reservationData: any): Promise<Reservation> {
  try {
    const backendData = {
      Paciente_idPaciente: parseInt(reservationData.patientId),
      Habitacion_idHabitacion: parseInt(reservationData.roomId),
      Fecha_Inicio: new Date(reservationData.startDate).toISOString(),
      Fecha_Fin: reservationData.endDate ? new Date(reservationData.endDate).toISOString() : null,
      idCatalogo_Estado_Reservacion: mapStatusToId(reservationData.status || 'pendiente'),
      Costo_Total: reservationData.totalCost || 0,
      Activo: true
    };
    
    const response = await reservacionesService.create(backendData);
    
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
    console.error('Error creating reservation:', error);
    throw error;
  }
}

export async function updateReservation(id: string, reservationData: any): Promise<Reservation> {
  try {
    const backendData = {
      Paciente_idPaciente: reservationData.patientId ? parseInt(reservationData.patientId) : undefined,
      Habitacion_idHabitacion: reservationData.roomId ? parseInt(reservationData.roomId) : undefined,
      Fecha_Inicio: reservationData.startDate ? new Date(reservationData.startDate).toISOString() : undefined,
      Fecha_Fin: reservationData.endDate ? new Date(reservationData.endDate).toISOString() : null,
      idCatalogo_Estado_Reservacion: reservationData.status ? mapStatusToId(reservationData.status) : undefined,
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
      idCatalogo_Estado_Reservacion: mapStatusToId(status),
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