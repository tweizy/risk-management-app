const express = require('express');
const { MitigationAction } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get all notifications (overdue actions)
router.get('/notification', authenticate, async (req, res) => {
  try {
    const actions = await MitigationAction.findAll({
      where: {
        assigned_to: req.user.id,
        status: 'overdue'
      }
    });
    res.status(200).json(actions);
  } catch (error) {
    res.status(400).json({ error: 'Unable to fetch notifications' });
  }
});

module.exports = router;
