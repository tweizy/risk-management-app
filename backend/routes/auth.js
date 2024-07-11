const express = require('express');
const { Users } = require('../models');
const { generateToken, verifyPassword } = require('../utils/auth');

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user || !verifyPassword(password, user.password)) {
      console.log('Login failed: Invalid email or password');
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user.dataValues;

    console.log('Login successful:', user.email);
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Unable to login user:', error.message);
    res.status(500).json({ error: 'Unable to login user' });
  }
});

module.exports = router;
