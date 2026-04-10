export class CreatePacienteDto {
  Nombre: string;
  Apellidos: string;
  Numero_Cedula: string;
  Fecha_Nacimiento: Date;
  Fecha_Ingreso: Date;
  Telefono_Contacto_Emergencia: string;
  Nombre_Contacto_Emergencia: string;
  Nivel_Asistencia_idNivel: number;
  Activo: boolean;
}
