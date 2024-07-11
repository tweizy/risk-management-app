const express = require('express');
const { Users, Role, Entity } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { hashPassword } = require('../utils/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await Users.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Role,
          attributes: ['name']
        },
        {
          model: Entity,
          attributes: ['description', 'type']
        }
      ]
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(400).json({ error: 'Unable to fetch user profile' });
  }
});

// Update user profile (e.g., change password, first name, last name)
router.put('/profile', authenticate, async (req, res) => {
  const { first_name, last_name, password } = req.body;

  try {
    const updateFields = {};
    
    if (first_name) updateFields.first_name = first_name;
    if (last_name) updateFields.last_name = last_name;
    if (password) updateFields.password = hashPassword(password);

    await Users.update(updateFields, { where: { id: req.user.id } });

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Unable to update user profile' });
  }
});

router.get('/users', authenticate, async (req, res) => {
  try {
    const users = await Users.findAll({
      attributes: { exclude: ['password'] },
      include: [
        { model: Role, attributes: ['name'] },
        { model: Entity, attributes: ['description', 'type'] }
      ]
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: 'Unable to fetch users' });
  }
});

// Get user details (admin only)
router.get('/users/:id', authenticate, authorize([1]), async (req, res) => {
  try {
    const user = await Users.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Role, attributes: ['name'] },
        { model: Entity, attributes: ['description', 'type'] }
      ]
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Unable to fetch user details' });
  }
});

// Create a new user (admin only)
router.post('/users', authenticate, authorize([1]), async (req, res) => {
  const { email, password, first_name, last_name, entity_id, role_id } = req.body;
  const hashedPassword = hashPassword(password);
  try {
    const user = await Users.create({ email, password: hashedPassword, first_name, last_name, entity_id, role_id });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create user' });
  }
});

// Update user email and password (admin only)
router.put('/users/:id', authenticate, authorize([1]), async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  const updateFields = { first_name, last_name };
  if (email) updateFields.email = email;
  if (password) updateFields.password = hashPassword(password);
  try {
    await Users.update(updateFields, { where: { id: req.params.id } });
    res.status(200).json({ message: 'User details updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Unable to update user details' });
  }
});

// Delete user (admin only)
router.delete('/users/:id', authenticate, authorize([1]), async (req, res) => {
  try {
    const result = await Users.destroy({ where: { id: req.params.id } });
    if (result) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Unable to delete user' });
  }
});

// Get all entities (admin only)
router.get('/entities', authenticate, authorize([1]), async (req, res) => {
  try {
    const entities = await Entity.findAll();
    res.status(200).json(entities);
  } catch (error) {
    res.status(400).json({ error: 'Unable to fetch entities' });
  }
});


module.exports = router;
