# Authentication System Setup Guide

## Overview
This document provides instructions for setting up and using the JWT-based authentication system in ImpactCV.

## Prerequisites
- Node.js installed
- PostgreSQL database (local or Supabase)
- npm or yarn package manager

## Installation

### 1. Install Dependencies
```bash
npm install
```

This will install the required authentication packages:
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT token generation and verification

### 2. Database Setup

#### Option A: Update Existing Database
If you already have a users table, run the migration:
```bash
psql -U your_username -d resumedb -f server/migrations/add-name-to-users.sql
```

#### Option B: Create Fresh Database
If starting fresh, run the schema:
```bash
psql -U your_username -d resumedb -f server/schema.sql
```

### 3. Environment Variables

Make sure your `.env` file contains:
```env
# Database Configuration
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=resumedb
DB_PASSWORD=your_db_password
DB_PORT=5432

# Server Configuration
PORT=3001

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

**Important:** Change the `JWT_SECRET` to a strong, random string in production!

## Running the Application

### 1. Start the Backend Server
```bash
cd server
node server.js
```

The server will run on `http://localhost:3001` (or your configured PORT)

### 2. Start the Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default)

## API Endpoints

### Public Endpoints

#### Register User
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Protected Endpoints

All resume endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

#### Get User's Resumes
```http
GET /api/resumes
Authorization: Bearer <token>
```

#### Create Resume
```http
POST /api/resumes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Resume",
  "content": { ... }
}
```

#### Update Resume
```http
PUT /api/resumes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "data": { ... }
}
```

#### Delete Resume
```http
DELETE /api/resume/:id
Authorization: Bearer <token>
```

## Frontend Usage

### Authentication Flow

1. **User visits homepage** (`/`)
   - Sees landing page with Login/Sign Up buttons

2. **User signs up** (`/signup`)
   - Fills registration form
   - Account created → redirected to login

3. **User logs in** (`/login`)
   - Enters credentials
   - Token stored in sessionStorage
   - Redirected to dashboard

4. **User accesses dashboard** (`/dashboard`)
   - Protected route checks for token
   - If authenticated: shows dashboard with user greeting
   - If not authenticated: redirects to login

5. **User logs out**
   - Clicks logout button
   - Token cleared from sessionStorage
   - Redirected to homepage

### Session Storage

The authentication system uses `sessionStorage` to store:
- `authToken`: JWT token
- `user`: User object (id, name, email)

Session data is automatically cleared when the browser tab is closed.

### Protected Routes

The following routes require authentication:
- `/dashboard` - User's resume dashboard
- `/editor/:id` - Resume editor
- `/preview/:id` - Resume preview

Unauthenticated users are automatically redirected to `/login`.

### Authenticated User Redirects

If an authenticated user tries to access public routes, they are redirected to `/dashboard`:
- `/` → `/dashboard`
- `/login` → `/dashboard`
- `/signup` → `/dashboard`

## Security Features

### Password Security
- Passwords are hashed using bcrypt with 10 salt rounds
- Plain text passwords are never stored
- Password hashes are never returned in API responses

### JWT Security
- Tokens are signed with a secret key
- Tokens expire after 24 hours
- Tokens are stored in sessionStorage (cleared on tab close)
- Invalid or expired tokens result in 401 errors

### API Security
- CORS enabled for cross-origin requests
- Input validation on all endpoints
- SQL injection prevention using parameterized queries
- Authentication middleware protects sensitive routes

## Troubleshooting

### "No token provided" Error
- Make sure you're logged in
- Check that the token exists in sessionStorage
- Verify the Authorization header is included in requests

### "Invalid credentials" Error
- Check email and password are correct
- Ensure the user account exists (try registering first)

### "Email already registered" Error
- The email is already in use
- Try logging in instead of signing up
- Use a different email address

### Database Connection Errors
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure the database and tables exist

### Token Expired Error
- Log out and log in again to get a new token
- Tokens expire after 24 hours

## Testing

### Manual Testing Checklist

- [ ] User can register with valid data
- [ ] Registration fails with duplicate email
- [ ] User can log in with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Dashboard shows user's name
- [ ] Dashboard is protected (redirects if not logged in)
- [ ] Token persists across page refresh
- [ ] Logout clears session and redirects to home
- [ ] Authenticated users are redirected from public pages

### Using Postman/Thunder Client

1. Register a user:
   ```
   POST http://localhost:3001/api/users/register
   Body: { "name": "Test User", "email": "test@example.com", "password": "password123" }
   ```

2. Login:
   ```
   POST http://localhost:3001/api/users/login
   Body: { "email": "test@example.com", "password": "password123" }
   ```

3. Copy the token from the response

4. Test protected endpoint:
   ```
   GET http://localhost:3001/api/resumes
   Headers: Authorization: Bearer <paste-token-here>
   ```

## Production Deployment

### Before Deploying:

1. **Change JWT_SECRET**
   - Generate a strong random string
   - Never commit the production secret to version control

2. **Use Environment Variables**
   - Store all secrets in environment variables
   - Use a service like Vercel, Heroku, or AWS Secrets Manager

3. **Enable HTTPS**
   - Always use HTTPS in production
   - JWT tokens should never be transmitted over HTTP

4. **Database Security**
   - Use strong database passwords
   - Enable SSL for database connections
   - Restrict database access by IP

5. **Rate Limiting**
   - Consider adding rate limiting to prevent brute force attacks
   - Use packages like `express-rate-limit`

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check the console for error messages
4. Verify environment variables are set correctly

## License

This authentication system is part of the ImpactCV project.
