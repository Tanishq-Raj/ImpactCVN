import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

// Test different password combinations
const passwords = [
  process.env.DB_PASSWORD, // Current password from .env
  'Tanishqk21',
  'postgres',
  'admin',
  'root',
  ''
];

async function testConnection(password) {
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'resumedb',
    password: password,
    port: process.env.DB_PORT || 5432,
  });

  try {
    const result = await pool.query('SELECT NOW()');
    console.log(`✅ SUCCESS! Password works: "${password}"`);
    console.log('Connection successful:', result.rows[0]);
    await pool.end();
    return true;
  } catch (error) {
    console.log(`❌ Failed with password: "${password}"`);
    await pool.end();
    return false;
  }
}

async function testAllPasswords() {
  console.log('Testing database connection with different passwords...\n');
  console.log('Database:', process.env.DB_NAME || 'resumedb');
  console.log('User:', process.env.DB_USER || 'postgres');
  console.log('Host:', process.env.DB_HOST || 'localhost');
  console.log('Port:', process.env.DB_PORT || 5432);
  console.log('\n---\n');

  for (const password of passwords) {
    const success = await testConnection(password);
    if (success) {
      console.log('\n✅ Found working password!');
      console.log(`Update your .env file with: DB_PASSWORD=${password}`);
      process.exit(0);
    }
  }

  console.log('\n❌ None of the passwords worked.');
  console.log('\nPlease check:');
  console.log('1. PostgreSQL is running');
  console.log('2. Database "resumedb" exists');
  console.log('3. User "postgres" has access');
  console.log('4. The correct password');
  process.exit(1);
}

testAllPasswords();
