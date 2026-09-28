const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, impact_level, speed_kmh, driver_id, notes } = req.body;

    const result = await db.query(
      `INSERT INTO accidents (id, driver_id, latitude, longitude, impact_level, speed_kmh, notes, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'new', NOW(), NOW())
       RETURNING *`,
      [driver_id || req.user.id, latitude, longitude, impact_level, speed_kmh, notes]
    );

    res.status(201).json({ message: 'Accident recorded', incident: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/resolve', authenticateToken, authorizeRoles('police_officer', 'hospital_admin', 'national_dispatcher', 'super_admin'), async (req, res) => {
  const { id } = req.params;
  const { status = 'resolved' } = req.body;

  try {
    const result = await db.query(
      `UPDATE accidents SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    res.status(200).json({ message: 'Incident updated', incident: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', authenticateToken, async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM accidents ORDER BY created_at DESC LIMIT 50');
    res.status(200).json(results.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
