-- Run this script to set up the database
-- Instructions: 
-- 1. Open pgAdmin 4
-- 2. Connect to PostgreSQL
-- 3. Open Query Tool
-- 4. Paste and run this script

-- Create a new user for the application
CREATE USER resumeapp WITH PASSWORD 'resumeapp123';

-- Create the database
CREATE DATABASE resumedb OWNER resumeapp;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE resumedb TO resumeapp;

-- Connect to resumedb and set up schema
\c resumedb

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  theme VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- Grant table permissions to resumeapp user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO resumeapp;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO resumeapp;
