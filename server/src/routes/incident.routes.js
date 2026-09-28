const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const auditService = require('../services/auditService');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Create incident report
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, impact_level, speed_kmh, incident_type = 'accident', notes = null } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Latitude and longitude required' 
      });
    }

    const incidentId = uuidv4();

    const result = await db.query(
      `INSERT INTO accidents (id, driver_id, latitude, longitude, impact_level, speed_kmh, incident_type, notes, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'new', NOW(), NOW())
       RETURNING *`,
      [incidentId, req.user.id, latitude, longitude, impact_level, speed_kmh, incident_type, notes]
    );

    await auditService.createAuditLog({
      userId: req.user.id,
      action: 'INCIDENT_CREATED',
      entityType: 'accident',
      entityId: incidentId
    });

    res.status(201).json({ 
      status: 'success',
      message: 'Incident recorded',
      data: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Get all incidents (filtered by role)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query = 'SELECT id, driver_id, latitude, longitude, status, incident_type, created_at FROM accidents';
    let params = [];

    if (req.user.role === 'driver' || req.user.role === 'moto_rider') {
      query += ' WHERE driver_id = $1';
      params = [req.user.id];
    }

    query += ' ORDER BY created_at DESC LIMIT 50';

    const result = await db.query(query, params);
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

// Get incident details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM accidents WHERE id = $1',
      [req.params.id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ 
        status: 'error',
        error: 'Incident not found' 
      });
    }

    res.status(200).json({ 
      status: 'success',
      data: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Update incident status
router.patch('/:id/resolve', authenticateToken, authorizeRoles('police_officer', 'hospital_admin', 'national_dispatcher', 'super_admin'), async (req, res) => {
  const { id } = req.params;
  const { status = 'resolved', notes = null } = req.body;

  try {
    const result = await db.query(
      `UPDATE accidents SET status = $1, notes = COALESCE($2, notes), updated_at = NOW() WHERE id = $3 RETURNING *`,
      [status, notes, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ 
        status: 'error',
        error: 'Incident not found' 
      });
    }

    await auditService.createAuditLog({
      userId: req.user.id,
      action: 'INCIDENT_RESOLVED',
      entityType: 'accident',
      entityId: id,
      metadata: { status }
    });

    res.status(200).json({ 
      status: 'success',
      message: 'Incident updated',
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
