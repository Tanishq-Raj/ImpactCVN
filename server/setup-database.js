import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const { Pool } = pg;

async function setupDatabase() {
  // First, connect to postgres database to create resumedb if it doesn't exist
  const adminPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres', // Connect to default postgres database
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Check if database exists
    const dbCheck = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = 'resumedb'"
    );

    if (dbCheck.rows.length === 0) {
      console.log('Creating database resumedb...');
      await adminPool.query('CREATE DATABASE resumedb');
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database resumedb already exists');
    }

    await adminPool.end();

    // Now connect to resumedb and create tables
    const pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: 'resumedb',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 5432,
    });

    console.log('\nCreating tables...');

    // Read and execute schema
    const schema = fs.readFileSync('./server/schema.sql', 'utf8');
    await pool.query(schema);

    console.log('✅ Tables created successfully');

    // Verify tables
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

    console.log('\n📋 Tables in database:');
    tables.rows.forEach(row => console.log(`  - ${row.table_name}`));

    await pool.end();
    console.log('\n✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();
