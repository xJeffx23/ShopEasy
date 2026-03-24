"use client";

import { useMemo, useState } from "react";
import { mockPatients } from "@/src/data/mock-patients";
import { PatientsFilters } from "@/src/components/patients/patients-filters";
import { PatientsHeader } from "@/src/components/patients/patients-header";
import { PatientsPagination } from "@/src/components/patients/patients-pagination";
import { PatientsStats } from "@/src/components/patients/patients-stats";
import { PatientsTable } from "@/src/components/patients/patients-table";
import { WeeklyTrendCard } from "@/src/components/patients/weekly-trend-card";

const PAGE_SIZE = 5;

export default function PatientsPage() {
    const [assistanceFilter, setAssistanceFilter] = useState("All");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredPatients = useMemo(() => {
        return mockPatients.filter((patient) => {
            const matchesAssistance =
                assistanceFilter === "All" ||
                patient.assistanceLevel === assistanceFilter;

            const matchesDepartment =
                departmentFilter === "All" || patient.department === departmentFilter;

            const matchesSearch =
                patient.fullName.toLowerCase().includes(search.toLowerCase()) ||
                patient.patientCode.toLowerCase().includes(search.toLowerCase()) ||
                patient.roomNumber.toLowerCase().includes(search.toLowerCase());

            return matchesAssistance && matchesDepartment && matchesSearch;
        });
    }, [assistanceFilter, departmentFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filteredPatients.length / PAGE_SIZE));

    const paginatedPatients = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return filteredPatients.slice(start, start + PAGE_SIZE);
    }, [filteredPatients, currentPage]);

    const highAssistanceCount = mockPatients.filter(
        (patient) => patient.assistanceLevel === "Full Assistance"
    ).length;

    const handleAssistanceChange = (value: string) => {
        setAssistanceFilter(value);
        setCurrentPage(1);
    };

    const handleDepartmentChange = (value: string) => {
        setDepartmentFilter(value);
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <section className="space-y-6 bg-slate-50 p-6">
            <PatientsHeader />

            <PatientsStats
                totalResidents={142}
                capacityPercentage={84}
                highAssistance={highAssistanceCount}
                activeTransfers={3}
            />

            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
                <PatientsFilters
                    assistanceFilter={assistanceFilter}
                    departmentFilter={departmentFilter}
                    search={search}
                    onAssistanceChange={handleAssistanceChange}
                    onDepartmentChange={handleDepartmentChange}
                    onSearchChange={handleSearchChange}
                />

                <PatientsTable
                    patients={paginatedPatients}
                    currentPage={currentPage}
                    pageSize={PAGE_SIZE}
                    totalItems={filteredPatients.length}
                />

                <PatientsPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <WeeklyTrendCard />
        </section>
    );
}