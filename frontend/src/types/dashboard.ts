import { LucideIcon } from "lucide-react";

export type StatAccent = "blue" | "green" | "indigo" | "amber";

export interface DashboardStat {
    id: string;
    label: string;
    value: number;
    description: string;
    badge: string;
    accent: StatAccent;
    icon: LucideIcon;
}

export interface ActivityItem {
    id: string;
    initials: string;
    patientName: string;
    eventDescription: string;
    type: string;
    room: string;
    timeAgo: string;
    typeColor: "green" | "blue" | "amber" | "gray";
}

export interface QuickActionItem {
    id: string;
    label: string;
    icon: LucideIcon;
    accent: "blue" | "green" | "amber";
}

export interface PulseMember {
    id: string;
    name: string;
    initials: string;
    bgClass: string;
}

export interface DashboardPulse {
    pendingCount: number;
    label: string;
    description: string;
    members: PulseMember[];
    extraCount: number;
}

export interface CapacityBar {
    id: string;
    value: number;
    accent: "gray" | "blueLight" | "blue" | "blueDark";
}

export interface DashboardCapacityTrend {
    startLabel: string;
    endLabel: string;
    bars: CapacityBar[];
}

export interface DashboardData {
    title: string;
    subtitle: string;
    stats: DashboardStat[];
    recentActivity: ActivityItem[];
    quickActions: QuickActionItem[];
    pulse: DashboardPulse;
    capacityTrend: DashboardCapacityTrend;
}