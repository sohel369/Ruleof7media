const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/rule7media'
});

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
