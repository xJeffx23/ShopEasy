export const dynamic = "force-dynamic";
import PatientPanelView from "@/components/patient-panel/patient-panel-view";
import { getPatientPanelData } from "@/services/patient-panel.service";

export const metadata = {
    title: "Panel del Paciente | Patitos del Retiro",
};

export default async function PatientPanelPage() {
    const data = await getPatientPanelData();
    return <PatientPanelView data={data} />;
}