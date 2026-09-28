const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', authenticateToken, authorizeRoles('police_officer', 'national_dispatcher', 'super_admin'), async (_req, res) => {
  try {
    const totalIncidents = await db.query('SELECT COUNT(*) AS total FROM accidents');
    const activeIncidents = await db.query("SELECT COUNT(*) AS total FROM accidents WHERE status IN ('new', 'pending', 'in_progress')");
    const patrols = await db.query('SELECT COUNT(*) AS total FROM police_stations');

    res.status(200).json({
      totalIncidents: Number(totalIncidents.rows[0].total),
      activeIncidents: Number(activeIncidents.rows[0].total),
      patrols: Number(patrols.rows[0].total)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/incidents/:id/accept', authenticateToken, authorizeRoles('police_officer', 'national_dispatcher'), async (req, res) => {
  const { id } = req.params;
  const { assigned_officer } = req.body;

  try {
    const result = await db.query(
      `UPDATE accidents SET status = 'accepted', assigned_officer = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [assigned_officer, id]
    );

    res.status(200).json({ message: 'Emergency accepted', incident: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
