"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/src/components/ui/dialog";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import FilterCombobox from "@/src/components/ui/filter-combobox";
import type { EmployeeItem, EmployeeStatus } from "@/src/types/employee";
import { updateEmployee } from "@/src/services/employees.service";

// Opciones para los ComboBox
const departmentOptions = [
  { label: "Seleccione un departamento", value: "all" },
  { label: "Administrativo", value: "Administrativo" },
  { label: "Gerencia", value: "Gerencia" },
  { label: "DTI", value: "DTI" },
  { label: "Financiero", value: "Financiero" },
];

const profileOptions = [
  { label: "Seleccione un rol", value: "all" },
  { label: "Gerente", value: "Gerente" },
  { label: "Administrativo", value: "Administrativo" },
  { label: "Técnico", value: "Técnico" },
  { label: "Recepcionista", value: "Recepcionista" },
];

const statusOptions = [
  { label: "Seleccionar estado", value: "all" },
  { label: "Activo", value: "activo" },
  { label: "Inactivo", value: "inactivo" },
];

// Props del componente
interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: EmployeeItem | null;
  onEmployeeUpdated: (employee: EmployeeItem) => void;
}

// Form values
interface EmployeeFormValues {
  fullName: string;
  idNumber: string;
  phone: string;
  email: string;
  department: string;
  role: string;
  status: string;
}

// Valores iniciales
const initialValues: EmployeeFormValues = {
  fullName: "",
  idNumber: "",
  phone: "",
  email: "",
  department: "",
  role: "",
  status: "",
};

// Componente principal
export function EditEmployeeDialog({
  open,
  onOpenChange,
  employee,
  onEmployeeUpdated,
}: EditEmployeeDialogProps) {
  const [form, setForm] = useState<EmployeeFormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Función para actualizar el formulario
  function set<K extends keyof EmployeeFormValues>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: "" }));
    }
  }

  // Validación del formulario
  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.fullName || form.fullName === "all") e.fullName = "Requerido.";
    if (!form.idNumber) e.idNumber = "Requerido.";
    if (!form.phone) e.phone = "Requerido.";
    if (!form.email) e.email = "Requerido.";
    if (!form.department || form.department === "all") e.department = "Requerido.";
    if (!form.role || form.role === "all") e.role = "Requerido.";
    if (!form.status || form.status === "all") e.status = "Requerido.";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // Precargar formulario cuando hay un empleado seleccionado
  useEffect(() => {
    if (employee && open) {
      setForm({
        fullName: employee.fullName || "",
        idNumber: employee.idNumber || "",
        phone: employee.phone || "",
        email: employee.email || "",
        department: employee.department || "",
        role: employee.role || "",
        status: employee.status || "",
      });
      setErrors({});
    }
  }, [employee, open]);

  // Manejar envío del formulario
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const updatedEmployee = await updateEmployee(employee!.id, form);
      onEmployeeUpdated(updatedEmployee);
      onOpenChange(false);
      console.log("[EditEmployeeDialog] Empleado actualizado:", updatedEmployee);
    } catch (error) {
      console.error("[EditEmployeeDialog] Error updating employee:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Empleado</DialogTitle>
          <DialogDescription>
            Modifica los datos del empleado seleccionado. Todos los campos marcados como requeridos deben ser completados.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Nombre completo */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Nombre completo <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Ingrese el nombre completo"
              
            />
            {errors.fullName && <p className="text-[11px] text-red-500">{errors.fullName}</p>}
          </div>

          {/* Número de identificación */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Número de identificación <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.idNumber}
              onChange={(e) => set("idNumber", e.target.value)}
              placeholder="Ingrese el número de identificación"
              
            />
            {errors.idNumber && <p className="text-[11px] text-red-500">{errors.idNumber}</p>}
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="Ingrese el teléfono"
              
            />
            {errors.phone && <p className="text-[11px] text-red-500">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="Ingrese el email"
              
            />
            {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
          </div>

          {/* Departamento */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Departamento <span className="text-red-500">*</span>
            </Label>
            <FilterCombobox
              value={form.department}
              onChange={(value) => set("department", value)}
              options={departmentOptions}
              placeholder="Seleccione un departamento"
              
            />
            {errors.department && <p className="text-[11px] text-red-500">{errors.department}</p>}
          </div>

          {/* Rol */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Rol <span className="text-red-500">*</span>
            </Label>
            <FilterCombobox
              value={form.role}
              onChange={(value) => set("role", value)}
              options={profileOptions}
              placeholder="Seleccione un rol"
              
            />
            {errors.role && <p className="text-[11px] text-red-500">{errors.role}</p>}
          </div>

          {/* Estado */}
          <div className="space-y-1">
            <Label className="text-xs font-medium text-slate-600">
              Estado <span className="text-red-500">*</span>
            </Label>
            <FilterCombobox
              value={form.status}
              onChange={(value) => set("status", value)}
              options={statusOptions}
              placeholder="Seleccione un estado"
              
            />
            {errors.status && <p className="text-[11px] text-red-500">{errors.status}</p>}
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 rounded-xl border-slate-200 px-4 text-sm"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
