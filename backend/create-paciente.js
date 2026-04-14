const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const paciente = await prisma.paciente.findFirst({ where: { Activo: true } });
  
  if (!paciente) {
    console.log('No hay pacientes activos');
    return;
  }
  
  const hash = await bcrypt.hash('123', 10);
  
  const usuario = await prisma.usuario_Paciente.upsert({
    where: { Nombre_usuario: 'paciente1' },
    update: { Contrasena: hash },
    create: {
      Nombre_usuario: 'paciente1',
      Contrasena: hash,
      Email: 'paciente1@patitos.cr',
      Paciente_idPaciente: paciente.idPaciente,
      Cambio_Contrasena: false
    }
  });
  
  console.log('Usuario paciente creado:', usuario.Nombre_usuario);
  console.log('Paciente asociado:', paciente.Nombre);
}

main().then(() => process.exit(0));
