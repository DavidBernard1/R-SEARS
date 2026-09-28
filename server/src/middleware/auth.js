const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const auditService = require('../services/auditService');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      status: 'error',
      error: 'Access token missing' 
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;
    return res.status(statusCode).json({ 
      status: 'error',
      error: 'Invalid or expired token' 
    });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      auditService.createAuditLog({
        userId: req.user?.id,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        entityType: 'route',
        entityId: req.path,
        metadata: { role: req.user?.role, requiredRoles: allowedRoles }
      });
      return res.status(403).json({ 
        status: 'error',
        error: 'Forbidden: insufficient permissions' 
      });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
