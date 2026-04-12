// Script para depurar la autenticación
const bcrypt = require('bcrypt');

async function debugAuth() {
  // Verificar el hash en la base de datos
  console.log('1. Verificando hash en base de datos...');
  
  // Simular lo que hace el auth service
  const username = 'cmendez';
  const password = '123';
  
  // Generar un hash nuevo para comparar
  const newHash = await bcrypt.hash(password, 10);
  console.log('Nuevo hash generado:', newHash);
  
  // Verificar que el nuevo hash funciona
  const verifyNew = await bcrypt.compare(password, newHash);
  console.log('Verificación nuevo hash:', verifyNew);
  
  // El hash que está en la BD (desde el último UPDATE)
  const dbHash = '$2b$10$eALsMhkM3/4DyWH/mJTFE.vJT99sAJoq5wLQ4O3GjzPPUoRKkxJ8i';
  console.log('Hash de BD:', dbHash);
  
  // Verificar el hash de BD
  const verifyDB = await bcrypt.compare(password, dbHash);
  console.log('Verificación hash BD:', verifyDB);
  
  // Verificar longitud y caracteres
  console.log('Longitud hash BD:', dbHash.length);
  console.log('Primeros 20 chars:', dbHash.substring(0, 20));
}

debugAuth().catch(console.error);
