const bcrypt = require('bcrypt');

const plainPassword = 'password123';
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Hashed password:', hashedPassword);
});
