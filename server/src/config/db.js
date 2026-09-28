const { Pool } = require('pg');
const { env } = require('./env');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
  console.log('Connected to Neon PostgreSQL');
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL error:', error);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
