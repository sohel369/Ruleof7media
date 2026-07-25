const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = {};

if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  if (isProduction) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
} else if (process.env.PGHOST) {
  // Let the pg pool automatically pick up PGHOST, PGUSER, PGPASSWORD, etc.
  if (isProduction) {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
} else {
  // Local development fallback
  poolConfig.connectionString = 'postgres://postgres:postgres@localhost:5432/rule7media';
}

const pool = new Pool(poolConfig);

async function connectDb() {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL successfully.');
    client.release();
  } catch (err) {
    console.error('PostgreSQL connection error:', err);
    throw err;
  }
}

module.exports = {
  pool,
  connectDb,
  query: (text, params) => pool.query(text, params)
};
