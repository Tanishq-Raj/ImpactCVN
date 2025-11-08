# ImpactCV Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier works)

## 1. Clone the Repository

```bash
git clone https://github.com/Tanishq-Raj/ImpactCVN.git
cd ImpactCVN
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Set Up Supabase Database

### Create Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Save your database password

### Create Database Tables

1. Go to your Supabase dashboard
2. Click **SQL Editor** in the sidebar
3. Click **New query**
4. Copy and paste this SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP(6) DEFAULT NOW(),
  updated_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  theme VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP(6) DEFAULT NOW(),
  updated_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- Create shared_resumes table
CREATE TABLE IF NOT EXISTS shared_resumes (
  id SERIAL PRIMARY KEY,
  share_id VARCHAR(255) UNIQUE NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP(6) DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shared_resumes_share_id ON shared_resumes(share_id);
```

5. Click **Run** to execute

### Get Connection Strings

1. In Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Copy the **URI** (with port 6543 for pooled connection)
4. Also note the direct connection (port 5432)

## 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your Supabase credentials:
   ```env
   DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
   JWT_SECRET="your-secure-random-string-here"
   PORT=3001
   ```

## 5. Generate Prisma Client

```bash
npx prisma generate
```

## 6. Start the Application

### Start Backend Server

```bash
cd server
node server.js
```

Server will run on http://localhost:3001

### Start Frontend (in a new terminal)

```bash
npm run dev
```

Frontend will run on http://localhost:3000

## 7. Test the Application

1. Open http://localhost:3000
2. Click "Sign Up"
3. Create an account
4. Log in and start creating resumes!

## Troubleshooting

### "Can't reach database server"
- Check your DATABASE_URL in `.env`
- Ensure Supabase project is active
- Verify password is correct (no brackets)

### "Prisma Client not generated"
- Run: `npx prisma generate`
- Restart your server

### Port already in use
- Change PORT in `.env` to a different number
- Or stop other applications using port 3001/3000

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt

## License

MIT
