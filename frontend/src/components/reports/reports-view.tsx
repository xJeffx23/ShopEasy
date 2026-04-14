"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ReportsSummaryCards } from "@/src/components/reports/reports-summary-cards";
import { ReportsPatientsByDay } from "@/src/components/reports/reports-patients-by-day";
import { ReportsOccupancyTrend } from "@/src/components/reports/reports-occupancy-trend";
import { ReportsRoomsChart } from "@/src/components/reports/reports-rooms-chart";
import { ReportsMovementChart } from "@/src/components/reports/reports-movement-chart";
import { ReportsAssistanceChart } from "@/src/components/reports/reports-assistance-chart";
import { ReportsData } from "@/src/types/report";

interface ReportsViewProps {
    data: ReportsData;
}

export default function ReportsView({ data }: ReportsViewProps) {
    const [exporting, setExporting] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const getRoomValue = (item: any) => item.value ?? item.count ?? 0;
    const getRoomName = (item: any) => item.name ?? item.status ?? 'Desconocido';

    const activePatients = data.summary.activePatients ?? data.summary.hostedPatients ?? 0;
    const availableRooms = data.summary.availableRooms ?? 
        (data.summary.totalRooms - data.summary.reservedRooms);
    const occupancyRate = data.summary.occupancyRate ?? 
        (data.summary.totalRooms > 0 ? Math.round((data.summary.reservedRooms / data.summary.totalRooms) * 100) : 0);

    const exportToExcel = () => {
        setExporting(true);
        setShowMenu(false);

        try {
            // Crear contenido con separador de punto y coma para mejor compatibilidad con Excel en español
            // BOM para UTF-8
            const BOM = '\uFEFF';
            
            let csv = BOM;
            csv += "REPORTE DE PATITOS DEL RETIRO\n";
            csv += `Fecha de generacion;${new Date().toLocaleDateString('es-CR')}\n\n`;

            csv += "RESUMEN GENERAL\n";
            csv += `Indicador;Valor\n`;
            csv += `Total Pacientes;${data.summary.totalPatients}\n`;
            csv += `Pacientes Activos;${activePatients}\n`;
            csv += `Total Habitaciones;${data.summary.totalRooms}\n`;
            csv += `Habitaciones Disponibles;${availableRooms}\n`;
            csv += `Tasa de Ocupacion;${occupancyRate}%\n`;
            csv += `Reservaciones Activas;${data.summary.activeReservations}\n\n`;

            csv += "DISTRIBUCION DE HABITACIONES\n";
            csv += "Estado;Cantidad\n";
            data.roomStatusDist.forEach(item => {
                csv += `${getRoomName(item)};${getRoomValue(item)}\n`;
            });
            csv += "\n";

            csv += "TENDENCIA DE OCUPACION (Ultimos 6 meses)\n";
            csv += "Mes;Ocupacion %\n";
            data.occupancyTrend.forEach(item => {
                csv += `${item.month};${item.occupancy}\n`;
            });
            csv += "\n";

            csv += "MOVIMIENTO DE PACIENTES\n";
            csv += "Mes;Ingresos;Egresos\n";
            data.patientMovement.forEach(item => {
                csv += `${item.month};${item.ingresos};${item.egresos}\n`;
            });
            csv += "\n";

            csv += "PACIENTES POR NIVEL DE ASISTENCIA\n";
            csv += "Nivel;Cantidad\n";
            data.assistanceLevelDist.forEach(item => {
                // Remover acentos para evitar problemas
                const nivel = item.level
                    .replace('á', 'a')
                    .replace('é', 'e')
                    .replace('í', 'i')
                    .replace('ó', 'o')
                    .replace('ú', 'u')
                    .replace('ñ', 'n')
                    .replace('Á', 'A')
                    .replace('É', 'E')
                    .replace('Í', 'I')
                    .replace('Ó', 'O')
                    .replace('Ú', 'U')
                    .replace('Ñ', 'N');
                csv += `${nivel};${item.count}\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `reporte_patitos_${new Date().toISOString().split('T')[0]}.csv`;
            link.click();
        } catch (error) {
            console.error('Error exporting Excel:', error);
            alert('Error al exportar el reporte');
        } finally {
            setExporting(false);
        }
    };

    const exportToHTML = () => {
        setExporting(true);
        setShowMenu(false);

        try {
            const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte Patitos del Retiro</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
        h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
        h2 { color: #334155; margin-top: 30px; }
        .fecha { color: #64748b; margin-bottom: 30px; }
        .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; }
        .card-value { font-size: 28px; font-weight: bold; color: #1e40af; }
        .card-label { font-size: 12px; color: #64748b; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
        th { background: #f1f5f9; font-weight: 600; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
    </style>
</head>
<body>
    <h1>🏥 Reporte de Patitos del Retiro</h1>
    <p class="fecha">Generado el ${new Date().toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    
    <h2>Resumen General</h2>
    <div class="cards">
        <div class="card">
            <div class="card-value">${data.summary.totalPatients}</div>
            <div class="card-label">Total Pacientes</div>
        </div>
        <div class="card">
            <div class="card-value">${activePatients}</div>
            <div class="card-label">Pacientes Activos</div>
        </div>
        <div class="card">
            <div class="card-value">${occupancyRate}%</div>
            <div class="card-label">Tasa de Ocupación</div>
        </div>
        <div class="card">
            <div class="card-value">${data.summary.totalRooms}</div>
            <div class="card-label">Total Habitaciones</div>
        </div>
        <div class="card">
            <div class="card-value">${availableRooms}</div>
            <div class="card-label">Habitaciones Disponibles</div>
        </div>
        <div class="card">
            <div class="card-value">${data.summary.activeReservations}</div>
            <div class="card-label">Reservaciones Activas</div>
        </div>
    </div>

    <h2>Distribución de Habitaciones</h2>
    <table>
        <tr><th>Estado</th><th>Cantidad</th></tr>
        ${data.roomStatusDist.map(item => `<tr><td>${getRoomName(item)}</td><td>${getRoomValue(item)}</td></tr>`).join('')}
    </table>

    <h2>Tendencia de Ocupación (Últimos 6 meses)</h2>
    <table>
        <tr><th>Mes</th><th>Ocupación %</th></tr>
        ${data.occupancyTrend.map(item => `<tr><td>${item.month}</td><td>${item.occupancy}%</td></tr>`).join('')}
    </table>

    <h2>Movimiento de Pacientes</h2>
    <table>
        <tr><th>Mes</th><th>Ingresos</th><th>Egresos</th></tr>
        ${data.patientMovement.map(item => `<tr><td>${item.month}</td><td>${item.ingresos}</td><td>${item.egresos}</td></tr>`).join('')}
    </table>

    <h2>Pacientes por Nivel de Asistencia</h2>
    <table>
        <tr><th>Nivel de Asistencia</th><th>Cantidad de Pacientes</th></tr>
        ${data.assistanceLevelDist.map(item => `<tr><td>${item.level}</td><td>${item.count}</td></tr>`).join('')}
    </table>

    <div class="footer">
        <p>Este reporte fue generado automáticamente por el sistema de gestión de Patitos del Retiro.</p>
        <p>© ${new Date().getFullYear()} Patitos del Retiro - Todos los derechos reservados</p>
    </div>
</body>
</html>`;

            const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `reporte_patitos_${new Date().toISOString().split('T')[0]}.html`;
            link.click();
        } catch (error) {
            console.error('Error exporting HTML:', error);
            alert('Error al exportar el reporte');
        } finally {
            setExporting(false);
        }
    };

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                        Reportes
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Métricas y estadísticas del sistema
                    </p>
                </div>
                
                <div className="relative">
                    <Button
                        variant="outline"
                        className="h-10 shrink-0 rounded-xl border-slate-200 px-4 text-sm"
                        onClick={() => setShowMenu(!showMenu)}
                        disabled={exporting}
                    >
                        {exporting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                Exportando...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-4 w-4" />
                                Exportar Reporte
                            </>
                        )}
                    </Button>
                    
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-10">
                            <button
                                onClick={exportToExcel}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                                Exportar a Excel (CSV)
                            </button>
                            <button
                                onClick={exportToHTML}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            >
                                <FileText className="h-4 w-4 text-blue-600" />
                                Exportar a HTML
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Fila 1: KPIs */}
            <ReportsSummaryCards summary={data.summary} />

            {/* Fila 2: Tendencia de ocupación | Estado de habitaciones */}
            <div className="grid gap-6 lg:grid-cols-2">
                <ReportsOccupancyTrend data={data.occupancyTrend} />
                <ReportsRoomsChart
                    distribution={data.roomStatusDist}
                    summary={data.summary}
                />
            </div>

            {/* Fila 3: Pacientes por día | Pacientes por nivel de asistencia */}
            <div className="grid gap-6 lg:grid-cols-2">
                <ReportsPatientsByDay data={data.patientsByDay} />
                <ReportsAssistanceChart data={data.assistanceLevelDist} />
            </div>

            {/* Fila 4: Ingresos y egresos */}
            <ReportsMovementChart data={data.patientMovement} />
        </section>
    );
}
