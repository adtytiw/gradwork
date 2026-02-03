# gradWork

A modern job platform connecting undergraduate students with internships and entry-level positions.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)

## 🚀 Features

### For Students
- 🎓 Create a professional profile
- 🔍 Browse internships and entry-level jobs
- 📝 One-click job applications
- 📊 Track application status in real-time

### For Companies
- 🏢 Company profile management
- 📋 Post and manage job listings
- 👥 Review candidate applications
- ✅ Accept/reject applicants

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Supabase Auth](https://supabase.com/auth) | Authentication |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [React Hook Form](https://react-hook-form.com/) | Form handling |
| [Zod](https://zod.dev/) | Schema validation |

### Backend
| Technology | Purpose |
|------------|---------|
| [NestJS](https://nestjs.com/) | Node.js framework |
| [Prisma 7](https://www.prisma.io/) | Database ORM |
| [PostgreSQL](https://www.postgresql.org/) | Database (via Supabase) |
| [Passport JWT](http://www.passportjs.org/) | JWT authentication |
| [class-validator](https://github.com/typestack/class-validator) | DTO validation |

### Infrastructure
| Service | Purpose |
|---------|---------|
| [Supabase](https://supabase.com/) | Auth, Database, Storage |

## 📁 Project Structure

```
gradwork/
├── frontend/                 # Next.js 14 application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (auth)/      # Auth pages (login, register)
│   │   │   ├── (dashboard)/ # Protected dashboard pages
│   │   │   └── page.tsx     # Landing page
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── lib/             # Utilities (API client, Supabase)
│   └── package.json
│
├── backend/                  # NestJS application
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User profile management
│   │   ├── jobs/            # Job CRUD operations
│   │   ├── applications/    # Application management
│   │   └── prisma/          # Prisma service
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
│
└── llm/                      # Development logs
    ├── environment_llm.txt   # Project specifications
    └── mvp_log.md           # Development progress
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+ (via [nvm](https://github.com/nvm-sh/nvm))
- npm or yarn
- Supabase account

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gradwork.git
cd gradwork
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and note your:
   - Project URL
   - Anon/Public key
3. Go to **Settings → JWT Keys → Legacy JWT Secret** for the JWT secret
4. Go to **Authentication → Providers → Email** and disable "Confirm email" for development

### 3. Configure Environment Variables

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

**Backend** (`backend/.env`):
```env
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DATABASE_URL="postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres"
SUPABASE_PROJECT_URL=https://your-project.supabase.co
SUPABASE_JWT_SECRET=your-jwt-secret
```

### 4. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 5. Run Database Migrations

```bash
cd backend
npx prisma migrate dev
```

### 6. Start Development Servers

```bash
# Terminal 1 - Backend (port 4000)
cd backend
npm run start:dev

# Terminal 2 - Frontend (port 3000)
cd frontend
npm run dev
```

Visit **http://localhost:3000** to see the app!

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Create user profile |
| GET | `/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile` | Get own profile |
| PATCH | `/users/profile/student` | Update student profile |
| PATCH | `/users/profile/company` | Update company profile |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | List all jobs |
| GET | `/jobs/:id` | Get job details |
| POST | `/jobs` | Create job (Company) |
| PATCH | `/jobs/:id` | Update job (Owner) |
| DELETE | `/jobs/:id` | Delete job (Owner) |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications/my` | My applications (Student) |
| GET | `/applications/received` | Received applications (Company) |
| POST | `/applications` | Apply to job (Student) |
| PATCH | `/applications/:id/status` | Update status (Company) |

## 🗄️ Database Schema

```prisma
model User {
  id visually String @id
  email       String @unique
  role        Role   @default(STUDENT)
  
  studentProfile  StudentProfile?
  companyProfile  CompanyProfile?
  jobs            Job[]
  applications    Application[]
}

model Job {
  id          String   @id
  title       String
  description String
  location    String
  type        JobType
  salary      String?
  company     User     @relation
  applications Application[]
}

model Application {
  id        String @id
  status    ApplicationStatus @default(PENDING)
  student   User   @relation
  job       Job    @relation
}
```

## 🎨 Screenshots

### Landing Page
Modern dark theme with gradient effects, inspired by Vercel/Next.js design.

### Dashboard
Role-based dashboard with sidebar navigation for students and companies.

### Job Listings
Browse and filter job opportunities with application tracking.

## 🔒 Authentication Flow

1. User signs up via Supabase Auth (email/password)
2. Supabase issues JWT token
3. Frontend stores session and sends token to backend
4. Backend verifies JWT via Supabase JWKS endpoint
5. Protected routes require valid JWT in Authorization header

## 🚧 Roadmap (v0.2)

- [ ] Resume upload (Supabase Storage)
- [ ] Job search and filters
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] AI-powered job matching

## 📝 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- Built with [Supabase](https://supabase.com)
- UI inspired by [Vercel](https://vercel.com)
- Icons from [Heroicons](https://heroicons.com)

---

**gradWork v0.1** - Built for undergraduates, by developers who care.
