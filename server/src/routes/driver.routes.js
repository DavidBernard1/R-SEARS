const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendEmergencyAlert, sendWhatsAppAlert } = require('../services/notificationService');
const auditService = require('../services/auditService');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Get driver profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, status, phone, blood_group, medical_allergies, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    
    if (!result.rows[0]) {
      return res.status(404).json({ 
        status: 'error',
        error: 'User not found' 
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

// Update driver profile
router.put('/profile', authenticateToken, authorizeRoles('driver', 'moto_rider'), async (req, res) => {
  const { name, phone, blood_group, medical_allergies, vehicle_type, license_number } = req.body;

  try {
    const result = await db.query(
      `UPDATE users
       SET name = COALESCE($1, name), 
           phone = COALESCE($2, phone), 
           blood_group = COALESCE($3, blood_group),
           medical_allergies = COALESCE($4, medical_allergies),
           updated_at = NOW()
       WHERE id = $5
       RETURNING id, name, email, phone, blood_group, medical_allergies`,
      [name, phone, blood_group, medical_allergies, req.user.id]
    );

    if (vehicle_type || license_number) {
      await db.query(
        `UPDATE drivers
         SET vehicle_type = COALESCE($1, vehicle_type),
             license_number = COALESCE($2, license_number)
         WHERE user_id = $3`,
        [vehicle_type, license_number, req.user.id]
      );
    }

    await auditService.createAuditLog({
      userId: req.user.id,
      action: 'PROFILE_UPDATED',
      entityType: 'user',
      entityId: req.user.id
    });

    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Send SOS emergency alert
router.post('/sos', authenticateToken, authorizeRoles('driver', 'moto_rider', 'ambulance_driver'), async (req, res) => {
  try {
    const { latitude, longitude, impact_level = 5, speed_kmh = 0, incident_type = 'accident' } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Latitude and longitude required' 
      });
    }

    const incidentId = uuidv4();

    const incident = await db.query(
      `INSERT INTO accidents (id, driver_id, latitude, longitude, impact_level, speed_kmh, incident_type, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending', NOW(), NOW())
       RETURNING *`,
      [incidentId, req.user.id, latitude, longitude, impact_level, speed_kmh, incident_type]
    );

    // Send notifications
    await sendEmergencyAlert({
      type: incident_type,
      userId: req.user.id,
      incident: incident.rows[0],
      location: { latitude, longitude }
    });

    await sendWhatsAppAlert({
      phone: '+250789600279',
      message: `🚨 EMERGENCY SOS ALERT: ${incident_type} reported at latitude ${latitude}, longitude ${longitude}. Incident ID: ${incidentId}. Please respond immediately.`
    });

    await auditService.createAuditLog({
      userId: req.user.id,
      action: 'SOS_TRIGGERED',
      entityType: 'accident',
      entityId: incidentId,
      metadata: { latitude, longitude, impact_level, speed_kmh, incident_type }
    });

    res.status(201).json({
      status: 'success',
      message: 'Emergency SOS sent successfully to nearest police and hospital',
      data: incident.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Get accident history
router.get('/history', authenticateToken, authorizeRoles('driver', 'moto_rider'), async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, latitude, longitude, impact_level, speed_kmh, incident_type, status, created_at
       FROM accidents
       WHERE driver_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [req.user.id]
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

// Find nearby services (hospitals, police stations)
router.get('/nearby-services', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, radius_km = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Latitude and longitude required' 
      });
    }

    const policeStations = await db.query(
      `SELECT id, name, district, latitude, longitude
       FROM police_stations
       LIMIT 5`
    );

    const hospitals = await db.query(
      `SELECT id, name, district, latitude, longitude, available_beds
       FROM hospitals
       LIMIT 5`
    );

    res.status(200).json({ 
      status: 'success',
      data: {
        policeStations: policeStations.rows,
        hospitals: hospitals.rows
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

module.exports = router;
