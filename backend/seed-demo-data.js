const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('123', 10);
  
  console.log('=== CREANDO DATOS DEMO ===\n');

  // 1. Crear más reservaciones históricas para los pacientes existentes
  console.log('Creando reservaciones históricas...');
  
  const reservacionesHistoricas = [
    // Rosa María - historial de 2025
    { paciente: 1, habitacion: 4, tipo: 1, estado: 2, fechaInicio: '2025-01-15', fechaFin: '2025-01-20', empleado: 1 },
    { paciente: 1, habitacion: 3, tipo: 4, estado: 2, fechaInicio: '2025-03-10', fechaFin: '2025-03-25', empleado: 1 },
    { paciente: 1, habitacion: 5, tipo: 2, estado: 3, fechaInicio: '2025-05-01', fechaFin: '2025-05-05', empleado: 1 }, // Cancelada
    
    // Mercedes - historial
    { paciente: 3, habitacion: 6, tipo: 4, estado: 2, fechaInicio: '2025-02-01', fechaFin: '2025-02-28', empleado: 2 },
    { paciente: 3, habitacion: 4, tipo: 1, estado: 2, fechaInicio: '2025-06-15', fechaFin: '2025-06-20', empleado: 2 },
    
    // Ernesto - historial  
    { paciente: 4, habitacion: 7, tipo: 4, estado: 2, fechaInicio: '2025-01-05', fechaFin: '2025-01-30', empleado: 3 },
    { paciente: 4, habitacion: 5, tipo: 2, estado: 2, fechaInicio: '2025-04-10', fechaFin: '2025-04-15', empleado: 3 },
    { paciente: 4, habitacion: 4, tipo: 3, estado: 3, fechaInicio: '2025-07-01', fechaFin: '2025-07-10', empleado: 3 }, // Cancelada
    
    // Gloria - historial
    { paciente: 5, habitacion: 3, tipo: 4, estado: 2, fechaInicio: '2025-02-15', fechaFin: '2025-03-15', empleado: 4 },
    { paciente: 5, habitacion: 6, tipo: 1, estado: 2, fechaInicio: '2025-05-20', fechaFin: '2025-05-25', empleado: 4 },
    
    // Reservaciones de 2026 (año actual)
    { paciente: 1, habitacion: 4, tipo: 2, estado: 2, fechaInicio: '2026-01-10', fechaFin: '2026-01-20', empleado: 1 },
    { paciente: 3, habitacion: 5, tipo: 1, estado: 2, fechaInicio: '2026-01-15', fechaFin: '2026-01-18', empleado: 2 },
    { paciente: 4, habitacion: 7, tipo: 4, estado: 2, fechaInicio: '2026-02-01', fechaFin: '2026-02-28', empleado: 3 },
    { paciente: 5, habitacion: 4, tipo: 3, estado: 2, fechaInicio: '2026-02-10', fechaFin: '2026-02-15', empleado: 4 },
    { paciente: 1, habitacion: 6, tipo: 1, estado: 2, fechaInicio: '2026-03-01', fechaFin: '2026-03-10', empleado: 1 },
    { paciente: 3, habitacion: 3, tipo: 2, estado: 3, fechaInicio: '2026-03-15', fechaFin: '2026-03-20', empleado: 2 }, // Cancelada
  ];

  for (const r of reservacionesHistoricas) {
    try {
      await prisma.reservacion.create({
        data: {
          Paciente_idPaciente: r.paciente,
          Habitacion_idHabitacion: r.habitacion,
          Catalogo_Tipo_Estancia_idEstancia: r.tipo,
          Catalogo_Estado_Reservacion_idEstado: r.estado,
          Empleado_idEmpleado_Registra: r.empleado,
          Fecha_Inicio: new Date(r.fechaInicio),
          Fecha_Fin: new Date(r.fechaFin),
          Fecha_Registro: new Date(r.fechaInicio),
          Observaciones: r.estado === 2 ? 'Estancia completada satisfactoriamente' : 'Cancelada por el paciente',
          Activo: true
        }
      });
      console.log(`  ✓ Reservación: Paciente ${r.paciente}, ${r.fechaInicio} - Estado: ${r.estado === 2 ? 'Finalizada' : 'Cancelada'}`);
    } catch (e) {
      // Ignorar duplicados
    }
  }

  // 2. Actualizar usuarios de pacientes con usernames simples
  console.log('\nActualizando usuarios de pacientes...');
  
  const usuariosPacientes = [
    { pacienteId: 1, username: 'rosa', email: 'rosa@patitos.cr' },
    { pacienteId: 3, username: 'mercedes', email: 'mercedes@patitos.cr' },
    { pacienteId: 4, username: 'ernesto', email: 'ernesto@patitos.cr' },
    { pacienteId: 5, username: 'gloria', email: 'gloria@patitos.cr' },
    { pacienteId: 7, username: 'josue', email: 'josue@patitos.cr' },
    { pacienteId: 8, username: 'daniela', email: 'daniela@patitos.cr' },
    { pacienteId: 9, username: 'iris', email: 'iris@patitos.cr' },
  ];

  for (const u of usuariosPacientes) {
    try {
      // Verificar si existe el paciente
      const paciente = await prisma.paciente.findUnique({ where: { idPaciente: u.pacienteId } });
      if (!paciente) continue;

      // Buscar usuario existente o crear
      const existente = await prisma.usuario_Paciente.findFirst({
        where: { Paciente_idPaciente: u.pacienteId }
      });

      if (existente) {
        await prisma.usuario_Paciente.update({
          where: { idUsuario_Paciente: existente.idUsuario_Paciente },
          data: { Nombre_usuario: u.username, Contrasena: hash, Email: u.email }
        });
      } else {
        await prisma.usuario_Paciente.create({
          data: {
            Nombre_usuario: u.username,
            Contrasena: hash,
            Email: u.email,
            Paciente_idPaciente: u.pacienteId,
            Cambio_Contrasena: false
          }
        });
      }
      console.log(`  ✓ Usuario: ${u.username} -> ${paciente.Nombre}`);
    } catch (e) {
      console.log(`  ✗ Error con ${u.username}:`, e.message);
    }
  }

  // 3. Actualizar usuarios de empleados con usernames simples
  console.log('\nActualizando usuarios de empleados...');
  
  const usuariosEmpleados = [
    { id: 1, username: 'carlos' },
    { id: 2, username: 'laura' },
    { id: 3, username: 'maria' },
    { id: 4, username: 'sofia' },
    { id: 5, username: 'diego' },
    { id: 6, username: 'ana' },
  ];

  for (const u of usuariosEmpleados) {
    try {
      const usuario = await prisma.usuario.findFirst({
        where: { Empleado_idEmpleado: u.id }
      });
      
      if (usuario) {
        await prisma.usuario.update({
          where: { idUsuario: usuario.idUsuario },
          data: { Nombre_usuario: u.username, Contrasena: hash }
        });
        
        const empleado = await prisma.empleado.findUnique({ 
          where: { idEmpleado: u.id },
          include: { Perfil: true }
        });
        console.log(`  ✓ Usuario: ${u.username} -> ${empleado?.Nombre} (${empleado?.Perfil?.Nombre_Perfil})`);
      }
    } catch (e) {
      console.log(`  ✗ Error con empleado ${u.id}:`, e.message);
    }
  }

  // Resumen final
  console.log('\n=== RESUMEN DE USUARIOS ===\n');
  
  console.log('EMPLEADOS (Portal: /auth/login)');
  console.log('─'.repeat(50));
  const empleados = await prisma.usuario.findMany({
    include: { Empleado: { include: { Perfil: true } } }
  });
  empleados.forEach(u => {
    console.log(`  ${u.Nombre_usuario.padEnd(12)} | ${u.Empleado?.Nombre?.padEnd(25)} | ${u.Empleado?.Perfil?.Nombre_Perfil}`);
  });

  console.log('\nPACIENTES (Portal: /auth/login-paciente)');
  console.log('─'.repeat(50));
  const pacientes = await prisma.usuario_Paciente.findMany({
    include: { Paciente: true }
  });
  pacientes.forEach(u => {
    console.log(`  ${u.Nombre_usuario.padEnd(12)} | ${u.Paciente?.Nombre}`);
  });

  console.log('\n Contraseña para todos: 123');
  
  // Estadísticas
  const totalReservaciones = await prisma.reservacion.count();
  const finalizadas = await prisma.reservacion.count({ where: { Catalogo_Estado_Reservacion_idEstado: 2 } });
  const canceladas = await prisma.reservacion.count({ where: { Catalogo_Estado_Reservacion_idEstado: 3 } });
  const activas = await prisma.reservacion.count({ where: { Catalogo_Estado_Reservacion_idEstado: 1 } });
  
  console.log('\n=== ESTADÍSTICAS DE RESERVACIONES ===');
  console.log(`  Total: ${totalReservaciones}`);
  console.log(`  Activas: ${activas}`);
  console.log(`  Finalizadas: ${finalizadas}`);
  console.log(`  Canceladas: ${canceladas}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
