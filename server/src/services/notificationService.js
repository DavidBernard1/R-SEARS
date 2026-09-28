const nodemailer = require('nodemailer');
const axios = require('axios');
const { env } = require('../config/env');

async function sendEmergencyAlert({ type, userId, incident, location }) {
  const subject = `Emergency ${type.toUpperCase()} Alert`;
  const text = `Emergency alert triggered by user ${userId} near latitude ${location.latitude} and longitude ${location.longitude}. Incident ID: ${incident.id}.`;

  if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: env.SMTP_USER,
      to: 'davidimanishimwe29@gmail.com',
      subject,
      text
    });
  }

  return { success: true, message: 'Emergency email alert queued', subject, text };
}

async function sendWhatsAppAlert({ phone, message }) {
  if (!env.WHATSAPP_TOKEN) {
    return { success: false, message: 'WhatsApp config missing' };
  }

  try {
    const response = await axios.post(env.WHATSAPP_API_URL, {
      to: phone,
      text: message
    }, {
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_TOKEN}`
      }
    });

    return { success: true, payload: response.data };
  } catch (error) {
    console.error('WhatsApp alert failed:', error.message);
    return { success: false, message: 'WhatsApp alert failed' };
  }
}

module.exports = { sendEmergencyAlert, sendWhatsAppAlert };
