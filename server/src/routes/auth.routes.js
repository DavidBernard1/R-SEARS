const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { env } = require('../config/env');
const auditService = require('../services/auditService');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'driver', phone = null } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Missing required fields: name, email, password' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Password must be at least 8 characters' 
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

    const user = result.rows[0];
    
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );

    await auditService.createAuditLog({
      userId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'user',
      entityId: user.id,
      metadata: { role, email }
    });

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      user,
      token,
      refreshToken
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        error: 'Email and password required' 
      });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (!result.rows.length) {
      return res.status(401).json({ 
        status: 'error',
        error: 'Invalid credentials' 
      });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      await auditService.createAuditLog({
        userId: user.id,
        action: 'FAILED_LOGIN_ATTEMPT',
        entityType: 'auth',
        metadata: { email }
      });
      return res.status(401).json({ 
        status: 'error',
        error: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN }
    );

    await auditService.createAuditLog({
      userId: user.id,
      action: 'USER_LOGIN',
      entityType: 'auth',
      metadata: { email }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      },
      token,
      refreshToken
    });
  } catch (error) {
    return res.status(500).json({ 
      status: 'error',
      error: error.message 
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  res.status(200).json({ 
    status: 'success',
    message: 'Logout successful' 
  });
});

// Refresh token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ 
      status: 'error',
      error: 'Refresh token required' 
    });
  }

  try {
    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET || env.JWT_SECRET);
    const newToken = jwt.sign(
      { id: payload.id, role: payload.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ 
      status: 'success',
      token: newToken 
    });
  } catch (error) {
    res.status(401).json({ 
      status: 'error',
      error: 'Invalid refresh token' 
    });
  }
});

module.exports = router;
