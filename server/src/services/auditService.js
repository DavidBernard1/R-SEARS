class NotificationService {
  async createAuditLog({ userId, action, entityType, entityId, metadata = {} }) {
    const db = require('../config/db');
    await db.query(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
      [userId || null, action, entityType || 'system', entityId || null, JSON.stringify(metadata)]
    );
    return true;
  }
}

module.exports = new NotificationService();
