/*
node server\scripts\hashPassword.js
*/

import bcrypt from 'bcrypt';

const password = 'admin';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
  console.log('Generated hash:', hash);
});