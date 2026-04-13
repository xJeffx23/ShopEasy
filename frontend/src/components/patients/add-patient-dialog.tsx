"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    CreditCard, Package, Phone, Pill, Plus, Save,
    Settings2, ShieldAlert, Trash2, UserPlus, X,
} from "lucide-react";

import FilterCombobox from "@/src/components/ui/filter-combobox";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import type {
    Patient,
    AssistanceLevel,
    PatientStatus,
    SpecialCare,
    AdditionalPackage,
    PatientMedication,
    PatientSpecialCare,
    PatientPackage,
} from "@/src/types/patient";
import { medicamentosService, type MedicamentoCatalogo } from "@/src/services/medicamentos.service";

// ─── Opciones de selects ──────────────────────────────────────────────────────

const assistanceOptions = [
    { label: "Seleccione un nivel", value: "all" },
    { label: "Asistencia básica", value: "Asistencia básica" },
    { label: "Asistencia para movilidad", value: "Asistencia para movilidad" },
    { label: "Asistencia para alimentación", value: "Asistencia para alimentación" },
    { label: "Asistencia para baño", value: "Asistencia para baño" },
    { label: "Asistencia completa", value: "Asistencia completa" },
];

const statusOptions = [
    { label: "Activo", value: "activo" },
    { label: "Inactivo", value: "inactivo" },
];

const specialCareOptions = [
    { label: "Seleccionar tipo", value: "all" },
    { label: "Alergias", value: "Alergias" },
    { label: "Cambios de vendajes", value: "Cambios de vendajes" },
    { label: "Dietas especiales", value: "Dietas especiales" },
];

const packageOptions = [
    { label: "Seleccionar paquete", value: "all" },
    { label: "Disfrute de juegos", value: "Disfrute de juegos" },
    { label: "Visitas a los familiares", value: "Visitas a los familiares" },
    { label: "Paseos a sitios con acompañamiento", value: "Paseos a sitios con acompañamiento" },
];

// ─── Tipos internos del formulario ────────────────────────────────────────────

type TabId = "basic" | "medications" | "cares" | "packages";

interface BasicFormValues {
    fullName: string;
    idNumber: string;
    birthDate: string;     // date input YYYY-MM-DD
    emergencyName: string;
    emergencyPhone: string;
    assistanceLevel: AssistanceLevel | "all";
    status: PatientStatus;
    manualCode: string;
    manualDate: string;     // date input YYYY-MM-DD
}

interface MedForm {
    name: string;
    dose: string;
    frequency: string;
    schedule: string;
    notes: string;
}

interface CareForm {
    type: SpecialCare | "all";
    detail: string;
}

interface PkgForm {
    type: AdditionalPackage | "all";
}

interface FormErrors {
    fullName?: string;
    idNumber?: string;
    birthDate?: string;
    emergencyName?: string;
    emergencyPhone?: string;
    assistanceLevel?: string;
    manualCode?: string;
    manualDate?: string;
}

const initialBasic: BasicFormValues = {
    fullName: "",
    idNumber: "",
    birthDate: "",
    emergencyName: "",
    emergencyPhone: "",
    assistanceLevel: "all",
    status: "activo",
    manualCode: "",
    manualDate: "",
};

const initialMed: MedForm = { name: "", dose: "", frequency: "", schedule: "", notes: "" };
const initialCare: CareForm = { type: "all", detail: "" };
const initialPkg: PkgForm = { type: "all" };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
    return name.trim().split(" ").filter(Boolean)
        .slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function formatToday() {
    return new Intl.DateTimeFormat("es-CR", {
        day: "2-digit", month: "2-digit", year: "numeric",
    }).format(new Date());
}

function todayForInput() {
    return new Date().toISOString().split("T")[0];
}

function formatDateFromInput(value: string) {
    if (!value) return "";
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
}

function calcAge(birthDateInput: string): number {
    if (!birthDateInput) return 0;
    const birth = new Date(birthDateInput);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function buildCode(n: number) {
    return `PT-${String(n).padStart(3, "0")}`;
}

function normalizeId(value: string) {
    return value.replace(/[^\d-]/g, "");
}

function normalizePhone(value: string) {
    return value.replace(/[^\d-]/g, "");
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddPatientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (patient: Patient) => void;
    nextPatientNumber: number;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AddPatientDialog({
    open,
    onOpenChange,
    onSubmit,
    nextPatientNumber,
}: AddPatientDialogProps) {
    const [activeTab, setActiveTab] = useState<TabId>("basic");
    const [basic, setBasic] = useState<BasicFormValues>(initialBasic);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isManual, setIsManual] = useState(false);

    // Listas acumuladas
    const [medications, setMedications] = useState<PatientMedication[]>([]);
    const [cares, setCares] = useState<PatientSpecialCare[]>([]);
    const [packages, setPackages] = useState<PatientPackage[]>([]);

    // Forms de items nuevos
    const [medForm, setMedForm] = useState<MedForm>(initialMed);
    const [careForm, setCareForm] = useState<CareForm>(initialCare);
    const [pkgForm, setPkgForm] = useState<PkgForm>(initialPkg);

    // Opciones de medicamentos
    const [medicamentosOptions, setMedicamentosOptions] = useState<any[]>([]);

    useEffect(() => {
        if (!open) {
            setActiveTab("basic");
            setBasic(initialBasic);
            setErrors({});
            setIsManual(false);
            setMedications([]);
            setCares([]);
            setPackages([]);
            setMedForm(initialMed);
            setCareForm(initialCare);
            setPkgForm(initialPkg);
        }
    }, [open]);

    useEffect(() => {
        // Cargar opciones de medicamentos cuando el diálogo se abre
        if (open) {
            loadMedicamentosOptions();
        }
    }, [open]);

    async function loadMedicamentosOptions() {
        try {
            const options = await medicamentosService.getMedicamentosOptions();
            setMedicamentosOptions(options);
        } catch (error) {
            console.error('Error al cargar opciones de medicamentos:', error);
        }
    }

    const generatedCode = useMemo(() => buildCode(nextPatientNumber), [nextPatientNumber]);
    const generatedDate = formatToday();

    // ── Field setters ─────────────────────────────────────────────────────────

    function setField<K extends keyof BasicFormValues>(field: K, value: BasicFormValues[K]) {
        setBasic((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // ── Validación ────────────────────────────────────────────────────────────

    function validate(): boolean {
        const e: FormErrors = {};
        if (!basic.fullName.trim()) e.fullName = "Requerido.";
        if (!basic.idNumber.trim()) e.idNumber = "Requerido.";
        else if (basic.idNumber.trim().length < 9) e.idNumber = "Cédula inválida.";
        if (!basic.birthDate) e.birthDate = "Requerido.";
        if (!basic.emergencyName.trim()) e.emergencyName = "Requerido.";
        if (!basic.emergencyPhone.trim()) e.emergencyPhone = "Requerido.";
        if (basic.assistanceLevel === "all") e.assistanceLevel = "Requerido.";
        if (isManual) {
            if (!basic.manualCode.trim()) e.manualCode = "Requerido.";
            if (!basic.manualDate) e.manualDate = "Requerido.";
        }
        setErrors(e);
        if (Object.keys(e).length > 0) setActiveTab("basic");
        return Object.keys(e).length === 0;
    }

    // ── Agregar items a listas ────────────────────────────────────────────────

    function addMedication() {
        if (!medForm.name.trim() || !medForm.dose.trim() || !medForm.frequency.trim() || !medForm.schedule.trim()) return;
        setMedications((prev) => [...prev, {
            id: crypto.randomUUID(),
            name: medForm.name.trim(),
            dose: medForm.dose.trim(),
            frequency: medForm.frequency.trim(),
            schedule: medForm.schedule.trim(),
            notes: medForm.notes.trim() || undefined,
        }]);
        setMedForm(initialMed);
    }

    function handleMedicamentoSelect(value: string) {
        if (value === "all") {
            setMedForm(initialMed);
            return;
        }

        // Buscar el medicamento seleccionado
        const selectedOption = medicamentosOptions.find(opt => opt.value === value);
        if (selectedOption?.data) {
            const medicamento: MedicamentoCatalogo = selectedOption.data;
            setMedForm({
                name: medicamento.nombre,
                dose: medicamento.dosis || '',
                frequency: medicamento.frecuencia || '',
                schedule: '',
                notes: medicamento.indicaciones || ''
            });
        } else {
            setMedForm(prev => ({ ...prev, name: value }));
        }
    }

    function addCare() {
        if (careForm.type === "all" || !careForm.detail.trim()) return;
        setCares((prev) => [...prev, {
            id: crypto.randomUUID(),
            type: careForm.type as SpecialCare,
            detail: careForm.detail.trim(),
        }]);
        setCareForm(initialCare);
    }

    function addPackage() {
        if (pkgForm.type === "all") return;
        const already = packages.some((p) => p.type === pkgForm.type);
        if (already) return;
        setPackages((prev) => [...prev, {
            id: crypto.randomUUID(),
            type: pkgForm.type as AdditionalPackage,
            assignedDate: formatToday(),
            active: true,
        }]);
        setPkgForm(initialPkg);
    }

    // ── Submit ────────────────────────────────────────────────────────────────

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!validate()) return;

        const newPatient: Patient = {
            id: crypto.randomUUID(),
            patientCode: isManual ? basic.manualCode.trim().toUpperCase() : generatedCode,
            fullName: basic.fullName.trim(),
            idNumber: basic.idNumber.trim(),
            birthDate: basic.birthDate,
            age: calcAge(basic.birthDate),
            admissionDate: isManual ? formatDateFromInput(basic.manualDate) : generatedDate,
            roomNumber: "",   // Se asigna en Reservaciones
            assistanceLevel: basic.assistanceLevel as AssistanceLevel,
            status: basic.status,
            emergencyContact: {
                name: basic.emergencyName.trim(),
                phone: basic.emergencyPhone.trim(),
            },
            medications,
            specialCares: cares,
            packages,
        };

        onSubmit(newPatient);
        onOpenChange(false);
    }

    // ── Estilos reutilizables ─────────────────────────────────────────────────

    const inputCls = "h-10 rounded-xl border-slate-200 bg-white text-sm shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100";

    const tabs: { id: TabId; label: string; icon: React.ReactNode; count?: number }[] = [
        { id: "basic", label: "Datos", icon: <UserPlus className="h-3.5 w-3.5" /> },
        { id: "medications", label: "Medicamentos", icon: <Pill className="h-3.5 w-3.5" />, count: medications.length },
        { id: "cares", label: "Cuidados", icon: <ShieldAlert className="h-3.5 w-3.5" />, count: cares.length },
        { id: "packages", label: "Paquetes", icon: <Package className="h-3.5 w-3.5" />, count: packages.length },
    ];

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-2xl border border-slate-100 bg-white p-0 shadow-xl sm:max-w-[620px]">
                {/* Header */}
                <DialogHeader className="border-b border-slate-100 px-6 py-4">
                    <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                        <UserPlus className="h-5 w-5 text-blue-600" />
                        Agregar Paciente
                    </DialogTitle>
                    <DialogDescription className="text-sm text-slate-500">
                        Complete el formulario para registrar un nuevo paciente
                    </DialogDescription>
                </DialogHeader>

                <motion.form
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.16 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col"
                >
                    {/* Tabs de navegación */}
                    <div className="flex gap-1 border-b border-slate-100 px-6 pt-3">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-medium transition-colors ${activeTab === tab.id
                                    ? "border-b-2 border-blue-600 text-blue-600"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-100 px-1 text-[10px] font-semibold text-blue-700">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Contenido de tabs */}
                    <div className="space-y-3 px-6 py-4">

                        {/* ── Tab: Datos básicos ── */}
                        {activeTab === "basic" && (
                            <>
                                {/* Nombre + Cédula */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Nombre Completo</Label>
                                        <Input
                                            value={basic.fullName}
                                            onChange={(e) => setField("fullName", e.target.value)}
                                            placeholder="Nombre del paciente"
                                            className={inputCls}
                                        />
                                        {errors.fullName && <p className="text-[11px] text-red-500">{errors.fullName}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Cédula</Label>
                                        <div className="relative">
                                            <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                            <Input
                                                value={basic.idNumber}
                                                onChange={(e) => setField("idNumber", normalizeId(e.target.value))}
                                                placeholder="1-2345-6789"
                                                className={`${inputCls} pl-9`}
                                            />
                                        </div>
                                        {errors.idNumber && <p className="text-[11px] text-red-500">{errors.idNumber}</p>}
                                    </div>
                                </div>

                                {/* Fecha de nacimiento + Nivel de asistencia */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Fecha de Nacimiento</Label>
                                        <Input
                                            type="date"
                                            value={basic.birthDate}
                                            max={todayForInput()}
                                            onChange={(e) => setField("birthDate", e.target.value)}
                                            className={inputCls}
                                        />
                                        {basic.birthDate && (
                                            <p className="text-[11px] text-slate-400">
                                                Edad: {calcAge(basic.birthDate)} años
                                            </p>
                                        )}
                                        {errors.birthDate && <p className="text-[11px] text-red-500">{errors.birthDate}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Nivel de Asistencia</Label>
                                        <FilterCombobox
                                            value={basic.assistanceLevel}
                                            onChange={(v) => setField("assistanceLevel", v as AssistanceLevel | "all")}
                                            options={assistanceOptions}
                                            placeholder="Seleccione un nivel"
                                            searchPlaceholder="Buscar..."
                                            emptyMessage="No encontrado."
                                        />
                                        {errors.assistanceLevel && <p className="text-[11px] text-red-500">{errors.assistanceLevel}</p>}
                                    </div>
                                </div>

                                {/* Estado */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-medium text-slate-600">Estado inicial</Label>
                                        <FilterCombobox
                                            value={basic.status}
                                            onChange={(v) => setField("status", v as PatientStatus)}
                                            options={statusOptions}
                                            placeholder="Estado"
                                            searchPlaceholder="Buscar..."
                                            emptyMessage="No encontrado."
                                        />
                                    </div>
                                    <div /> {/* Espacio vacío para mantener grid */}
                                </div>

                                {/* Contacto de emergencia */}
                                <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <p className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                        Contacto de Emergencia
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-slate-400">Nombre</Label>
                                            <Input
                                                value={basic.emergencyName}
                                                onChange={(e) => setField("emergencyName", e.target.value)}
                                                placeholder="Nombre del contacto"
                                                className="h-9 rounded-xl border-slate-200 bg-white text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                            />
                                            {errors.emergencyName && <p className="text-[11px] text-red-500">{errors.emergencyName}</p>}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-slate-400">Teléfono</Label>
                                            <Input
                                                value={basic.emergencyPhone}
                                                onChange={(e) => setField("emergencyPhone", normalizePhone(e.target.value))}
                                                placeholder="8888-8888"
                                                className="h-9 rounded-xl border-slate-200 bg-white text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                            />
                                            {errors.emergencyPhone && <p className="text-[11px] text-red-500">{errors.emergencyPhone}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Código y fecha de admisión */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsManual((v) => !v)}
                                        className="flex w-full items-center justify-between"
                                    >
                                        <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                                            <Settings2 className="h-3.5 w-3.5 text-slate-400" />
                                            Código y fecha de admisión
                                        </span>
                                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-colors ${isManual ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-500"
                                            }`}>
                                            {isManual ? "Manual" : "Automático"}
                                        </span>
                                    </button>

                                    <div className="mt-2.5 grid grid-cols-2 gap-3">
                                        {isManual ? (
                                            <>
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-slate-400">Código</Label>
                                                    <Input
                                                        value={basic.manualCode}
                                                        onChange={(e) => setField("manualCode", e.target.value.toUpperCase())}
                                                        placeholder="PT-001"
                                                        className="h-9 rounded-xl border-slate-200 bg-white text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                    {errors.manualCode && <p className="text-[11px] text-red-500">{errors.manualCode}</p>}
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-slate-400">Fecha de admisión</Label>
                                                    <Input
                                                        type="date"
                                                        value={basic.manualDate}
                                                        max={todayForInput()}
                                                        onChange={(e) => setField("manualDate", e.target.value)}
                                                        className="h-9 rounded-xl border-slate-200 bg-white text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                                                    />
                                                    {errors.manualDate && <p className="text-[11px] text-red-500">{errors.manualDate}</p>}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-slate-400">Código generado</Label>
                                                    <Input value={generatedCode} disabled className="h-9 rounded-xl border-slate-200 bg-slate-100 text-sm text-slate-400" />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[11px] text-slate-400">Fecha de admisión</Label>
                                                    <Input value={generatedDate} disabled className="h-9 rounded-xl border-slate-200 bg-slate-100 text-sm text-slate-400" />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <p className="mt-2 text-[11px] text-slate-400">
                                        {isManual ? "Ingresando código y fecha manualmente." : "Código y fecha se asignan automáticamente."}
                                    </p>
                                </div>
                            </>
                        )}

                        {/* ── Tab: Medicamentos ── */}
                        {activeTab === "medications" && (
                            <div className="space-y-3">
                                {/* Lista de medicamentos agregados */}
                                {medications.length > 0 && (
                                    <div className="space-y-2">
                                        {medications.map((med) => (
                                            <div key={med.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{med.name}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {med.dose} — {med.frequency} — {med.schedule}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setMedications((prev) => prev.filter((m) => m.id !== med.id))}
                                                    className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Formulario de nuevo medicamento */}
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                                    <p className="text-xs font-medium text-slate-600">Agregar medicamento</p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-slate-400">Medicamento</Label>
                                            <FilterCombobox
                                                value={medForm.name}
                                                onChange={handleMedicamentoSelect}
                                                options={medicamentosOptions}
                                                placeholder="Seleccionar medicamento"
                                                searchPlaceholder="Buscar medicamento..."
                                                emptyMessage="No se encontraron medicamentos."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-slate-400">Dosis</Label>
                                            <Input value={medForm.dose} onChange={(e) => setMedForm((p) => ({ ...p, dose: e.target.value }))} placeholder="Ej. 500mg" className="h-9 rounded-xl border-slate-200 bg-white text-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-slate-400">Frecuencia</Label>
                                            <Input value={medForm.frequency} onChange={(e) => setMedForm((p) => ({ ...p, frequency: e.target.value }))} placeholder="Ej. 2 veces al día" className="h-9 rounded-xl border-slate-200 bg-white text-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-[11px] text-slate-400">Horario</Label>
                                            <Input value={medForm.schedule} onChange={(e) => setMedForm((p) => ({ ...p, schedule: e.target.value }))} placeholder="Ej. 08:00, 20:00" className="h-9 rounded-xl border-slate-200 bg-white text-sm" />
                                        </div>
                                    </div>
                                    <Input value={medForm.notes} onChange={(e) => setMedForm((p) => ({ ...p, notes: e.target.value }))} placeholder="Indicaciones adicionales (opcional)" className="h-9 rounded-xl border-slate-200 bg-white text-sm" />
                                    <Button
                                        type="button"
                                        onClick={addMedication}
                                        disabled={!medForm.name.trim() || !medForm.dose.trim() || !medForm.frequency.trim() || !medForm.schedule.trim()}
                                        className="h-9 w-full rounded-xl bg-blue-600 text-sm hover:bg-blue-700 disabled:opacity-40"
                                    >
                                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                                        Agregar medicamento
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Cuidados especiales ── */}
                        {activeTab === "cares" && (
                            <div className="space-y-3">
                                {cares.length > 0 && (
                                    <div className="space-y-2">
                                        {cares.map((care) => (
                                            <div key={care.id} className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{care.type}</p>
                                                    <p className="text-xs text-slate-500">{care.detail}</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setCares((prev) => prev.filter((c) => c.id !== care.id))}
                                                    className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                                    <p className="text-xs font-medium text-slate-600">Agregar cuidado especial</p>
                                    <FilterCombobox
                                        value={careForm.type}
                                        onChange={(v) => setCareForm((p) => ({ ...p, type: v as SpecialCare | "all" }))}
                                        options={specialCareOptions}
                                        placeholder="Tipo de cuidado"
                                        searchPlaceholder="Buscar..."
                                        emptyMessage="No encontrado."
                                    />
                                    <Input
                                        value={careForm.detail}
                                        onChange={(e) => setCareForm((p) => ({ ...p, detail: e.target.value }))}
                                        placeholder="Describe el cuidado especial..."
                                        className="h-9 rounded-xl border-slate-200 bg-white text-sm"
                                    />
                                    <Button
                                        type="button"
                                        onClick={addCare}
                                        disabled={careForm.type === "all" || !careForm.detail.trim()}
                                        className="h-9 w-full rounded-xl bg-blue-600 text-sm hover:bg-blue-700 disabled:opacity-40"
                                    >
                                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                                        Agregar cuidado
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* ── Tab: Paquetes adicionales ── */}
                        {activeTab === "packages" && (
                            <div className="space-y-3">
                                {packages.length > 0 && (
                                    <div className="space-y-2">
                                        {packages.map((pkg) => (
                                            <div key={pkg.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                                                <p className="text-sm font-semibold text-slate-900">{pkg.type}</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setPackages((prev) => prev.filter((p) => p.id !== pkg.id))}
                                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                                    <p className="text-xs font-medium text-slate-600">Agregar paquete adicional</p>
                                    <FilterCombobox
                                        value={pkgForm.type}
                                        onChange={(v) => setPkgForm({ type: v as AdditionalPackage | "all" })}
                                        options={packageOptions.filter((o) =>
                                            o.value === "all" || !packages.some((p) => p.type === o.value)
                                        )}
                                        placeholder="Seleccionar paquete"
                                        searchPlaceholder="Buscar..."
                                        emptyMessage="Todos los paquetes ya fueron asignados."
                                    />
                                    <Button
                                        type="button"
                                        onClick={addPackage}
                                        disabled={pkgForm.type === "all"}
                                        className="h-9 w-full rounded-xl bg-blue-600 text-sm hover:bg-blue-700 disabled:opacity-40"
                                    >
                                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                                        Agregar paquete
                                    </Button>
                                </div>

                                <p className="text-[11px] text-slate-400">
                                    Máximo 3 paquetes. Los paquetes ya asignados no aparecen en la lista.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Acciones fijas al fondo */}
                    <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
                        {/* Navegación entre tabs */}
                        <div className="flex gap-2">
                            {activeTab !== "basic" && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const order: TabId[] = ["basic", "medications", "cares", "packages"];
                                        const idx = order.indexOf(activeTab);
                                        setActiveTab(order[idx - 1]);
                                    }}
                                    className="h-9 rounded-xl border-slate-200 px-3 text-sm"
                                >
                                    Anterior
                                </Button>
                            )}
                            {activeTab !== "packages" && (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const order: TabId[] = ["basic", "medications", "cares", "packages"];
                                        const idx = order.indexOf(activeTab);
                                        setActiveTab(order[idx + 1]);
                                    }}
                                    className="h-9 rounded-xl bg-slate-100 px-3 text-sm text-slate-700 hover:bg-slate-200"
                                >
                                    Siguiente
                                </Button>
                            )}
                        </div>

                        {/* Cancelar + Guardar */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="h-10 rounded-xl border-slate-200 px-4 text-sm"
                            >
                                <X className="mr-1.5 h-3.5 w-3.5" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700 active:scale-[0.98]"
                            >
                                <Save className="mr-1.5 h-3.5 w-3.5" />
                                Guardar Paciente
                            </Button>
                        </div>
                    </div>
                </motion.form>
            </DialogContent>
        </Dialog>
    );
}