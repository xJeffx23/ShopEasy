// ─── Capacity Trend ──────────────────────────────────────────────────────────

export interface CapacityDataPoint {
    day: string;
    occupancy: number;
}

export interface DashboardTrend {
    occupancyRate: number;
    weeklyData: CapacityDataPoint[];
}

// ─── Room Status Chart ────────────────────────────────────────────────────────

export interface RoomStatusData {
    name: string;
    value: number;
    color: string;
}

// ─── Care Level Chart ─────────────────────────────────────────────────────────

export interface CareLevel {
    level: string;
    count: number;
    color: string;
}

// ─── Quick Summary ────────────────────────────────────────────────────────────

export interface QuickSummaryData {
    occupancyRate: number;
    roomsInMaintenance: number;
    staffPerPatient: number;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export type StatAccent = "blue" | "green" | "indigo" | "amber";

export interface DashboardStat {
    id: string;
    label: string;
    value: string;
    description: string;
    badge: string;
    iconName: string;
    accent: StatAccent;
}

// ─── Activity ─────────────────────────────────────────────────────────────────

export interface ActivityItem {
    id: string;
    patientName: string;
    initials: string;
    eventDescription: string;
    type: string;
    typeColor: "green" | "blue" | "amber" | "default";
    room: string;
    timeAgo: string;
}

// ─── Pulse ────────────────────────────────────────────────────────────────────

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

// ─── Quick Actions ────────────────────────────────────────────────────────────

export interface QuickActionItem {
    id: string;
    label: string;
    iconName: string;
    accent: "blue" | "green" | "amber" | "default";
    href: string;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export interface DashboardData {
    title: string;
    subtitle: string;
    stats: DashboardStat[];
    recentActivity: ActivityItem[];
    pulse: DashboardPulse;
    quickActions: QuickActionItem[];
    trend: DashboardTrend;
    roomStatus: RoomStatusData[];
    careLevels: CareLevel[];
    quickSummary: QuickSummaryData;
}