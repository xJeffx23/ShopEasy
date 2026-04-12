const bcrypt = require('bcrypt');

async function fixPasswords() {
  const users = [
    { username: 'cmendez', password: 'pass123' },
    { username: 'lramirez', password: 'pass456' },
    { username: 'mjimenez', password: 'pass789' },
    { username: 'svargas', password: 'pass321' },
    { username: 'dcastillo', password: 'pass654' }
  ];

  console.log('-- UPDATE statements para corregir contraseñas:');
  
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`UPDATE Usuario SET Contrasena = '${hash}' WHERE Nombre_usuario = '${user.username}';`);
  }
}

fixPasswords().catch(console.error);
