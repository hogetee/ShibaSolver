const { Pool } = require('pg');

const connectDB = async () => {
  try {
    // test connection
    // test connection
    const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
    });
    await pool.connect();
    console.log('PostgreSQL connected successfully');
    await pool.connect();
    console.log('PostgreSQL connected successfully');
    return pool;
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;