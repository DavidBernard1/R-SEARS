const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const auditService = require('../services/auditService');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Hospital dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('hospital_admin', 'national_dispatcher', 'super_admin'), async (_req, res) => {
  try {
    const ambulances = await db.query(
      `SELECT COUNT(*) AS total, status FROM ambulances GROUP BY status`
    );
    
    const incomingRequests = await db.query(
      `SELECT COUNT(*) AS total FROM dispatches WHERE status IN ('pending', 'dispatched')`
    );

    const hospitals = await db.query(
      `SELECT COUNT(*) AS total FROM hospitals`
    );

    res.status(200).json({
      status: 'success',
      data: {
        ambulances: ambulances.rows,
        incomingRequests: Number(incomingRequests.rows[0].total),
        hospitals: Number(hospitals.rows[0].total)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Get available ambulances
router.get('/ambulances', authenticateToken, authorizeRoles('hospital_admin', 'national_dispatcher', 'super_admin'), async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM ambulances ORDER BY status ASC, updated_at DESC`
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

// Dispatch ambulance
router.post('/dispatch', authenticateToken, authorizeRoles('hospital_admin', 'national_dispatcher'), async (req, res) => {
  const { incident_id, ambulance_id, hospital_id } = req.body;

  try {
    if (!incident_id || !ambulance_id || !hospital_id) {
      return res.status(400).json({ 
        status: 'error',
        error: 'incident_id, ambulance_id, and hospital_id required' 
      });
    }

    const dispatchId = uuidv4();

    const result = await db.query(
      `INSERT INTO dispatches (id, incident_id, ambulance_id, hospital_id, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, 'dispatched', NOW(), NOW())
       RETURNING *`,
      [dispatchId, incident_id, ambulance_id, hospital_id]
    );

    // Update ambulance status
    await db.query(
      `UPDATE ambulances SET status = 'on_route', updated_at = NOW() WHERE id = $1`,
      [ambulance_id]
    );

    await auditService.createAuditLog({
      userId: req.user.id,
      action: 'AMBULANCE_DISPATCHED',
      entityType: 'dispatch',
      entityId: dispatchId,
      metadata: { incident_id, ambulance_id, hospital_id }
    });

    res.status(201).json({ 
      status: 'success',
      message: 'Ambulance dispatched successfully',
      data: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Update ambulance status
router.patch('/ambulances/:id/status', authenticateToken, authorizeRoles('ambulance_driver', 'hospital_admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ 
      status: 'error',
      error: 'Status required' 
    });
  }

  try {
    const result = await db.query(
      `UPDATE ambulances SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ 
        status: 'error',
        error: 'Ambulance not found' 
      });
    }

    res.status(200).json({ 
      status: 'success',
      message: 'Ambulance status updated',
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
