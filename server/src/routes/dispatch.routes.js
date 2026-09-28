const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

router.get('/live', authenticateToken, async (_req, res) => {
  try {
    const incidents = await db.query(`
      SELECT id, driver_id, latitude, longitude, status, incident_type, created_at
      FROM accidents
      WHERE status IN ('new', 'pending', 'accepted', 'in_progress')
      ORDER BY created_at DESC
      LIMIT 50
    `);

    const ambulances = await db.query(`
      SELECT id, plate_number, status, current_latitude, current_longitude
      FROM ambulances
      ORDER BY updated_at DESC
      LIMIT 50
    `);

    res.status(200).json({ incidents: incidents.rows, ambulances: ambulances.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
