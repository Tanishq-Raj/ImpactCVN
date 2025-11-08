-- Migration: Add name and updated_at columns to users table
-- Run this if you have an existing users table

-- Add name column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Add updated_at column if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add index for email lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update existing users with a default name (optional - you may want to handle this differently)
UPDATE users SET name = 'User' WHERE name IS NULL;

-- Make name column NOT NULL after setting default values
ALTER TABLE users ALTER COLUMN name SET NOT NULL;
