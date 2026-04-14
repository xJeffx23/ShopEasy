"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    BedDouble,
    ArrowLeft,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle
} from "lucide-react";
import api from "@/src/services/api";

interface Reservacion {
    idReservacion: number;
    Fecha_Inicio: string;
    Fecha_Fin: string | null;
    Fecha_Registro: string;
    Habitacion: {
        Numero_Habitacion: string;
        Tipo: { Nombre_Tipo: string; Costo_Por_Dia: number };
    };
    Tipo_Estancia: { Descripcion_Estancia: string };
    Estado: { Descripcion_Estado: string };
}

export default function PacienteHistorialPage() {
    const [reservaciones, setReservaciones] = useState<Reservacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await api.get('/reservaciones/mis-reservaciones');
            setReservaciones(response.data);
        } catch (error) {
            console.error('Error loading reservaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async (idReservacion: number) => {
        if (!confirm('¿Estás seguro de que deseas cancelar esta reservación?')) {
            return;
        }

        setCanceling(idReservacion);
        try {
            await api.patch(`/reservaciones/mis-reservaciones/${idReservacion}/cancelar`);
            await loadData();
            alert('Reservación cancelada exitosamente');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error al cancelar la reservación');
        } finally {
            setCanceling(null);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-CR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getEstadoStyle = (estado: string) => {
        switch (estado) {
            case 'Activa':
                return 'bg-green-100 text-green-700';
            case 'Finalizada':
                return 'bg-blue-100 text-blue-700';
            case 'Cancelada':
                return 'bg-red-100 text-red-700';
            case 'Pendiente':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const getEstadoIcon = (estado: string) => {
        switch (estado) {
            case 'Activa':
                return <CheckCircle className="h-4 w-4" />;
            case 'Finalizada':
                return <Clock className="h-4 w-4" />;
            case 'Cancelada':
                return <XCircle className="h-4 w-4" />;
            case 'Pendiente':
                return <AlertCircle className="h-4 w-4" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link
                    href="/paciente/dashboard"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al inicio
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">Mi Historial</h1>
                <p className="text-slate-500">Todas tus reservaciones pasadas y actuales</p>
            </div>

            {/* Reservaciones */}
            {reservaciones.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <CalendarDays className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        No tienes reservaciones
                    </h3>
                    <p className="text-slate-500 mb-6">
                        Aún no has realizado ninguna reservación
                    </p>
                    <Link
                        href="/paciente/nueva-reservacion"
                        className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
                    >
                        Nueva Reservación
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {reservaciones.map((reservacion) => (
                        <div
                            key={reservacion.idReservacion}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                            <BedDouble className="h-6 w-6 text-slate-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-slate-800">
                                                    Habitación {reservacion.Habitacion.Numero_Habitacion}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoStyle(reservacion.Estado.Descripcion_Estado)}`}>
                                                    {getEstadoIcon(reservacion.Estado.Descripcion_Estado)}
                                                    {reservacion.Estado.Descripcion_Estado}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                {reservacion.Habitacion.Tipo.Nombre_Tipo} • {reservacion.Tipo_Estancia.Descripcion_Estancia}
                                            </p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                                                <span>
                                                    <span className="text-slate-400">Inicio:</span> {formatDate(reservacion.Fecha_Inicio)}
                                                </span>
                                                <span>
                                                    <span className="text-slate-400">Fin:</span> {reservacion.Fecha_Fin ? formatDate(reservacion.Fecha_Fin) : 'Indefinido'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-800">
                                                ₡{reservacion.Habitacion.Tipo.Costo_Por_Dia?.toLocaleString() || 0}
                                            </p>
                                            <p className="text-xs text-slate-500">por día</p>
                                        </div>

                                        {(reservacion.Estado.Descripcion_Estado === 'Activa' || 
                                          reservacion.Estado.Descripcion_Estado === 'Pendiente') && (
                                            <button
                                                onClick={() => handleCancelar(reservacion.idReservacion)}
                                                disabled={canceling === reservacion.idReservacion}
                                                className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition disabled:opacity-50"
                                            >
                                                {canceling === reservacion.idReservacion ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                ) : (
                                                    <XCircle className="h-4 w-4" />
                                                )}
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
