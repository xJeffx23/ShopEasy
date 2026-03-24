interface DashboardHeaderProps {
    title: string;
    subtitle: string;
}

export default function DashboardHeader({
    title,
    subtitle,
}: DashboardHeaderProps) {
    return (
        <header className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                {title}
            </h1>
            <p className="max-w-3xl text-sm text-slate-500 md:text-base">
                {subtitle}
            </p>
        </header>
    );
}