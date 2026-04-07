import { PatientsData } from "@/src/types/patient";

export const patientsMock: PatientsData = {
    title: "Pacientes",
    subtitle: "Gestión de residentes del asilo",

    stats: {
        total: 5,
        lowAssistance: 1,
        midAssistance: 2,
        highAssistance: 2,
    },

    patients: [
        {
            id: "pat-1",
            patientCode: "PT-001",
            fullName: "Carmen Villalobos Ruiz",
            idNumber: "1-0234-5678",
            birthDate: "12/03/1945",
            age: 78,
            admissionDate: "13/02/2023",
            roomNumber: "101",
            assistanceLevel: "Asistencia para movilidad",
            status: "activo",
            emergencyContact: { name: "Pedro Villalobos", phone: "8765-4321" },
            medications: [
                {
                    id: "med-1", name: "Metformina", dose: "500mg",
                    frequency: "2 veces al día", schedule: "08:00, 20:00",
                },
                {
                    id: "med-2", name: "Losartán", dose: "50mg",
                    frequency: "1 vez al día", schedule: "08:00",
                },
            ],
            specialCares: [
                { id: "sc-1", type: "Dietas especiales", detail: "Sin sal, sin azúcar refinada" },
            ],
            packages: [
                { id: "pkg-1", type: "Visitas a los familiares", assignedDate: "13/02/2023", active: true },
            ],
        },
        {
            id: "pat-2",
            patientCode: "PT-002",
            fullName: "Fernando Mora Quesada",
            idNumber: "1-0345-6789",
            birthDate: "05/07/1941",
            age: 82,
            admissionDate: "19/08/2022",
            roomNumber: "102",
            assistanceLevel: "Asistencia completa",
            status: "activo",
            emergencyContact: { name: "Lucía Mora", phone: "8234-5678" },
            medications: [
                {
                    id: "med-3", name: "Atorvastatina", dose: "20mg",
                    frequency: "1 vez al día", schedule: "20:00",
                },
            ],
            specialCares: [
                { id: "sc-2", type: "Cambios de vendajes", detail: "Herida en pierna derecha, cambio cada 48h" },
                { id: "sc-3", type: "Alergias", detail: "Alérgico a penicilina" },
            ],
            packages: [
                { id: "pkg-2", type: "Disfrute de juegos", assignedDate: "19/08/2022", active: true },
                { id: "pkg-3", type: "Paseos a sitios con acompañamiento", assignedDate: "01/01/2023", active: false },
            ],
        },
        {
            id: "pat-3",
            patientCode: "PT-003",
            fullName: "Isabel Chacón Navarro",
            idNumber: "2-0456-7890",
            birthDate: "22/11/1948",
            age: 75,
            admissionDate: "09/05/2023",
            roomNumber: "201",
            assistanceLevel: "Asistencia básica",
            status: "activo",
            emergencyContact: { name: "Rosa Chacón", phone: "8345-6789" },
            medications: [],
            specialCares: [],
            packages: [
                { id: "pkg-4", type: "Visitas a los familiares", assignedDate: "09/05/2023", active: true },
            ],
        },
        {
            id: "pat-4",
            patientCode: "PT-004",
            fullName: "Alberto Méndez Solís",
            idNumber: "1-0567-8901",
            birthDate: "14/01/1938",
            age: 85,
            admissionDate: "04/11/2021",
            roomNumber: "202",
            assistanceLevel: "Asistencia completa",
            status: "activo",
            emergencyContact: { name: "Jorge Méndez", phone: "8456-7890" },
            medications: [
                {
                    id: "med-4", name: "Omeprazol", dose: "20mg",
                    frequency: "1 vez al día", schedule: "07:00",
                },
                {
                    id: "med-5", name: "Furosemida", dose: "40mg",
                    frequency: "1 vez al día", schedule: "08:00",
                },
            ],
            specialCares: [
                { id: "sc-4", type: "Alergias", detail: "Intolerancia a la lactosa" },
                { id: "sc-5", type: "Dietas especiales", detail: "Dieta blanda, alimentos triturados" },
            ],
            packages: [],
        },
        {
            id: "pat-5",
            patientCode: "PT-005",
            fullName: "Marta Rojas Vindas",
            idNumber: "3-0678-9012",
            birthDate: "30/06/1944",
            age: 79,
            admissionDate: "31/08/2023",
            roomNumber: "103",
            assistanceLevel: "Asistencia para alimentación",
            status: "activo",
            emergencyContact: { name: "Carlos Rojas", phone: "8567-8901" },
            medications: [
                {
                    id: "med-6", name: "Alprazolam", dose: "0.25mg",
                    frequency: "1 vez al día", schedule: "21:00",
                },
            ],
            specialCares: [],
            packages: [
                { id: "pkg-5", type: "Disfrute de juegos", assignedDate: "31/08/2023", active: true },
                { id: "pkg-6", type: "Visitas a los familiares", assignedDate: "31/08/2023", active: true },
            ],
        },
    ],
};