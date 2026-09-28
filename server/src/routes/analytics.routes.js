const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const db = require('../config/db');

const router = express.Router();

router.get('/overview', authenticateToken, authorizeRoles('super_admin', 'national_dispatcher', 'system_auditor'), async (_req, res) => {
  try {
    const stats = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM accidents) AS total_incidents,
        (SELECT COUNT(*) FROM ambulances) AS total_ambulances,
        (SELECT COUNT(*) FROM police_stations) AS total_police_stations,
        (SELECT COUNT(*) FROM hospitals) AS total_hospitals
    `);

    res.status(200).json(stats.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/hotspots', authenticateToken, authorizeRoles('super_admin', 'national_dispatcher'), async (_req, res) => {
  try {
    const result = await db.query(`
      SELECT latitude, longitude, COUNT(*) AS incidents
      FROM accidents
      GROUP BY latitude, longitude
      ORDER BY incidents DESC
      LIMIT 10
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
