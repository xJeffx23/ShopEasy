import { limpiezasService, Limpieza } from './limpiezas.service';
import { mantenimientosService, Mantenimiento } from './mantenimientos.service';
import { empleadosService } from './empleados.service';
import { Room, RoomCleaning, RoomMaintenance } from '@/src/types/room';

// Función para convertir fecha de DD/MM/YYYY a YYYY-MM-DD
function convertDateToISO(dateString: string): string {
  if (!dateString) return '';
  const [day, month, year] = dateString.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Función para convertir fecha de ISO a DD/MM/YYYY
function convertDateFromISO(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// Mapear limpieza de backend a frontend
function mapLimpiezaToRoomCleaning(limpieza: Limpieza): RoomCleaning {
  return {
    id: limpieza.idLimpieza_Habitacion.toString(),
    date: convertDateFromISO(limpieza.Fecha_Limpieza),
    employeeName: limpieza.Empleado?.Nombre || 'Empleado desconocido',
    notes: limpieza.Observaciones || undefined,
  };
}

// Mapear mantenimiento de backend a frontend
function mapMantenimientoToRoomMaintenance(mantenimiento: Mantenimiento): RoomMaintenance {
  return {
    id: mantenimiento.idMantenimiento_Habitacion.toString(),
    date: convertDateFromISO(mantenimiento.Fecha_Mantenimiento),
    repairDescription: mantenimiento.Descripcion_Reparacion,
    furnitureUpdate: !!mantenimiento.Actualizacion_Mobiliario,
    furnitureDetail: mantenimiento.Actualizacion_Mobiliario || undefined,
    recommendedRepairs: undefined, // Este campo no existe en la BD
    completed: mantenimiento.Completado,
    employeeName: mantenimiento.Empleado?.Nombre || 'Empleado desconocido',
  };
}

// Servicio para operaciones de limpieza en habitaciones
export const roomCleaningService = {
  async getRoomCleanings(roomId: string): Promise<RoomCleaning[]> {
    try {
      const limpiezas = await limpiezasService.getByRoom(parseInt(roomId));
      return limpiezas.map(mapLimpiezaToRoomCleaning);
    } catch (error) {
      console.error('Error fetching room cleanings:', error);
      throw error;
    }
  },

  async addRoomCleaning(roomId: string, cleaning: Omit<RoomCleaning, 'id'> & { employeeId: number | null }): Promise<RoomCleaning> {
    try {
      // Validar que se haya seleccionado un empleado
      if (!cleaning.employeeId) {
        throw new Error('Debe seleccionar un empleado válido');
      }

      const backendData = {
        Fecha_Limpieza: convertDateToISO(cleaning.date),
        Observaciones: cleaning.notes || undefined,
        Habitacion_idHabitacion: parseInt(roomId),
        Empleado_idEmpleado: cleaning.employeeId,
      };

      const result = await limpiezasService.create(backendData);
      return mapLimpiezaToRoomCleaning(result);
    } catch (error) {
      console.error('Error adding room cleaning:', error);
      throw error;
    }
  },

  async updateRoomCleaning(id: string, cleaning: Partial<RoomCleaning>): Promise<RoomCleaning> {
    try {
      const backendData: any = {};
      
      if (cleaning.date) {
        backendData.Fecha_Limpieza = convertDateToISO(cleaning.date);
      }
      
      if (cleaning.notes !== undefined) {
        backendData.Observaciones = cleaning.notes || undefined;
      }

      if (cleaning.employeeName) {
        const employees = await employeesService.getAll();
        const employee = employees.find(emp => emp.Nombre === cleaning.employeeName);
        
        if (!employee) {
          throw new Error(`Empleado no encontrado: ${cleaning.employeeName}`);
        }
        
        backendData.Empleado_idEmpleado = employee.idEmpleado;
      }

      const result = await limpiezasService.update(parseInt(id), backendData);
      return mapLimpiezaToRoomCleaning(result);
    } catch (error) {
      console.error('Error updating room cleaning:', error);
      throw error;
    }
  },

  async deleteRoomCleaning(id: string): Promise<void> {
    try {
      await limpiezasService.delete(parseInt(id));
    } catch (error) {
      console.error('Error deleting room cleaning:', error);
      throw error;
    }
  },
};

// Servicio para operaciones de mantenimiento en habitaciones
export const roomMaintenanceService = {
  async getRoomMaintenances(roomId: string): Promise<RoomMaintenance[]> {
    try {
      const mantenimientos = await mantenimientosService.getByRoom(parseInt(roomId));
      return mantenimientos.map(mapMantenimientoToRoomMaintenance);
    } catch (error) {
      console.error('Error fetching room maintenances:', error);
      throw error;
    }
  },

  async addRoomMaintenance(roomId: string, maintenance: Omit<RoomMaintenance, 'id'> & { employeeId: number | null }): Promise<RoomMaintenance> {
    try {
      // Validar que se haya seleccionado un empleado
      if (!maintenance.employeeId) {
        throw new Error('Debe seleccionar un empleado válido');
      }

      const backendData = {
        Fecha_Mantenimiento: convertDateToISO(maintenance.date),
        Descripcion_Reparacion: maintenance.repairDescription,
        Actualizacion_Mobiliario: maintenance.furnitureUpdate ? maintenance.furnitureDetail || 'Sí' : null,
        Completado: maintenance.completed,
        Habitacion_idHabitacion: parseInt(roomId),
        Empleado_idEmpleado: maintenance.employeeId,
      };

      const result = await mantenimientosService.create(backendData);
      return mapMantenimientoToRoomMaintenance(result);
    } catch (error) {
      console.error('Error adding room maintenance:', error);
      throw error;
    }
  },

  async updateRoomMaintenance(id: string, maintenance: Partial<RoomMaintenance>): Promise<RoomMaintenance> {
    try {
      const backendData: any = {};
      
      if (maintenance.date) {
        backendData.Fecha_Mantenimiento = convertDateToISO(maintenance.date);
      }
      
      if (maintenance.repairDescription) {
        backendData.Descripcion_Reparacion = maintenance.repairDescription;
      }
      
      if (maintenance.furnitureUpdate !== undefined) {
        backendData.Actualizacion_Mobiliario = maintenance.furnitureUpdate ? maintenance.furnitureDetail || 'Sí' : null;
      }
      
      if (maintenance.completed !== undefined) {
        backendData.Completado = maintenance.completed;
      }

      if (maintenance.employeeName) {
        const employees = await employeesService.getAll();
        const employee = employees.find(emp => emp.Nombre === maintenance.employeeName);
        
        if (!employee) {
          throw new Error(`Empleado no encontrado: ${maintenance.employeeName}`);
        }
        
        backendData.Empleado_idEmpleado = employee.idEmpleado;
      }

      const result = await mantenimientosService.update(parseInt(id), backendData);
      return mapMantenimientoToRoomMaintenance(result);
    } catch (error) {
      console.error('Error updating room maintenance:', error);
      throw error;
    }
  },

  async deleteRoomMaintenance(id: string): Promise<void> {
    try {
      await mantenimientosService.delete(parseInt(id));
    } catch (error) {
      console.error('Error deleting room maintenance:', error);
      throw error;
    }
  },
};
