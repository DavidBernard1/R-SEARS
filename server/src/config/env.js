require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || process.env.NEON_DATABASE_URL,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  JWT_SECRET: process.env.JWT_SECRET || 'development_secret',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'development_refresh_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 60000,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX || 100,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN || '',
  GOVERNMENT_API_BASE_URL: process.env.GOVERNMENT_API_BASE_URL || '',
  GOVERNMENT_API_TOKEN: process.env.GOVERNMENT_API_TOKEN || '',
  POLICE_SERVICE_URL: process.env.POLICE_SERVICE_URL || '',
  HOSPITAL_SERVICE_URL: process.env.HOSPITAL_SERVICE_URL || '',
  SAMU_SERVICE_URL: process.env.SAMU_SERVICE_URL || '',
  SMS_PROVIDER: process.env.SMS_PROVIDER || 'mock'
};

module.exports = { env };
