interface DashboardHeaderProps {
    title: string;
    subtitle: string;
}

export default function DashboardHeader({
    title,
    subtitle,
}: DashboardHeaderProps) {
    return (
        <div>
            <h1 className="text-[44px] font-semibold leading-tight text-gray-900">
                {title}
            </h1>
            <p className="mt-2 text-[20px] text-gray-500">{subtitle}</p>
        </div>
    );
}