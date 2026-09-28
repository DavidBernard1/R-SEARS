const fs = require('fs');
const path = require('path');

const databaseDir = path.join(__dirname, '..');
const filePath = path.join(databaseDir, 'connection.js');

const content = `const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log('Created database/connection.js');
