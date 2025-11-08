import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

async function createSharedResumesTable() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'resumedb',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('Creating shared_resumes table...\n');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS shared_resumes (
        id SERIAL PRIMARY KEY,
        share_id VARCHAR(255) UNIQUE NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created shared_resumes table');

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_shared_resumes_share_id ON shared_resumes(share_id)
    `);
    console.log('✅ Added index on share_id');

    await pool.end();
    console.log('\n✅ Table creation complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

createSharedResumesTable();
