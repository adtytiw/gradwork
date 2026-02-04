# gradWork MVP Development Log
## Last Updated: 2026-02-03

---

## MVP SCOPE (V1)

### Core User Flows
1. **Student**: Sign up → Complete profile → Browse jobs → Apply → Track applications
2. **Company**: Sign up → Create company profile → Post jobs → Review applications
3. **Auth**: Email/password via Supabase Auth

### Features IN Scope
- [x] User authentication (Supabase Auth)
- [x] Role-based access (Student/Company)
- [x] Student profile management
- [x] Company profile management
- [x] Job CRUD (Company creates, all view)
- [x] Job applications (Student applies, Company reviews)
- [ ] Resume upload (Supabase Storage) - TODO

### Features OUT of Scope (V1)
- Admin dashboard
- Email notifications
- Search/filter (basic only)
- AI matching
- WebSockets/real-time

---

## ARCHITECTURE

```
┌─────────────────┐      ┌─────────────────┐       ┌─────────────────┐
│    Frontend     │────▶│     Backend     │────▶ │    Supabase     │
│   Next.js 14    │      │     NestJS      │       │   PostgreSQL    │
│   Port 3000     │      │   Port 4000     │       │   Auth/Storage  │
└─────────────────┘      └─────────────────┘       └─────────────────┘
```

### Auth Flow
1. Frontend initiates login via Supabase Auth SDK
2. Supabase returns JWT token
3. Frontend sends token to backend in Authorization header
4. Backend verifies JWT with Supabase public key
5. Backend returns protected resources

---

## DATABASE SCHEMA (Prisma)

### Models
- **User** - Base user linked to Supabase auth.users
- **StudentProfile** - Extended student info + resume
- **CompanyProfile** - Company details + logo
- **Job** - Job postings by companies
- **Application** - Student applications to jobs

### Enums
- Role: STUDENT | COMPANY | ADMIN
- JobType: INTERNSHIP | FULL_TIME | PART_TIME
- ApplicationStatus: PENDING | REVIEWING | ACCEPTED | REJECTED

---

## API ENDPOINTS (Backend)

### Auth
- POST /auth/register - Create user profile after Supabase signup
- GET /auth/me - Get current user from JWT

### Users
- GET /users/profile - Get own profile
- PATCH /users/profile - Update profile

### Jobs
- GET /jobs - List all active jobs
- GET /jobs/:id - Get job details
- POST /jobs - Create job (Company only)
- PATCH /jobs/:id - Update job (Owner only)
- DELETE /jobs/:id - Delete job (Owner only)

### Applications
- GET /applications - List my applications (Student) or received (Company)
- POST /applications - Apply to job (Student only)
- PATCH /applications/:id - Update status (Company only)

---

## FRONTEND PAGES

### Public
- / - Landing page
- /login - Login form
- /register - Registration form
- /jobs - Public job listings

### Student (Protected)
- /dashboard - Student dashboard
- /profile - Edit student profile
- /jobs/:id - Job details + Apply button
- /applications - My applications

### Company (Protected)
- /company/dashboard - Company dashboard
- /company/profile - Edit company profile
- /company/jobs - Manage posted jobs
- /company/jobs/new - Create new job
- /company/applications - Review applications

---

## PROGRESS LOG

### 2026-02-03 - Environment Setup
- [x] Node.js 20.20.0 via nvm.fish
- [x] Next.js 14 frontend scaffolded
- [x] NestJS backend scaffolded
- [x] Prisma ORM configured
- [x] Supabase project created (wqnhcogwvfpswngzbhee)
- [x] Database migrated with initial schema
- [x] Both servers running locally

### 2026-02-03 - MVP Development
- [x] Backend: Auth module (JWT strategy, guards, decorators)
- [x] Backend: Users module (profile CRUD)
- [x] Backend: Jobs module (CRUD, company-only create)
- [x] Backend: Applications module (apply, status updates)
- [x] Frontend: Auth pages (login, register with role selection)
- [x] Frontend: Layouts (sidebar nav, protected routes)
- [x] Frontend: Job pages (list, detail, create, manage)
- [x] Frontend: Application flow (apply, track, review)
- [x] Frontend: Profile page (student/company)
- [x] Landing page

### Build Status
- Backend: ✓ Running on http://localhost:4000
- Frontend: ✓ Running on http://localhost:3000

### Servers Running (2026-02-03 23:34)
- Backend PID: 47923 - All routes mapped successfully
- Frontend: Next.js 14.2.35 ready

### v0.1 Released (2026-02-04)
- ✓ Full auth flow working (Supabase + JWKS verification)
- ✓ Student registration and login
- ✓ Modern dark UI (Vercel/Next.js style)
- ✓ Dashboard with role-based routing
- ✓ README.md documentation complete

---

## NOTES / DECISIONS

1. Using Supabase Auth for identity, backend for authorization
2. Prisma owns all schema migrations
3. No RLS on Supabase - backend handles all access control
4. JWT verification via @nestjs/passport + passport-jwt
5. Frontend uses TanStack Query for server state

---

## COMMANDS

```bash
# Start development
cd frontend && npm run dev      # Port 3000
cd backend && npm run start:dev # Port 4000

# Database
cd backend && npx prisma migrate dev  # Run migrations
cd backend && npx prisma studio       # GUI for database

# Generate Prisma client after schema changes
cd backend && npx prisma generate
```
