"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    CalendarDays,
    Clock,
    BedDouble,
    Plus,
    ChevronRight,
    CheckCircle,
    AlertCircle,
    XCircle
} from "lucide-react";
import api from "@/src/services/api";

interface Reservacion {
    idReservacion: number;
    Fecha_Inicio: string;
    Fecha_Fin: string | null;
    Habitacion: {
        Numero_Habitacion: string;
        Tipo: { Nombre_Tipo: string; Costo_Por_Dia: number };
    };
    Tipo_Estancia: { Descripcion_Estancia: string };
    Estado: { Descripcion_Estado: string };
}

export default function PacienteDashboardPage() {
    const [reservaciones, setReservaciones] = useState<Reservacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [canceling, setCanceling] = useState<number | null>(null);
    const [stats, setStats] = useState({
        activas: 0,
        completadas: 0,
        total: 0
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await api.get('/reservaciones/mis-reservaciones');
            const data = response.data;

            setReservaciones(data);
            setStats({
                activas: data.filter((r: Reservacion) => r.Estado.Descripcion_Estado === 'Activa').length,
                completadas: data.filter((r: Reservacion) => r.Estado.Descripcion_Estado === 'Finalizada').length,
                total: data.length
            });
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

    const reservacionActiva = reservaciones.find(r => r.Estado.Descripcion_Estado === 'Activa');

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome section */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">¡Bienvenido a tu Portal!</h1>
                <p className="text-teal-100">
                    Aquí puedes gestionar tus reservaciones y consultar tu historial de estancias.
                </p>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                            <CheckCircle className="h-5 w-5 text-teal-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.activas}</p>
                            <p className="text-xs sm:text-sm text-slate-500">Activas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Clock className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.completadas}</p>
                            <p className="text-xs sm:text-sm text-slate-500">Completadas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                            <CalendarDays className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                            <p className="text-xs sm:text-sm text-slate-500">Total</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Current reservation or CTA */}
            {reservacionActiva ? (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-teal-50 px-4 sm:px-6 py-3 border-b border-teal-100">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-teal-600" />
                            <h2 className="font-semibold text-teal-800">Tu Reservación Activa</h2>
                        </div>
                    </div>
                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Habitación</p>
                                <div className="flex items-center gap-2">
                                    <BedDouble className="h-4 w-4 text-slate-400" />
                                    <span className="font-semibold text-slate-800">
                                        {reservacionActiva.Habitacion.Numero_Habitacion}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {reservacionActiva.Habitacion.Tipo.Nombre_Tipo}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Fecha de Inicio</p>
                                <p className="font-semibold text-slate-800 text-sm">
                                    {formatDate(reservacionActiva.Fecha_Inicio)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Tipo de Estancia</p>
                                <p className="font-semibold text-slate-800 text-sm">
                                    {reservacionActiva.Tipo_Estancia.Descripcion_Estancia}
                                </p>
                            </div>
                            <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end">
                                <button
                                    onClick={() => handleCancelar(reservacionActiva.idReservacion)}
                                    disabled={canceling === reservacionActiva.idReservacion}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition disabled:opacity-50"
                                >
                                    {canceling === reservacionActiva.idReservacion ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                    ) : (
                                        <XCircle className="h-4 w-4" />
                                    )}
                                    Cancelar Reservación
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center">
                    <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-7 w-7 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        No tienes reservaciones activas
                    </h3>
                    <p className="text-slate-500 mb-5 text-sm">
                        ¿Deseas realizar una nueva reservación?
                    </p>
                    <Link
                        href="/paciente/nueva-reservacion"
                        className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition text-sm"
                    >
                        <Plus className="h-5 w-5" />
                        Nueva Reservación
                    </Link>
                </div>
            )}

            {/* Quick actions */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <Link
                    href="/paciente/nueva-reservacion"
                    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-teal-300 hover:shadow-md transition group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="h-11 w-11 rounded-xl bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition">
                                <Plus className="h-5 w-5 text-teal-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Nueva Reservación</p>
                                <p className="text-xs sm:text-sm text-slate-500">Solicita una nueva estancia</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-teal-600 transition" />
                    </div>
                </Link>

                <Link
                    href="/paciente/historial"
                    className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 hover:border-blue-300 hover:shadow-md transition group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition">
                                <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-slate-800">Ver Historial</p>
                                <p className="text-xs sm:text-sm text-slate-500">Consulta tus estancias anteriores</p>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                </Link>
            </div>
        </div>
    );
}
