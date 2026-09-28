const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');

class NotificationService {
  async sendEmergencyAlert({ type, userId, incident, location }) {
    const subject = `Emergency ${type.toUpperCase()} Alert`;
    const body = `Emergency alert triggered by user ${userId}. Location: ${location.latitude}, ${location.longitude}. Incident ID: ${incident.id}.`;

    await db.query(
      `INSERT INTO notifications (id, user_id, channel, template, payload, sent_at)
       VALUES ($1, $2, 'email', $3, $4::jsonb, NOW())`,
      [uuidv4(), userId, subject, JSON.stringify({ subject, body, incidentId: incident.id })]
    );

    return { success: true, message: 'Alert queued for email notification', subject, body };
  }

  async sendWhatsAppAlert({ phone, message }) {
    await db.query(
      `INSERT INTO notifications (id, user_id, channel, template, payload, sent_at)
       VALUES ($1, NULL, 'whatsapp', 'emergency', $2::jsonb, NOW())`,
      [uuidv4(), JSON.stringify({ phone, message })]
    );

    return { success: true, message: 'Alert queued for WhatsApp' };
  }
}

module.exports = new NotificationService();
