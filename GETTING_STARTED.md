# 🚀 Getting Started - Carbon Footprint Platform

This guide will help you set up the development environment and start building the Carbon Footprint Awareness Platform MVP.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm** or **pnpm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **PostgreSQL** 15+ ([Download](https://www.postgresql.org/download/)) OR use a cloud service
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense

---

## Step 1: Initialize the Project

### 1.1 Create Next.js Project

```bash
# Create new Next.js 14 project with TypeScript
npx create-next-app@latest carbon-footprint-tracker

# When prompted, select:
# ✓ TypeScript: Yes
# ✓ ESLint: Yes
# ✓ Tailwind CSS: Yes
# ✓ src/ directory: No
# ✓ App Router: Yes
# ✓ Import alias: Yes (@/*)

cd carbon-footprint-tracker
```

### 1.2 Install Core Dependencies

```bash
# Database & ORM
npm install @prisma/client
npm install -D prisma

# Authentication
npm install next-auth@beta
npm install bcryptjs
npm install -D @types/bcryptjs

# Validation
npm install zod

# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-tabs
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Charts & Visualization
npm install recharts

# Date handling
npm install date-fns

# State Management
npm install zustand

# Forms
npm install react-hook-form @hookform/resolvers
```

### 1.3 Install Development Dependencies

```bash
# Testing
npm install -D vitest @vitejs/plugin-react
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test

# Code Quality
npm install -D prettier prettier-plugin-tailwindcss
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Git Hooks
npm install -D husky lint-staged
```

---

## Step 2: Project Structure Setup

### 2.1 Create Folder Structure

```bash
# Create main directories
mkdir -p app/(auth)/login app/(auth)/signup
mkdir -p app/(dashboard)/dashboard app/(dashboard)/track
mkdir -p app/(dashboard)/challenges app/(dashboard)/community
mkdir -p app/api/auth app/api/activities app/api/quiz
mkdir -p app/api/insights app/api/challenges app/api/community
mkdir -p app/api/dashboard app/api/calculations
mkdir -p app/onboarding
mkdir -p components/ui components/dashboard components/tracking
mkdir -p components/challenges components/community
mkdir -p lib/services lib/utils
mkdir -p prisma
mkdir -p types
mkdir -p public/images public/icons
```

### 2.2 Project Structure Overview

```
carbon-footprint-tracker/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── dashboard/
│   │   ├── track/
│   │   ├── challenges/
│   │   └── community/
│   ├── api/                 # API routes
│   │   ├── auth/
│   │   ├── activities/
│   │   ├── quiz/
│   │   ├── insights/
│   │   ├── challenges/
│   │   ├── community/
│   │   ├── dashboard/
│   │   └── calculations/
│   ├── onboarding/          # Quiz & onboarding flow
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── dashboard/           # Dashboard-specific components
│   ├── tracking/            # Activity tracking components
│   ├── challenges/          # Challenge components
│   └── community/           # Community feed components
├── lib/
│   ├── db.ts               # Prisma client
│   ├── auth.ts             # NextAuth configuration
│   ├── services/           # Business logic services
│   │   ├── carbon-calculator.ts
│   │   ├── insights-generator.ts
│   │   └── challenge-manager.ts
│   └── utils/              # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data script
├── types/                  # TypeScript type definitions
├── public/                 # Static assets
└── tests/                  # Test files
```

---

## Step 3: Database Setup

### 3.1 Choose Database Provider

**Option A: Local PostgreSQL**
```bash
# Install PostgreSQL locally
# Create database
createdb carbon_footprint_dev
```

**Option B: Vercel Postgres (Recommended for MVP)**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Create Postgres database
vercel postgres create
```

**Option C: Supabase**
- Sign up at [supabase.com](https://supabase.com)
- Create new project
- Get connection string from project settings

### 3.2 Configure Environment Variables

Create `.env` file in project root:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/carbon_footprint_dev"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Optional: For production
# NEXTAUTH_URL="https://your-domain.com"
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 3.3 Initialize Prisma

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env file (if not exists)
```

### 3.4 Create Database Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  avatarUrl String?  @map("avatar_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  profile        UserProfile?
  activities     ActivityLog[]
  quizResponses  QuizResponse[]
  insights       UserInsight[]
  challenges     UserChallenge[]
  achievements   Achievement[]
  posts          CommunityPost[]
  likes          PostLike[]

  @@map("users")
}

model UserProfile {
  id                      String   @id @default(uuid())
  userId                  String   @unique @map("user_id")
  carbonScore             Int      @default(50) @map("carbon_score")
  baselineEmissions       Decimal  @map("baseline_emissions") @db.Decimal(10, 2)
  reductionGoalPercentage Int?     @map("reduction_goal_percentage")
  goalDeadline            DateTime? @map("goal_deadline")
  country                 String?
  city                    String?
  householdSize           Int?     @map("household_size")
  createdAt               DateTime @default(now()) @map("created_at")
  updatedAt               DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_profiles")
}

model ActivityLog {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  category     String
  activityType String   @map("activity_type")
  amount       Decimal  @db.Decimal(10, 2)
  unit         String
  emissionsKg  Decimal  @map("emissions_kg") @db.Decimal(10, 2)
  date         DateTime @db.Date
  notes        String?
  createdAt    DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, date])
  @@map("activity_logs")
}

model EmissionFactor {
  id              String   @id @default(uuid())
  category        String
  activityType    String   @map("activity_type")
  factorKgCo2     Decimal  @map("factor_kg_co2_per_unit") @db.Decimal(10, 4)
  unit            String
  source          String
  region          String?
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@unique([category, activityType, region])
  @@map("emission_factors")
}

model QuizResponse {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  questionId String   @map("question_id")
  answer     String
  createdAt  DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("quiz_responses")
}

model UserInsight {
  id          String    @id @default(uuid())
  userId      String    @map("user_id")
  insightType String    @map("insight_type")
  title       String
  description String
  priority    Int       @default(5)
  isRead      Boolean   @default(false) @map("is_read")
  createdAt   DateTime  @default(now()) @map("created_at")
  expiresAt   DateTime? @map("expires_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isRead])
  @@map("user_insights")
}

model Challenge {
  id                String    @id @default(uuid())
  title             String
  description       String
  category          String
  durationDays      Int       @map("duration_days")
  targetReductionKg Decimal   @map("target_reduction_kg") @db.Decimal(10, 2)
  badgeIcon         String    @map("badge_icon")
  isActive          Boolean   @default(true) @map("is_active")
  createdAt         DateTime  @default(now()) @map("created_at")

  userChallenges UserChallenge[]

  @@map("challenges")
}

model UserChallenge {
  id               String   @id @default(uuid())
  userId           String   @map("user_id")
  challengeId      String   @map("challenge_id")
  status           String   @default("active")
  startDate        DateTime @map("start_date") @db.Date
  endDate          DateTime @map("end_date") @db.Date
  progressPercent  Int      @default(0) @map("progress_percentage")
  emissionsSavedKg Decimal  @default(0) @map("emissions_saved_kg") @db.Decimal(10, 2)
  createdAt        DateTime @default(now()) @map("created_at")
  updatedAt        DateTime @updatedAt @map("updated_at")

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  challenge Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)

  @@index([userId, status])
  @@map("user_challenges")
}

model Achievement {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  badgeType String   @map("badge_type")
  badgeName String   @map("badge_name")
  earnedAt  DateTime @default(now()) @map("earned_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("achievements")
}

model CommunityPost {
  id         String   @id @default(uuid())
  userId     String   @map("user_id")
  content    String
  postType   String   @map("post_type")
  likesCount Int      @default(0) @map("likes_count")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  likes PostLike[]

  @@index([createdAt])
  @@map("community_posts")
}

model PostLike {
  id        String   @id @default(uuid())
  postId    String   @map("post_id")
  userId    String   @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")

  post CommunityPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  user User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([postId, userId])
  @@map("post_likes")
}
```

### 3.5 Run Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and run migration
npx prisma migrate dev --name init

# This will:
# 1. Create migration files
# 2. Apply migration to database
# 3. Generate Prisma Client
```

### 3.6 Create Seed Script

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding emission factors...')

  // Transport emission factors
  await prisma.emissionFactor.createMany({
    data: [
      {
        category: 'transport',
        activityType: 'car_petrol',
        factorKgCo2: 0.192,
        unit: 'km',
        source: 'EPA',
        region: 'US',
      },
      {
        category: 'transport',
        activityType: 'car_diesel',
        factorKgCo2: 0.171,
        unit: 'km',
        source: 'EPA',
        region: 'US',
      },
      // Add more emission factors...
    ],
  })

  // Create sample challenges
  await prisma.challenge.createMany({
    data: [
      {
        title: 'Car-Free Week',
        description: 'Avoid using your car for 7 days',
        category: 'transport',
        durationDays: 7,
        targetReductionKg: 30,
        badgeIcon: '🚲',
      },
      // Add more challenges...
    ],
  })

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Run seed:
```bash
npx prisma db seed
```

---

## Step 4: Configure Development Tools

### 4.1 ESLint Configuration

Update `.eslintrc.json`:

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

### 4.2 Prettier Configuration

Create `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 4.3 Git Hooks Setup

```bash
# Initialize Husky
npx husky init

# Add pre-commit hook
echo "npx lint-staged" > .husky/pre-commit
```

Create `lint-staged.config.js`:

```javascript
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md}': ['prettier --write'],
}
```

### 4.4 TypeScript Configuration

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Step 5: Set Up shadcn/ui

```bash
# Initialize shadcn/ui
npx shadcn-ui@latest init

# When prompted:
# ✓ Style: Default
# ✓ Base color: Slate
# ✓ CSS variables: Yes

# Install commonly used components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add progress
```

---

## Step 6: Create Core Utilities

### 6.1 Prisma Client

Create `lib/db.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 6.2 Utility Functions

Create `lib/utils/cn.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## Step 7: Run Development Server

```bash
# Start development server
npm run dev

# Open browser at http://localhost:3000
```

---

## Step 8: Verify Setup

### Checklist

- [ ] Next.js app runs without errors
- [ ] Database connection works
- [ ] Prisma Client generates successfully
- [ ] ESLint and Prettier are configured
- [ ] Git hooks are working
- [ ] shadcn/ui components are available

### Test Database Connection

Create `app/api/test/route.ts`:

```typescript
import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await prisma.$connect()
    return NextResponse.json({ status: 'Database connected!' })
  } catch (error) {
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
}
```

Visit `http://localhost:3000/api/test` to verify.

---

## Next Steps

Now that your development environment is set up, you can:

1. **Review the Implementation Plan** - See [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md)
2. **Check API Specification** - See [`API_SPECIFICATION.md`](./API_SPECIFICATION.md)
3. **Study Architecture** - See [`TECHNICAL_ARCHITECTURE.md`](./TECHNICAL_ARCHITECTURE.md)
4. **Start Building** - Begin with Step 1: Authentication System

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open Prisma Studio (DB GUI)
npx prisma migrate dev   # Create and apply migration
npx prisma generate      # Generate Prisma Client
npx prisma db seed       # Run seed script
npx prisma db push       # Push schema without migration

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run E2E tests
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test connection string
psql "postgresql://user:password@localhost:5432/carbon_footprint_dev"
```

### Prisma Issues

```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Clear Prisma cache
rm -rf node_modules/.prisma
npx prisma generate
```

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
```

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

**Document Version:** 1.0  
**Created:** June 12, 2026  
**Status:** Setup Guide