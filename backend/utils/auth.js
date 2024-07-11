const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role_id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const verifyPassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = {
  generateToken,
  hashPassword,
  verifyPassword,
};
