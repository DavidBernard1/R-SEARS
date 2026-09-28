const db = require('../config/db');

class AnalyticsService {
  async getDashboardSummary() {
    const result = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM accidents WHERE status IN ('new', 'pending', 'accepted', 'in_progress')) AS active_incidents,
        (SELECT COUNT(*) FROM ambulances WHERE status = 'available') AS available_ambulances,
        (SELECT COUNT(*) FROM hospitals) AS hospitals,
        (SELECT COUNT(*) FROM police_stations) AS police_stations
    `);

    return result.rows[0];
  }
}

module.exports = new AnalyticsService();
