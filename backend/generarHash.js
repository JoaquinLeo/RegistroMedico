const bcrypt = require('bcrypt');

const password = 'admin';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log('Hash generado:', hash);
});