const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeRoles('super_admin', 'system_auditor', 'national_dispatcher'), async (_req, res) => {
  try {
    const statistics = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM accidents) AS total_accidents,
        (SELECT COUNT(*) FROM ambulances) AS total_ambulances,
        (SELECT COUNT(*) FROM hospitals) AS total_hospitals
    `);

    res.status(200).json(statistics.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/audit-logs', authenticateToken, authorizeRoles('super_admin', 'system_auditor'), async (_req, res) => {
  try {
    const result = await db.query('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 50');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
