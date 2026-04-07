import PatientsView from "@/src/components/patients/patientsView";
import { getPatientsData } from "@/src/services/patients.service";

export const metadata = {
    title: "Pacientes | Patitos del Retiro",
};

export default async function PatientsPage() {
    const data = await getPatientsData();
    return <PatientsView data={data} />;
}