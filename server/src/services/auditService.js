const db = require('../config/db');

class AuditService {
  async createAuditLog({ userId, action, entityType = 'system', entityId = null, metadata = {} }) {
    try {
      await db.query(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata, created_at)
         VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, NOW())`,
        [userId || null, action, entityType, entityId || null, JSON.stringify(metadata)]
      );
      return true;
    } catch (error) {
      console.error('Audit log creation failed:', error.message);
      return false;
    }
  }

  async getLogs({ limit = 50, offset = 0 }) {
    try {
      const result = await db.query(
        `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      console.error('Failed to retrieve audit logs:', error.message);
      return [];
    }
  }
}

module.exports = new AuditService();
