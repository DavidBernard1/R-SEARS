const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const auditService = require('../services/auditService');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Admin dashboard
router.get('/dashboard', authenticateToken, authorizeRoles('super_admin', 'system_auditor', 'national_dispatcher'), async (_req, res) => {
  try {
    const statistics = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS total_users,
        (SELECT COUNT(*) FROM accidents) AS total_incidents,
        (SELECT COUNT(*) FROM ambulances) AS total_ambulances,
        (SELECT COUNT(*) FROM hospitals) AS total_hospitals,
        (SELECT COUNT(*) FROM police_stations) AS total_police_stations,
        (SELECT COUNT(*) FROM users WHERE role = 'driver') AS total_drivers,
        (SELECT COUNT(*) FROM users WHERE role = 'police_officer') AS total_police_officers,
        (SELECT COUNT(*) FROM users WHERE role = 'hospital_admin') AS total_hospital_admins
    `);

    res.status(200).json({
      status: 'success',
      data: statistics.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const { role = null, status = 'active' } = req.query;

    let query = 'SELECT id, name, email, role, phone, status, created_at FROM users';
    const params = [];

    const conditions = [];
    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }
    if (role) {
      conditions.push(`role = $${params.length + 1}`);
      params.push(role);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY created_at DESC LIMIT 100';

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

// Create user (admin)
router.post('/users', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  try {
    const { name, email, password, role, phone = null } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        status: 'error',
        error: 'name, email, password, and role required' 
      });
    }

    const checkEmail = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (checkEmail.rows.length > 0) {
      return res.status(409).json({ 
        status: 'error',
        error: 'Email already registered' 
      });
    }

    const hash = await bcrypt.hash(password, 12);
    const userId = uuidv4();

    const result = await db.query(
      `INSERT INTO users (id, name, email, password_hash, role, phone, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW(), NOW())
       RETURNING id, name, email, role, phone`,
      [userId, name, email, hash, role, phone]
    );

    await auditService.createAuditLog({
      userId: req.user.id,
      action: 'USER_CREATED_BY_ADMIN',
      entityType: 'user',
      entityId: userId,
      metadata: { role, email }
    });

    res.status(201).json({ 
      status: 'success',
      message: 'User created successfully',
      data: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Deactivate user
router.patch('/users/:id/deactivate', authenticateToken, authorizeRoles('super_admin'), async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE users SET status = 'inactive', updated_at = NOW() WHERE id = $1 RETURNING id, name, email, role, status`,
      [id]
    );

    if (!result.rows[0]) {
      return res.status(404).json({ 
        status: 'error',
        error: 'User not found' 
      });
    }

    await auditService.createAuditLog({
      userId: req.user.id,
      action: 'USER_DEACTIVATED',
      entityType: 'user',
      entityId: id
    });

    res.status(200).json({ 
      status: 'success',
      message: 'User deactivated',
      data: result.rows[0] 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Get audit logs
router.get('/audit-logs', authenticateToken, authorizeRoles('super_admin', 'system_auditor'), async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100`
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

module.exports = router;
