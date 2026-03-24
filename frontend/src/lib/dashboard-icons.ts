import {
    BedDouble,
    BriefcaseMedical,
    CalendarPlus,
    FileText,
    HeartPulse,
    UserPlus,
    Users,
    type LucideIcon,
} from "lucide-react";

import type { DashboardIconName } from "@/src/types/dashboard";

export const dashboardIcons: Record<DashboardIconName, LucideIcon> = {
    users: Users,
    heartPulse: HeartPulse,
    bedDouble: BedDouble,
    briefcaseMedical: BriefcaseMedical,
    userPlus: UserPlus,
    calendarPlus: CalendarPlus,
    fileText: FileText,
};