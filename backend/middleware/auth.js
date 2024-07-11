const jwt = require('jsonwebtoken');
require('dotenv').config();
const { Users } = require('../models');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    console.log('No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Users.findByPk(decoded.id);
    if (!req.user) {
      console.log('User not found');
      return res.status(401).json({ error: 'User not found' });
    }
    next();
  } catch (error) {
    console.log('Invalid token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role_id)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
