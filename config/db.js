const { Pool } = require('pg');

const connectDB = async () => {
  try {
    // test connection
    const pool = new Pool({
    connectionString: 'postgresql://postgres.tqpfatrayjpkuqwhlkpx:ShibaSolver@aws-1-us-east-1.pooler.supabase.com:6543/postgres',
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