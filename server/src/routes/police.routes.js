const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const auditService = require('../services/auditService');

const router = express.Router();

// Police dashboard overview
router.get('/dashboard', authenticateToken, authorizeRoles('police_officer', 'national_dispatcher', 'super_admin'), async (_req, res) => {
  try {
    const totalIncidents = await db.query(
      `SELECT COUNT(*) AS total FROM accidents`
    );
    
    const activeIncidents = await db.query(
      `SELECT COUNT(*) AS total FROM accidents WHERE status IN ('new', 'pending', 'accepted', 'in_progress')`
    );
    
    const resolvedIncidents = await db.query(
      `SELECT COUNT(*) AS total FROM accidents WHERE status = 'resolved'`
    );

    const policeStations = await db.query(
      `SELECT COUNT(*) AS total FROM police_stations`
    );

    res.status(200).json({
      status: 'success',
      data: {
        totalIncidents: Number(totalIncidents.rows[0].total),
        activeIncidents: Number(activeIncidents.rows[0].total),
        resolvedIncidents: Number(resolvedIncidents.rows[0].total),
        policeStations: Number(policeStations.rows[0].total)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Get live incidents for police
router.get('/incidents/live', authenticateToken, authorizeRoles('police_officer', 'national_dispatcher', 'super_admin'), async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT id, driver_id, latitude, longitude, status, incident_type, speed_kmh, created_at
       FROM accidents
       WHERE status IN ('new', 'pending', 'accepted', 'in_progress')
       ORDER BY created_at DESC
       LIMIT 50`
    );

    res.status(200).json({ 
      status: 'success',
      data: result.rows 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Accept emergency incident
router.patch('/incidents/:id/accept', authenticateToken, authorizeRoles('police_officer', 'national_dispatcher'), async (req, res) => {
  const { id } = req.params;
  const { assigned_officer = null, patrol_unit = null } = req.body;

  try {
    const result = await db.query(
      `UPDATE accidents 
       SET status = 'accepted', assigned_officer = COALESCE($1, assigned_officer), updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [assigned_officer, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ 
        status: 'error',
        error: 'Incident not found' 
      });
    }

    await auditService.createAuditLog({
      userId: req.user.id,
      action: 'INCIDENT_ACCEPTED_BY_POLICE',
      entityType: 'accident',
      entityId: id,
      metadata: { assigned_officer, patrol_unit }
    });

    res.status(200).json({ 
      status: 'success',
      message: 'Emergency accepted by police',
      data: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

module.exports = router;
