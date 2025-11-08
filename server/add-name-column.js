import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { Pool } = pg;

async function addNameColumn() {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'resumedb',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
  });

  try {
    console.log('Adding name and updated_at columns to users table...\n');

    // Add name column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS name VARCHAR(255)
    `);
    console.log('✅ Added name column');

    // Add updated_at column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `);
    console.log('✅ Added updated_at column');

    // Set default name for existing users (if any)
    await pool.query(`
      UPDATE users 
      SET name = 'User' 
      WHERE name IS NULL
    `);
    console.log('✅ Set default names for existing users');

    // Make name NOT NULL
    await pool.query(`
      ALTER TABLE users 
      ALTER COLUMN name SET NOT NULL
    `);
    console.log('✅ Made name column NOT NULL');

    // Add email index
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `);
    console.log('✅ Added email index');

    // Verify the changes
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('\n📋 Updated users table columns:');
    console.log('--------------------------------');
    columns.rows.forEach(col => {
      console.log(`  ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });

    await pool.end();
    console.log('\n✅ Migration complete!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

addNameColumn();
