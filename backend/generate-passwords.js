const bcrypt = require('bcrypt');

async function generatePasswords() {
  const users = [
    { username: 'cmendez', password: 'pass123' },
    { username: 'lramirez', password: 'pass456' },
    { username: 'mjimenez', password: 'pass789' },
    { username: 'svargas', password: 'pass321' },
    { username: 'dcastillo', password: 'pass654' }
  ];

  console.log('-- Contraseñas hasheadas para usuarios:');
  console.log('UPDATE Usuario SET Contrasena = ');
  
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`CASE WHEN Nombre_usuario = '${user.username}' THEN '${hash}'`);
  }
  console.log('WHERE Nombre_usuario IN (');
  users.forEach((user, index) => {
    console.log(`'${user.username}'${index < users.length - 1 ? ',' : ''}`);
  });
  console.log(');');
}

generatePasswords().catch(console.error);
