interface EmployeesHeaderProps {
    title: string;
    subtitle: string;
}

export default function EmployeesHeader({
    title,
    subtitle,
}: EmployeesHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-[34px] font-semibold leading-tight text-gray-900">
                    {title}
                </h1>
                <p className="mt-2 max-w-3xl text-[16px] leading-7 text-gray-500">
                    {subtitle}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button className="inline-flex h-11 items-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
                    Filtros
                </button>

                <button className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700">
                    Agregar empleado
                </button>
            </div>
        </div>
    );
}