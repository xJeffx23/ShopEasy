"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { ArrowLeft, User, Phone, Mail, Calendar, MapPin, FileText } from "lucide-react";
import { pacientesService } from "@/src/services/pacientes.service";
import Link from "next/link";

export default function NewPatientPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const fromAdmission = searchParams.get("from") === "admission";
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        Nombre: "",
        Numero_Cedula: "",
        Fecha_Nacimiento: "",
        Fecha_Ingreso: new Date().toISOString().split('T')[0],
        Telefono_Contacto_Emergencia: "",
        Nombre_Contacto_Emergencia: "",
        Catalogo_Nivel_Asistencia_idNivel: 1,
        Activo: true
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await pacientesService.create(formData);
            
            if (fromAdmission) {
                // Si viene del proceso de admisión, redirigir a crear reservación
                router.push("/sistema/reservations/new");
            } else {
                // Si viene del flujo normal, redirigir a la lista de pacientes
                router.push("/sistema/patients");
            }
        } catch (error) {
            console.error("Error creating patient:", error);
            // Aquí podrías mostrar un mensaje de error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link 
                        href="/sistema/patients" 
                        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver a pacientes
                    </Link>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {fromAdmission ? "Nuevo Paciente - Admisión" : "Nuevo Paciente"}
                            </h1>
                            <p className="text-slate-600 mt-1">
                                {fromAdmission 
                                    ? "Registre los datos del paciente para continuar con la admisión"
                                    : "Complete el formulario para registrar un nuevo paciente"
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información del Paciente
                        </CardTitle>
                        <CardDescription>
                            Todos los campos marcados con * son obligatorios
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Información Personal */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                            {/* Información de Contacto de Emergencia */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Contacto de Emergencia
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Información Médica
                                </h3>
                                
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

                            {/* Botones */}
                            <div className="flex justify-end gap-3 pt-6 border-t">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={loading}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {loading ? "Guardando..." : fromAdmission ? "Guardar y Continuar" : "Guardar Paciente"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
