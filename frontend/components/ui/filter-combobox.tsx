"use client";

import * as React from "react";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";

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
    searchPlaceholder = "Buscar...",
    emptyMessage = "No se encontraron resultados.",
}: FilterComboboxProps) {
    const safeOptions = Array.isArray(options) ? options : [];

    return (
        <Combobox
            items={safeOptions}
            value={value}
            onValueChange={(nextValue) => onChange(nextValue || "all")}
        >
            <ComboboxTrigger
                render={
                    <Button
                        variant="outline"
                        className="h-12 w-full justify-between rounded-xl border-gray-200 bg-white px-4 text-sm font-normal text-gray-700 shadow-none hover:bg-gray-50"
                    />
                }
            >
                <ComboboxValue placeholder={placeholder} />
            </ComboboxTrigger>

            <ComboboxContent className="w-[var(--anchor-width)] p-0">
                <div className="border-b border-gray-100 p-2">
                    <ComboboxInput
                        placeholder={searchPlaceholder}
                        className="w-full"
                        showTrigger={false}
                        showClear
                    />
                </div>

                <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>

                <ComboboxList className="max-h-64 p-1">
                    {safeOptions.map((option) => (
                        <ComboboxItem key={option.value} value={option.value}>
                            {option.label}
                        </ComboboxItem>
                    ))}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}