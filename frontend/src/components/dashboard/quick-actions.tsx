"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { dashboardIcons } from "@/src/lib/dashboard-icons";
import { Button } from "@/src/components/ui/button";
import { QuickActionItem } from "@/src/types/dashboard";

interface QuickActionsProps {
    actions: QuickActionItem[];
}

function getAccentColor(accent: QuickActionItem["accent"]) {
    switch (accent) {
        case "blue":
            return "text-blue-600";
        case "green":
            return "text-emerald-600";
        case "amber":
            return "text-amber-700";
        default:
            return "text-slate-600";
    }
}

export default function QuickActions({ actions }: QuickActionsProps) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-base font-semibold text-slate-900">
                    Acciones rápidas
                </h3>
                <p className="text-sm text-slate-500">
                    Accesos directos a tareas frecuentes del sistema.
                </p>
            </div>

            <div className="space-y-3">
                {actions.map((action, index) => {
                    const Icon = dashboardIcons[action.iconName];

                    return (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.04 }}
                        >
                            <Button
                                variant="outline"
                                className="h-12 w-full justify-between rounded-xl border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <span className="flex items-center gap-3">
                                    <Icon className={`h-4 w-4 ${getAccentColor(action.accent)}`} />
                                    <span>{action.label}</span>
                                </span>

                                <ChevronRight className="h-4 w-4 text-slate-400" />
                            </Button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}