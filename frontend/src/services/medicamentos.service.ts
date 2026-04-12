import api from './api';

export interface MedicamentoCatalogo {
  id: number;
  nombre: string;
  dosis?: string;
  frecuencia?: string;
  indicaciones?: string;
}

export const medicamentosService = {
  // Obtener medicamentos únicos desde los registros existentes
  async getMedicamentosUnicos(): Promise<MedicamentoCatalogo[]> {
    try {
      // Obtenemos todos los medicamentos de los pacientes
      const response = await api.get('/pacientes');
      const pacientes = response.data;
      
      // Extraemos medicamentos únicos
      const medicamentosMap = new Map<string, MedicamentoCatalogo>();
      
      pacientes.forEach((paciente: any) => {
        if (paciente.Medicamentos && Array.isArray(paciente.Medicamentos)) {
          paciente.Medicamentos.forEach((med: any, index: number) => {
            const nombre = med.Nombre_Medicamento?.trim();
            if (nombre && !medicamentosMap.has(nombre)) {
              medicamentosMap.set(nombre, {
                id: index + 1,
                nombre: nombre,
                dosis: med.Dosis || '',
                frecuencia: med.Frecuencia || '',
                indicaciones: med.Indicaciones || ''
              });
            }
          });
        }
      });
      
      // Convertimos a array y ordenamos alfabéticamente
      return Array.from(medicamentosMap.values()).sort((a, b) => 
        a.nombre.localeCompare(b.nombre)
      );
    } catch (error) {
      console.error('Error al obtener medicamentos únicos:', error);
      // Retornar medicamentos comunes como fallback
      return [
        { id: 1, nombre: 'Metformina', dosis: '500mg', frecuencia: '2 veces al día' },
        { id: 2, nombre: 'Atorvastatina', dosis: '20mg', frecuencia: '1 vez por la noche' },
        { id: 3, nombre: 'Losartán', dosis: '50mg', frecuencia: '1 vez al día' },
        { id: 4, nombre: 'Omeprazol', dosis: '20mg', frecuencia: 'En ayunas' },
        { id: 5, nombre: 'Warfarina', dosis: '5mg', frecuencia: '1 vez al día' },
        { id: 6, nombre: 'Furosemida', dosis: '40mg', frecuencia: 'En la mañana' },
        { id: 7, nombre: 'Amlodipino', dosis: '10mg', frecuencia: '1 vez al día' },
        { id: 8, nombre: 'Alprazolam', dosis: '0.25mg', frecuencia: 'Al dormir' }
      ];
    }
  },

  // Obtener opciones para el ComboBox
  async getMedicamentosOptions() {
    const medicamentos = await this.getMedicamentosUnicos();
    return [
      { label: "Seleccionar medicamento", value: "all" },
      ...medicamentos.map(med => ({
        label: med.nombre,
        value: med.nombre,
        data: med
      }))
    ];
  }
};
