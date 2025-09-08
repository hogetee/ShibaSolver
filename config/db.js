const { Pool } = require('pg');

const connectDB = async () => {
  try {
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'shibasolver',
      max: 20,                 
      idleTimeoutMillis: 30000 
    });

    // test connection
    const client = await pool.connect();
    console.log(`PostgreSQL Connected: ${client.host}`);
    client.release();

    return pool;
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message);
    process.exit(1); 
  }
};

module.exports = connectDB;