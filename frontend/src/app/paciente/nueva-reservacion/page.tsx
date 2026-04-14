"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    CalendarDays,
    BedDouble,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import api from "@/src/services/api";

interface Habitacion {
    idHabitacion: number;
    Numero_Habitacion: string;
    Capacidad: number;
    Tipo: {
        idCatalogo_Tipo_Habitacion: number;
        Nombre_Tipo: string;
        Costo_Por_Dia: number;
    };
}

interface TipoEstancia {
    idCatalogo_Tipo_Estancia: number;
    Descripcion_Estancia: string;
    Hora_Inicio: string;
    Hora_Fin: string;
}

export default function PacienteNuevaReservacionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
    const [tiposEstancia, setTiposEstancia] = useState<TipoEstancia[]>([]);
    const [tieneReservacionActiva, setTieneReservacionActiva] = useState(false);

    const [formData, setFormData] = useState({
        idHabitacion: '',
        idTipoEstancia: '',
        fechaInicio: '',
        fechaFin: '',
        esIndefinido: false
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Verificar si tiene reservación activa
            const misReservaciones = await api.get('/reservaciones/mis-reservaciones');
            const activa = misReservaciones.data.find((r: any) => r.Estado.Descripcion_Estado === 'Activa');
            setTieneReservacionActiva(!!activa);

            // Cargar habitaciones disponibles
            const habResponse = await api.get('/habitaciones');
            const disponibles = habResponse.data.filter((h: any) =>
                h.Catalogo_Estado_Habitacion_idEstado === 1 // Disponible
            );
            setHabitaciones(disponibles);

            // Cargar tipos de estancia
            const tiposResponse = await api.get('/catalogos/tipos-estancia');
            setTiposEstancia(tiposResponse.data);

        } catch (error) {
            console.error('Error loading data:', error);
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            // Obtener el ID del paciente del token
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            await api.post('/reservaciones/solicitar', {
                Habitacion_idHabitacion: parseInt(formData.idHabitacion),
                Catalogo_Tipo_Estancia_idEstancia: parseInt(formData.idTipoEstancia),
                Fecha_Inicio: formData.fechaInicio,
                Fecha_Fin: formData.esIndefinido ? null : formData.fechaFin,
                Observaciones: 'Reservación solicitada desde portal de paciente'
            });

            setSuccess(true);

            // Redirigir al dashboard después de 2 segundos
            setTimeout(() => {
                router.push('/paciente/dashboard');
            }, 2000);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al crear la reservación');
        } finally {
            setSubmitting(false);
        }
    };

    const habitacionSeleccionada = habitaciones.find(h => h.idHabitacion === parseInt(formData.idHabitacion));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="max-w-lg mx-auto text-center py-12">
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    ¡Solicitud Enviada!
                </h2>
                <p className="text-slate-500 mb-6">
                    Tu solicitud de reservación ha sido registrada.
                    El personal del asilo la revisará pronto.
                </p>
                <p className="text-sm text-slate-400">
                    Redirigiendo al inicio...
                </p>
            </div>
        );
    }

    if (tieneReservacionActiva) {
        return (
            <div className="max-w-lg mx-auto text-center py-12">
                <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="h-10 w-10 text-amber-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Ya tienes una reservación activa
                </h2>
                <p className="text-slate-500 mb-6">
                    No puedes crear una nueva reservación mientras tengas una activa.
                    Consulta tu reservación actual en el dashboard.
                </p>
                <Link
                    href="/paciente/dashboard"
                    className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Volver al Inicio
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/paciente/dashboard"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">Nueva Reservación</h1>
                <p className="text-slate-500">Completa el formulario para solicitar una nueva estancia</p>
            </div>

            {/* Error message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Habitación */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <BedDouble className="h-5 w-5 text-teal-600" />
                        <h3 className="font-semibold text-slate-800">Selecciona una Habitación</h3>
                    </div>

                    {habitaciones.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <p>No hay habitaciones disponibles en este momento</p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 gap-3">
                            {habitaciones.map((hab) => (
                                <label
                                    key={hab.idHabitacion}
                                    className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition ${formData.idHabitacion === hab.idHabitacion.toString()
                                            ? 'border-teal-500 bg-teal-50'
                                            : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="habitacion"
                                        value={hab.idHabitacion}
                                        checked={formData.idHabitacion === hab.idHabitacion.toString()}
                                        onChange={(e) => setFormData({ ...formData, idHabitacion: e.target.value })}
                                        className="sr-only"
                                        required
                                    />
                                    <span className="font-semibold text-slate-800">
                                        Habitación {hab.Numero_Habitacion}
                                    </span>
                                    <span className="text-sm text-slate-500">{hab.Tipo.Nombre_Tipo}</span>
                                    <span className="text-sm font-medium text-teal-600 mt-1">
                                        ₡{hab.Tipo.Costo_Por_Dia.toLocaleString()}/día
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tipo de estancia */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-teal-600" />
                        <h3 className="font-semibold text-slate-800">Tipo de Estancia</h3>
                    </div>

                    <div className="space-y-2">
                        {tiposEstancia.map((tipo) => (
                            <label
                                key={tipo.idCatalogo_Tipo_Estancia}
                                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition ${formData.idTipoEstancia === tipo.idCatalogo_Tipo_Estancia.toString()
                                        ? 'border-teal-500 bg-teal-50'
                                        : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        name="tipoEstancia"
                                        value={tipo.idCatalogo_Tipo_Estancia}
                                        checked={formData.idTipoEstancia === tipo.idCatalogo_Tipo_Estancia.toString()}
                                        onChange={(e) => setFormData({ ...formData, idTipoEstancia: e.target.value })}
                                        className="h-4 w-4 text-teal-600"
                                        required
                                    />
                                    <span className="font-medium text-slate-800">
                                        {tipo.Descripcion_Estancia}
                                    </span>
                                </div>
                                <span className="text-sm text-slate-500">
                                    {tipo.Hora_Inicio} - {tipo.Hora_Fin}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Fechas */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <CalendarDays className="h-5 w-5 text-teal-600" />
                        <h3 className="font-semibold text-slate-800">Fechas</h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fecha de inicio
                            </label>
                            <input
                                type="date"
                                value={formData.fechaInicio}
                                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Fecha de fin
                            </label>
                            <input
                                type="date"
                                value={formData.fechaFin}
                                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                min={formData.fechaInicio || new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-100"
                                disabled={formData.esIndefinido}
                                required={!formData.esIndefinido}
                            />
                        </div>
                    </div>

                    <label className="flex items-center gap-2 mt-4 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.esIndefinido}
                            onChange={(e) => setFormData({ ...formData, esIndefinido: e.target.checked, fechaFin: '' })}
                            className="h-4 w-4 text-teal-600 rounded"
                        />
                        <span className="text-sm text-slate-600">Estancia indefinida (sin fecha de fin)</span>
                    </label>
                </div>

                {/* Resumen */}
                {habitacionSeleccionada && formData.idTipoEstancia && formData.fechaInicio && (
                    <div className="bg-teal-50 rounded-xl border border-teal-200 p-6">
                        <h3 className="font-semibold text-teal-800 mb-3">Resumen de tu solicitud</h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-teal-600">Habitación:</span> {habitacionSeleccionada.Numero_Habitacion} - {habitacionSeleccionada.Tipo.Nombre_Tipo}</p>
                            <p><span className="text-teal-600">Costo:</span> ₡{habitacionSeleccionada.Tipo.Costo_Por_Dia.toLocaleString()}/día</p>
                            <p><span className="text-teal-600">Fecha inicio:</span> {new Date(formData.fechaInicio).toLocaleDateString('es-CR')}</p>
                            <p><span className="text-teal-600">Fecha fin:</span> {formData.esIndefinido ? 'Indefinido' : new Date(formData.fechaFin).toLocaleDateString('es-CR')}</p>
                        </div>
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    disabled={submitting || habitaciones.length === 0}
                    className="w-full bg-teal-600 text-white py-4 rounded-xl font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Enviando solicitud...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="h-5 w-5" />
                            Enviar Solicitud de Reservación
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}