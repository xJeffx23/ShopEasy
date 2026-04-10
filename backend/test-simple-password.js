// Crear un usuario de prueba simple con contraseña "123"
const bcrypt = require('bcrypt');

async function createSimpleUser() {
  const password = '123';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // Verificar que funciona
  const isValid = await bcrypt.compare(password, hash);
  console.log('Verification:', isValid);
  
  // Generar SQL UPDATE
  console.log(`UPDATE Usuario SET Contrasena = N'${hash}' WHERE Nombre_usuario = 'cmendez';`);
}

createSimpleUser().catch(console.error);
