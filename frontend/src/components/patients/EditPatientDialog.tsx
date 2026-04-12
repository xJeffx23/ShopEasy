"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { pacientesService } from "@/src/services/pacientes.service";
import { Paciente } from "@/src/services/pacientes.service";

interface EditPatientDialogProps {
  patient: Paciente;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPatientUpdated: () => void;
}

export default function EditPatientDialog({ patient, open, onOpenChange, onPatientUpdated }: EditPatientDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Nombre: "",
    Numero_Cedula: "",
    Fecha_Nacimiento: "",
    Telefono_Contacto_Emergencia: "",
    Nombre_Contacto_Emergencia: "",
    Catalogo_Nivel_Asistencia_idNivel: 1,
    Activo: true
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        Nombre: patient.Nombre || "",
        Numero_Cedula: patient.Numero_Cedula || "",
        Fecha_Nacimiento: patient.Fecha_Nacimiento ? new Date(patient.Fecha_Nacimiento).toISOString().split('T')[0] : "",
        Telefono_Contacto_Emergencia: patient.Telefono_Contacto_Emergencia || "",
        Nombre_Contacto_Emergencia: patient.Nombre_Contacto_Emergencia || "",
        Catalogo_Nivel_Asistencia_idNivel: patient.Catalogo_Nivel_Asistencia_idNivel || 1,
        Activo: patient.Activo !== undefined ? patient.Activo : true
      });
    }
  }, [patient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Catalogo_Nivel_Asistencia_idNivel' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pacientesService.update(patient.idPaciente, formData);
      onPatientUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating patient:", error);
      // Aquí podrías mostrar un mensaje de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
          <DialogDescription>
            Modifique los datos del paciente. Todos los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="Nombre">Nombre *</Label>
              <Input
                id="Nombre"
                name="Nombre"
                type="text"
                value={formData.Nombre}
                onChange={handleInputChange}
                placeholder="Nombre del paciente"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="Numero_Cedula">Cédula *</Label>
              <Input
                id="Numero_Cedula"
                name="Numero_Cedula"
                type="text"
                value={formData.Numero_Cedula}
                onChange={handleInputChange}
                placeholder="Número de cédula"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Fecha_Nacimiento">Fecha de Nacimiento *</Label>
              <Input
                id="Fecha_Nacimiento"
                name="Fecha_Nacimiento"
                type="date"
                value={formData.Fecha_Nacimiento}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Información de Contacto de Emergencia */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contacto de Emergencia</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="Telefono_Contacto_Emergencia">Teléfono de Emergencia *</Label>
                <Input
                  id="Telefono_Contacto_Emergencia"
                  name="Telefono_Contacto_Emergencia"
                  type="tel"
                  value={formData.Telefono_Contacto_Emergencia}
                  onChange={handleInputChange}
                  placeholder="Teléfono de emergencia"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="Nombre_Contacto_Emergencia">Nombre de Contacto de Emergencia *</Label>
                <Input
                  id="Nombre_Contacto_Emergencia"
                  name="Nombre_Contacto_Emergencia"
                  type="text"
                  value={formData.Nombre_Contacto_Emergencia}
                  onChange={handleInputChange}
                  placeholder="Nombre del contacto de emergencia"
                  required
                />
              </div>
            </div>
          </div>

          {/* Información Médica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Médica</h3>
            
            <div className="space-y-2">
              <Label htmlFor="Catalogo_Nivel_Asistencia_idNivel">Nivel de Asistencia *</Label>
              <select
                id="Catalogo_Nivel_Asistencia_idNivel"
                name="Catalogo_Nivel_Asistencia_idNivel"
                value={formData.Catalogo_Nivel_Asistencia_idNivel}
                onChange={handleInputChange}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={1}>Básica</option>
                <option value={2}>Intermedia</option>
                <option value={3}>Avanzada</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Actualizando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
