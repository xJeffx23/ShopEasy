"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterComboboxOption {
    label: string;
    value: string;
}

interface FilterComboboxProps {
    value: string;
    onChange: (value: string) => void;
    options: FilterComboboxOption[];
    placeholder: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
}

export default function FilterCombobox({
    value,
    onChange,
    options,
    placeholder,
}: FilterComboboxProps) {
    const safeOptions = Array.isArray(options) ? options : [];

    return (
        <SelectPrimitive.Root
            value={value}
            onValueChange={(val) => onChange(val || "all")}
        >
            <SelectPrimitive.Trigger
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none",
                    "hover:bg-slate-50 focus:border-blue-300 focus:ring-2 focus:ring-blue-100",
                    "data-[placeholder]:text-slate-400",
                    "[&>span]:line-clamp-1"
                )}
            >
                <SelectPrimitive.Value placeholder={placeholder} />
                <SelectPrimitive.Icon asChild>
                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    position="popper"
                    sideOffset={4}
                    className={cn(
                        "relative z-[9999] min-w-[var(--radix-select-trigger-width)] overflow-hidden",
                        "rounded-xl border border-slate-200 bg-white shadow-lg",
                        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
                        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
                        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                    )}
                >
                    <SelectPrimitive.Viewport className="p-1">
                        {safeOptions.map((option) => (
                            <SelectPrimitive.Item
                                key={option.value}
                                value={option.value}
                                className={cn(
                                    "relative flex w-full cursor-default select-none items-center rounded-lg py-2 pl-3 pr-8 text-sm outline-none",
                                    "text-slate-700 focus:bg-slate-100 focus:text-slate-900",
                                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                )}
                            >
                                <SelectPrimitive.ItemText>
                                    {option.label}
                                </SelectPrimitive.ItemText>
                                <SelectPrimitive.ItemIndicator className="absolute right-2 flex h-4 w-4 items-center justify-center">
                                    <Check className="h-3.5 w-3.5 text-blue-600" />
                                </SelectPrimitive.ItemIndicator>
                            </SelectPrimitive.Item>
                        ))}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}