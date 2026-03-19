import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { EmployeeItem, EmployeeStatus } from "@/src/types/employee";

interface EmployeesTableProps {
    employees: EmployeeItem[];
}

function getDepartmentBadge(department: EmployeeItem["department"]) {
    switch (department) {
        case "Enfermería":
            return "bg-slate-100 text-slate-700";
        case "Médico":
            return "bg-blue-100 text-blue-700";
        case "Administración":
            return "bg-violet-100 text-violet-700";
        case "Mantenimiento":
            return "bg-amber-100 text-amber-700";
        case "Nutrición":
            return "bg-emerald-100 text-emerald-700";
        case "Seguridad":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

function getStatusBadge(status: EmployeeStatus) {
    switch (status) {
        case "activo":
            return "bg-emerald-100 text-emerald-700";
        case "de permiso":
            return "bg-blue-100 text-blue-700";
        case "en capacitación":
            return "bg-amber-100 text-amber-700";
        case "inactivo":
            return "bg-gray-100 text-gray-600";
        default:
            return "bg-gray-100 text-gray-600";
    }
}

function getStatusText(status: EmployeeStatus) {
    switch (status) {
        case "activo":
            return "Activo";
        case "de permiso":
            return "De permiso";
        case "en capacitación":
            return "Capacitación";
        case "inactivo":
            return "Inactivo";
    }
}

export default function EmployeesTable({
    employees,
}: EmployeesTableProps) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.03)]">
            <div className="grid grid-cols-[2.2fr_1.2fr_1fr_1.3fr_1.2fr_1fr] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.08em] text-gray-400">
                <span>Nombre</span>
                <span>Código</span>
                <span>Ingreso</span>
                <span>Departamento</span>
                <span>Cargo</span>
                <span>Estado</span>
            </div>

            {employees.map((employee) => (
                <div
                    key={employee.id}
                    className="grid grid-cols-[2.2fr_1.2fr_1fr_1.3fr_1.2fr_1fr] items-center border-t border-gray-100 px-6 py-5"
                >
                    <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11">
                            <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />
                            <AvatarFallback className="bg-blue-50 text-sm font-semibold text-blue-600">
                                {employee.initials}
                            </AvatarFallback>
                        </Avatar>

                        <div>
                            <p className="text-[16px] font-semibold text-gray-900">
                                {employee.fullName}
                            </p>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                    </div>

                    <div className="text-sm font-medium text-gray-600">
                        {employee.employeeCode}
                    </div>

                    <div className="text-sm text-gray-600">{employee.hireDate}</div>

                    <div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getDepartmentBadge(
                                employee.department
                            )}`}
                        >
                            {employee.department}
                        </span>
                    </div>

                    <div className="text-sm font-medium text-gray-700">
                        {employee.role}
                    </div>

                    <div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(
                                employee.status
                            )}`}
                        >
                            {getStatusText(employee.status)}
                        </span>
                    </div>
                </div>
            ))}

            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                <p className="text-sm text-gray-500">
                    Mostrando 1-{employees.length} de {employees.length} empleados
                </p>

                <div className="flex items-center gap-2">
                    <button className="h-8 min-w-8 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white">
                        1
                    </button>
                    <button className="h-8 min-w-8 rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-100">
                        2
                    </button>
                    <button className="h-8 min-w-8 rounded-lg px-3 text-sm text-gray-500 hover:bg-gray-100">
                        3
                    </button>
                </div>
            </div>
        </div>
    );
}