const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('123', 10);
  
  // Actualizar todos los usuarios de pacientes con la contraseña 123
  const usuarios = await prisma.usuario_Paciente.findMany({
    include: { Paciente: true }
  });
  
  for (const u of usuarios) {
    await prisma.usuario_Paciente.update({
      where: { idUsuario_Paciente: u.idUsuario_Paciente },
      data: { Contrasena: hash }
    });
    console.log('Actualizado:', u.Nombre_usuario, '-> Paciente:', u.Paciente?.Nombre || 'N/A');
  }
  
  console.log('\n=== USUARIOS DE PACIENTES DISPONIBLES ===');
  console.log('Todos con contraseña: 123\n');
  
  const updated = await prisma.usuario_Paciente.findMany({
    include: { Paciente: true }
  });
  
  updated.forEach(u => {
    console.log(`  Usuario: ${u.Nombre_usuario.padEnd(15)} | Paciente: ${u.Paciente?.Nombre || 'N/A'}`);
  });
}

main().then(() => process.exit(0));
