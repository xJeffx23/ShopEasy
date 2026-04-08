import PatientPanelView from "@/src/components/patient-panel/patient-panel-view";
import { getPatientPanelData } from "@/src/services/patient-panel.service";

export const metadata = {
    title: "Panel del Paciente | Patitos del Retiro",
};

export default async function PatientPanelPage() {
    const data = await getPatientPanelData();
    return <PatientPanelView data={data} />;
}