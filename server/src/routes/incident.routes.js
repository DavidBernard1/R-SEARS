const express = require('express');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendEmergencyAlert, sendWhatsAppAlert } = require('../services/notificationService');

const router = express.Router();

router.post('/sos', authenticateToken, authorizeRoles('driver', 'moto_rider', 'ambulance_driver'), async (req, res) => {
  try {
    const { latitude, longitude, impact_level, speed_kmh, incident_type = 'accident' } = req.body;

    const incident = await db.query(
      `INSERT INTO accidents (id, driver_id, latitude, longitude, impact_level, speed_kmh, incident_type, status, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'pending', NOW(), NOW())
       RETURNING *`,
      [req.user.id, latitude, longitude, impact_level, speed_kmh, incident_type]
    );

    await sendEmergencyAlert({
      type: 'accident',
      userId: req.user.id,
      incident: incident.rows[0],
      location: { latitude, longitude }
    });

    await sendWhatsAppAlert({
      phone: '+250789600279',
      message: `Emergency alert: accident reported near ${latitude}, ${longitude}`
    });

    res.status(201).json({
      message: 'Emergency SOS sent successfully',
      incident: incident.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/nearby-services', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, radius_km = 10 } = req.query;

    const policeStations = await db.query(
      `SELECT * FROM police_stations
       WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)`,
      [Number(longitude), Number(latitude), Number(radius_km) * 1000]
    );

    const hospitals = await db.query(
      `SELECT * FROM hospitals
       WHERE ST_DWithin(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)`,
      [Number(longitude), Number(latitude), Number(radius_km) * 1000]
    );

    res.status(200).json({ policeStations: policeStations.rows, hospitals: hospitals.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
