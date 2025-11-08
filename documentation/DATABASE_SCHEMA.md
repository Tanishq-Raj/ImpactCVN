# ImpactCV - Database Schema Documentation

## Overview

ImpactCV uses PostgreSQL (hosted on Supabase) as its primary database with Prisma ORM for type-safe database access.

## Database Architecture

### Technology Stack
- **Database**: PostgreSQL 15+
- **Hosting**: Supabase (Cloud PostgreSQL)
- **ORM**: Prisma 6.19.0
- **Connection Pooling**: PgBouncer (Transaction Mode)

## Schema Diagram

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)            │
│ name               │
│ email (UNIQUE)     │
│ password_hash      │
│ created_at         │
│ updated_at         │
└─────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────┐
│      resumes        │
├─────────────────────┤
│ id (PK)            │
│ user_id (FK)       │
│ title              │
│ theme              │
│ data (JSONB)       │
│ created_at         │
│ updated_at         │
└─────────────────────┘

┌─────────────────────┐
│  shared_resumes     │
├─────────────────────┤
│ id (PK)            │
│ share_id (UNIQUE)  │
│ data (JSONB)       │
│ created_at         │
└─────────────────────┘
```

## Table Definitions

### 1. users Table

Stores user account information with authentication credentials.

| Column        | Type          | Constraints      | Description                    |
|--------------|---------------|------------------|--------------------------------|
| id           | SERIAL        | PRIMARY KEY      | Auto-incrementing identifier   |
| name         | VARCHAR(255)  | NOT NULL         | User's full name               |
| email        | VARCHAR(255)  | UNIQUE, NOT NULL | User's email (login)           |
| password_hash| VARCHAR(255)  | NOT NULL         | Bcrypt hashed password         |
| created_at   | TIMESTAMP(6)  | DEFAULT NOW()    | Account creation timestamp     |
| updated_at   | TIMESTAMP(6)  | DEFAULT NOW()    | Last update timestamp          |

**Indexes**: `idx_users_email` on `email`

### 2. resumes Table

Stores resume data for authenticated users.

| Column     | Type         | Constraints      | Description                    |
|-----------|--------------|------------------|--------------------------------|
| id        | SERIAL       | PRIMARY KEY      | Auto-incrementing identifier   |
| user_id   | INTEGER      | FOREIGN KEY      | Reference to users.id          |
| title     | VARCHAR(255) | NOT NULL         | Resume title                   |
| theme     | VARCHAR(100) | NOT NULL         | Visual theme identifier        |
| data      | JSONB        | NOT NULL         | Complete resume content        |
| created_at| TIMESTAMP(6) | DEFAULT NOW()    | Creation timestamp             |
| updated_at| TIMESTAMP(6) | DEFAULT NOW()    | Last modification timestamp    |

**Indexes**: `idx_resumes_user_id` on `user_id`  
**Foreign Key**: `user_id` REFERENCES `users(id)` ON DELETE CASCADE

### 3. shared_resumes Table

Stores publicly shared resume snapshots.

| Column     | Type         | Constraints      | Description                    |
|-----------|--------------|------------------|--------------------------------|
| id        | SERIAL       | PRIMARY KEY      | Auto-incrementing identifier   |
| share_id  | VARCHAR(255) | UNIQUE, NOT NULL | Unique share URL identifier    |
| data      | JSONB        | NOT NULL         | Resume snapshot                |
| created_at| TIMESTAMP(6) | DEFAULT NOW()    | Share creation timestamp       |

**Indexes**: `idx_shared_resumes_share_id` on `share_id`

## Prisma Schema

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id           Int       @id @default(autoincrement())
  name         String    @db.VarChar(255)
  email        String    @unique @db.VarChar(255)
  passwordHash String    @map("password_hash") @db.VarChar(255)
  createdAt    DateTime? @default(now()) @map("created_at")
  updatedAt    DateTime? @default(now()) @map("updated_at")
  resumes      Resume[]
  @@index([email])
  @@map("users")
}

model Resume {
  id        Int       @id @default(autoincrement())
  userId    Int?      @map("user_id")
  title     String    @db.VarChar(255)
  theme     String    @db.VarChar(100)
  data      Json
  createdAt DateTime? @default(now()) @map("created_at")
  updatedAt DateTime? @default(now()) @map("updated_at")
  user      User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([userId])
  @@map("resumes")
}

model SharedResume {
  id        Int       @id @default(autoincrement())
  shareId   String    @unique @map("share_id") @db.VarChar(255)
  data      Json
  createdAt DateTime? @default(now()) @map("created_at")
  @@index([shareId])
  @@map("shared_resumes")
}
```

## Security Measures

1. **Password Security**: Bcrypt hashing with 10 salt rounds
2. **SQL Injection Prevention**: Parameterized queries via Prisma
3. **Data Access Control**: JWT-based authentication
4. **Email Uniqueness**: Database-level UNIQUE constraint

---

**Document Version**: 1.0  
**Last Updated**: January 2024
