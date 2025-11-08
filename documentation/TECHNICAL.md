# ImpactCV - Technical Documentation

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────┐
│      Presentation Layer (React)         │
│  Pages | Components | Hooks             │
└─────────────────────────────────────────┘
                  │
                  │ REST API
                  ▼
┌─────────────────────────────────────────┐
│   Application Layer (Express.js)        │
│  Routes | Middleware | Services         │
└─────────────────────────────────────────┘
                  │
                  │ Prisma ORM
                  ▼
┌─────────────────────────────────────────┐
│    Data Layer (PostgreSQL/Supabase)     │
│  users | resumes | shared_resumes       │
└─────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18.3.1**: UI library
- **TypeScript 5.6.2**: Type safety
- **Vite 5.4.2**: Build tool
- **Tailwind CSS 3.4.1**: Styling
- **Radix UI**: Component primitives
- **React Router DOM 6.22.0**: Routing

### Backend
- **Node.js 18+**: Runtime
- **Express.js 4.18.2**: Web framework
- **Prisma 6.19.0**: ORM
- **PostgreSQL 15+**: Database
- **JWT**: Authentication
- **bcrypt**: Password hashing

## Project Structure

```
ImpactCV/
├── src/                    # Frontend source
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── utils/             # Utilities
│   └── App.tsx            # Root component
├── server/                # Backend source
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── utils/             # Utilities
│   └── server.js          # Server entry
├── prisma/                # Database schema
└── documentation/         # Documentation
```

## Authentication Flow

```
1. User Registration/Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client stores token (localStorage)
   ↓
5. Client includes token in requests
   ↓
6. Server verifies token
   ↓
7. Server processes request
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Resumes (Protected)
- `GET /api/resumes` - Get all user resumes
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /resume/:id` - Delete resume

### Sharing (Public)
- `POST /api/share-resume` - Create share link
- `GET /api/share-resume/:shareId` - Get shared resume

## Security

### Password Security
- Bcrypt hashing (10 salt rounds)
- No plain text storage
- Server-side validation

### JWT Authentication
- Token expiration: 24 hours
- Stored in localStorage
- Verified on each protected request

### Database Security
- Parameterized queries (Prisma)
- Connection pooling (PgBouncer)
- Environment variable credentials

## Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Memoization with useMemo/useCallback
- Debounced auto-save
- Lazy loading images

### Backend
- Database query optimization
- Connection pooling
- Response compression
- Efficient indexing

## Deployment

### Frontend (Vercel)
- Build: `npm run build`
- Output: `dist/`
- Environment: `VITE_API_URL`

### Backend (Render)
- Build: `npm install && npx prisma generate`
- Start: `node server.js`
- Environment: `DATABASE_URL`, `JWT_SECRET`

## Development Workflow

### Commands
```bash
# Install dependencies
npm install

# Start development
npm run dev                    # Frontend
cd server && node server.js    # Backend

# Build for production
npm run build

# Database
npx prisma generate           # Generate client
npx prisma studio            # Open GUI
npx prisma db push           # Push schema
```

### Git Workflow
```
main (production)
  ├── develop (staging)
  │   ├── feature/feature-name
  │   └── bugfix/bug-name
```

## Troubleshooting

### Database Connection Failed
- Check `DATABASE_URL` in `.env`
- Verify Supabase project is active
- Test: `node test-supabase-connection.js`

### Prisma Client Not Generated
```bash
npx prisma generate
```

### JWT Token Invalid
- Check `JWT_SECRET` matches
- Clear localStorage and re-login

### CORS Errors
- Add frontend URL to CORS whitelist
- Verify API URL in frontend

---

**Document Version**: 1.0  
**Last Updated**: January 2024
