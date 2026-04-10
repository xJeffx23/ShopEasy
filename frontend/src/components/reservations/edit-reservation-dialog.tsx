"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import FilterCombobox from "@/src/components/ui/filter-combobox";
import { Reservation, ReservationStatus, StaySchedule } from "@/src/types/reservation";
import { getPatientsForSelect } from "@/src/services/patients-select.service";
import { getRoomsForSelect } from "@/src/services/rooms-select.service";
import { getEmployeesForSelect } from "@/src/services/employees-select.service";
import { updateReservation } from "@/src/services/reservations.service";

interface EditReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
  onReservationUpdated: (updatedReservation: Reservation) => void;
}

export function EditReservationDialog({ 
  open, 
  onOpenChange, 
  reservation, 
  onReservationUpdated 
}: EditReservationDialogProps) {
  // Estados para los ComboBox
  const [patients, setPatients] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  // Estado del formulario
  const [form, setForm] = useState({
    patientId: "",
    roomId: "",
    startDate: "",
    endDate: "",
    indefinite: false,
    schedule: "Full estancia" as StaySchedule,
    status: "pendiente" as ReservationStatus,
    observations: ""
  });

  // Estado de errores
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos para los ComboBox cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      getPatientsForSelect().then(setPatients);
      getRoomsForSelect().then(setRooms);
      getEmployeesForSelect().then(setEmployees);
    }
  }, [open]);

  // Función para convertir DD/MM/YYYY a yyyy-MM-dd para inputs de tipo date
  function convertToInputFormat(dateString: string): string {
    if (!dateString) return "";
    const [day, month, year] = dateString.split('/');
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return "";
  }

  // Precargar formulario cuando hay una reservación seleccionada
  useEffect(() => {
    if (reservation && open) {
      setForm({
        patientId: reservation.patientId,
        roomId: reservation.roomId,
        startDate: convertToInputFormat(reservation.startDate),
        endDate: convertToInputFormat(reservation.endDate || ""),
        indefinite: reservation.indefinite,
        schedule: reservation.schedule,
        status: reservation.status,
        observations: reservation.observations || ""
      });
      setErrors({});
    }
  }, [reservation, open]);

  // Función para actualizar el formulario
  const set = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
  };

  // Validar formulario
  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.patientId || form.patientId === "all") e.patientId = "Requerido.";
    if (!form.roomId || form.roomId === "all") e.roomId = "Requerido.";
    if (!form.startDate) e.startDate = "Requerido.";
    if (!form.indefinite && !form.endDate) e.endDate = "Requerido o marcar indefinida.";
    if (!form.schedule) e.schedule = "Requerido.";
    if (!form.status) e.status = "Requerido.";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Manejar envío del formulario
  async function handleSubmit() {
    if (!validate()) return;
    if (!reservation) return;

    setIsLoading(true);
    try {
      const updatedReservation = await updateReservation(reservation.id, form);
      onReservationUpdated(updatedReservation);
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating reservation:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Opciones para los ComboBox
  const patientOptions = [
    { label: "Seleccione un paciente", value: "all" },
    ...patients.map(p => ({ label: p.label, value: p.value }))
  ];

  const roomOptions = [
    { label: "Seleccione una habitación", value: "all" },
    ...rooms.map(r => ({ label: r.label, value: r.value }))
  ];

  const scheduleOptions = [
    { label: "Seleccione horario", value: "all" },
    { label: "Día (8am - 5pm)", value: "Día (8am - 5pm)" },
    { label: "Mañana (8am - 2pm)", value: "Mañana (8am - 2pm)" },
    { label: "Tarde (2pm - 6pm)", value: "Tarde (2pm - 6pm)" },
    { label: "Full estancia", value: "Full estancia" }
  ];

  const statusOptions = [
    { label: "Seleccione estado", value: "all" },
    { label: "activa", value: "activa" },
    { label: "pendiente", value: "pendiente" },
    { label: "finalizada", value: "finalizada" },
    { label: "cancelada", value: "cancelada" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Reservación</DialogTitle>
          <DialogDescription>
            Modifica los datos de la reservación seleccionada. Todos los campos marcados como requeridos deben ser completados.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {/* Paciente */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Paciente
            </Label>
            <FilterCombobox
              value={form.patientId}
              onChange={(value) => set("patientId", value)}
              options={patientOptions}
              placeholder="Buscar paciente..."
              searchPlaceholder="Buscar por nombre o cédula..."
              emptyMessage="No se encontraron pacientes."
            />
            {errors.patientId && <p className="text-[11px] text-red-500">{errors.patientId}</p>}
          </div>

          {/* Habitación */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Habitación
            </Label>
            <FilterCombobox
              value={form.roomId}
              onChange={(value) => set("roomId", value)}
              options={roomOptions}
              placeholder="Buscar habitación..."
              searchPlaceholder="Buscar por número o tipo..."
              emptyMessage="No se encontraron habitaciones."
            />
            {errors.roomId && <p className="text-[11px] text-red-500">{errors.roomId}</p>}
          </div>

          {/* Fecha de inicio */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Fecha de inicio
            </Label>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className="text-sm"
            />
            {errors.startDate && <p className="text-[11px] text-red-500">{errors.startDate}</p>}
          </div>

          {/* Fecha de fin */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Fecha de fin
            </Label>
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => set("endDate", e.target.value)}
              disabled={form.indefinite}
              className="text-sm"
            />
            {errors.endDate && <p className="text-[11px] text-red-500">{errors.endDate}</p>}
          </div>

          {/* Indefinido */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Estancia indefinida
            </Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="indefinite"
                checked={form.indefinite}
                onChange={(e) => {
                  set("indefinite", e.target.checked);
                  if (e.target.checked) {
                    set("endDate", "");
                  }
                }}
                className="rounded"
              />
              <label htmlFor="indefinite" className="text-sm">
                Marcar si no tiene fecha de fin definida
              </label>
            </div>
          </div>

          {/* Horario */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Horario
            </Label>
            <FilterCombobox
              value={form.schedule}
              onChange={(value) => set("schedule", value as StaySchedule)}
              options={scheduleOptions}
              placeholder="Seleccionar horario..."
              emptyMessage="No se encontraron horarios."
            />
            {errors.schedule && <p className="text-[11px] text-red-500">{errors.schedule}</p>}
          </div>

          {/* Estado */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Estado
            </Label>
            <FilterCombobox
              value={form.status}
              onChange={(value) => set("status", value as ReservationStatus)}
              options={statusOptions}
              placeholder="Seleccionar estado..."
              emptyMessage="No se encontraron estados."
            />
            {errors.status && <p className="text-[11px] text-red-500">{errors.status}</p>}
          </div>

          {/* Observaciones */}
          <div className="space-y-1 md:col-span-2">
            <Label className="text-xs font-medium text-slate-600">
              Observaciones
            </Label>
            <textarea
              value={form.observations}
              onChange={(e) => set("observations", e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-md text-sm resize-none"
              placeholder="Notas adicionales sobre la reservación..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
