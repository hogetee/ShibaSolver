const { Pool } = require('pg');

const connectDB = async () => {
  try {
    // test connection
    const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false }
    });
    await pool.connect();
    console.log('PostgreSQL connected successfully');
    return pool;
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;