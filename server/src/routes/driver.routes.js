const express = require('express');
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role, status FROM users WHERE id = $1', [req.user.id]);
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/profile', authenticateToken, async (req, res) => {
  const { name, phone, blood_group } = req.body;

  try {
    const result = await db.query(
      `UPDATE users
       SET name = COALESCE($1, name), phone = COALESCE($2, phone), blood_group = COALESCE($3, blood_group), updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, phone, blood_group`,
      [name, phone, blood_group, req.user.id]
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM accidents
       WHERE driver_id = $1
       ORDER BY created_at DESC LIMIT 20`,
      [req.user.id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
