# 🚀 Carbon Footprint Platform - Step-by-Step Implementation Guide

> **Complete implementation guide for building the Carbon Footprint Platform on GCP Free Tier**

This guide provides detailed, actionable steps to implement the [GCP_IMPLEMENTATION_PLAN.md](./GCP_IMPLEMENTATION_PLAN.md) over 7 weeks with **$0/month hosting costs**.

---

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] Google Cloud Platform account created
- [ ] Node.js 20+ and npm installed
- [ ] Git installed and configured
- [ ] Code editor (VS Code recommended)
- [ ] Basic knowledge of TypeScript, React, and Next.js
- [ ] GitHub account for version control

---

## 🗓️ Week 1: GCP Setup & Foundation

### Day 1-2: GCP Project Setup

#### Step 1: Create GCP Project
```bash
# 1. Go to https://console.cloud.google.com
# 2. Click "Select a project" → "New Project"
# 3. Project name: "carbon-footprint-tracker"
# 4. Note your Project ID (e.g., carbon-footprint-tracker-123456)
```

#### Step 2: Enable Required APIs
```bash
# Install gcloud CLI first: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
```

#### Step 3: Set Up Billing Alerts
```bash
# Create budget alert (even for free tier monitoring)
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT_ID \
  --display-name="Carbon Tracker Budget Alert" \
  --budget-amount=5 \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100
```

#### Step 4: Configure IAM and Service Accounts
```bash
# Create service account for Cloud Run
gcloud iam service-accounts create carbon-tracker-sa \
  --display-name="Carbon Tracker Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:carbon-tracker-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/datastore.user"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:carbon-tracker-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.objectViewer"

# Create and download service account key
gcloud iam service-accounts keys create ./service-account-key.json \
  --iam-account=carbon-tracker-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

#### Step 5: Set Up Secret Manager
```bash
# Create secrets for sensitive data
echo -n "your-nextauth-secret-here" | gcloud secrets create nextauth-secret --data-file=-

# Grant service account access to secrets
gcloud secrets add-iam-policy-binding nextauth-secret \
  --member="serviceAccount:carbon-tracker-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**✅ Deliverable:** GCP project configured with all services enabled

---

### Day 3-4: Firestore Database Setup

#### Step 1: Initialize Firestore
```bash
# Go to Firebase Console: https://console.firebase.google.com
# 1. Click "Add project"
# 2. Select your existing GCP project
# 3. Enable Google Analytics (optional)
# 4. Go to Firestore Database
# 5. Click "Create database"
# 6. Select "Start in production mode"
# 7. Choose location: us-central1 (or nearest to you)
```

#### Step 2: Create Firestore Security Rules

Create [`firestore.rules`](firestore.rules):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
      
      // User profile subcollection
      match /profile/{document=**} {
        allow read, write: if isOwner(userId);
      }
      
      // User activities subcollection
      match /activities/{activityId} {
        allow read, write: if isOwner(userId);
      }
      
      // User insights subcollection
      match /insights/{insightId} {
        allow read, write: if isOwner(userId);
      }
      
      // User challenges subcollection
      match /userChallenges/{challengeId} {
        allow read, write: if isOwner(userId);
      }
      
      // User achievements subcollection
      match /achievements/{achievementId} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // Global challenges (read-only for users)
    match /challenges/{challengeId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins via backend
    }
    
    // Emission factors (read-only)
    match /emissionFactors/{factorId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins via backend
    }
    
    // Community posts
    match /communityPosts/{postId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

Deploy rules:
```bash
firebase deploy --only firestore:rules
```

#### Step 3: Create Composite Indexes

Create [`firestore.indexes.json`](firestore.indexes.json):
```json
{
  "indexes": [
    {
      "collectionGroup": "activities",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "activities",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "category", "order": "ASCENDING" },
        { "fieldPath": "date", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "communityPosts",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "challenges",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "isActive", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

#### Step 4: Create Seed Data Script

Create [`scripts/seed-firestore.ts`](scripts/seed-firestore.ts):
```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const serviceAccount = require('../service-account-key.json');

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function seedEmissionFactors() {
  console.log('Seeding emission factors...');
  
  const factors = [
    // Transport
    { category: 'transport', type: 'car_petrol', factor: 0.192, unit: 'kg CO2/km', description: 'Average petrol car' },
    { category: 'transport', type: 'car_diesel', factor: 0.171, unit: 'kg CO2/km', description: 'Average diesel car' },
    { category: 'transport', type: 'car_electric', factor: 0.053, unit: 'kg CO2/km', description: 'Average electric car' },
    { category: 'transport', type: 'bus', factor: 0.089, unit: 'kg CO2/km', description: 'Local bus' },
    { category: 'transport', type: 'train', factor: 0.041, unit: 'kg CO2/km', description: 'National rail' },
    { category: 'transport', type: 'flight_domestic', factor: 0.255, unit: 'kg CO2/km', description: 'Domestic flight' },
    { category: 'transport', type: 'flight_international', factor: 0.195, unit: 'kg CO2/km', description: 'International flight' },
    { category: 'transport', type: 'motorcycle', factor: 0.113, unit: 'kg CO2/km', description: 'Average motorcycle' },
    
    // Food
    { category: 'food', type: 'beef', factor: 27.0, unit: 'kg CO2/kg', description: 'Beef' },
    { category: 'food', type: 'lamb', factor: 39.2, unit: 'kg CO2/kg', description: 'Lamb' },
    { category: 'food', type: 'pork', factor: 12.1, unit: 'kg CO2/kg', description: 'Pork' },
    { category: 'food', type: 'chicken', factor: 6.9, unit: 'kg CO2/kg', description: 'Chicken' },
    { category: 'food', type: 'fish', factor: 5.1, unit: 'kg CO2/kg', description: 'Fish' },
    { category: 'food', type: 'cheese', factor: 13.5, unit: 'kg CO2/kg', description: 'Cheese' },
    { category: 'food', type: 'milk', factor: 1.9, unit: 'kg CO2/L', description: 'Milk' },
    { category: 'food', type: 'eggs', factor: 4.8, unit: 'kg CO2/kg', description: 'Eggs' },
    { category: 'food', type: 'vegetables', factor: 0.4, unit: 'kg CO2/kg', description: 'Vegetables' },
    { category: 'food', type: 'fruits', factor: 0.5, unit: 'kg CO2/kg', description: 'Fruits' },
    { category: 'food', type: 'grains', factor: 0.6, unit: 'kg CO2/kg', description: 'Grains' },
    
    // Energy
    { category: 'energy', type: 'electricity', factor: 0.233, unit: 'kg CO2/kWh', description: 'Grid electricity (US avg)' },
    { category: 'energy', type: 'natural_gas', factor: 0.185, unit: 'kg CO2/kWh', description: 'Natural gas' },
    { category: 'energy', type: 'heating_oil', factor: 0.247, unit: 'kg CO2/kWh', description: 'Heating oil' },
    
    // Shopping
    { category: 'shopping', type: 'clothing', factor: 15.0, unit: 'kg CO2/item', description: 'Average clothing item' },
    { category: 'shopping', type: 'electronics', factor: 100.0, unit: 'kg CO2/item', description: 'Average electronic device' },
    { category: 'shopping', type: 'furniture', factor: 50.0, unit: 'kg CO2/item', description: 'Average furniture item' },
    { category: 'shopping', type: 'books', factor: 1.0, unit: 'kg CO2/item', description: 'Book' },
  ];
  
  const batch = db.batch();
  
  for (const factor of factors) {
    const docRef = db.collection('emissionFactors').doc();
    batch.set(docRef, {
      ...factor,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  await batch.commit();
  console.log(`✅ Seeded ${factors.length} emission factors`);
}

async function seedChallenges() {
  console.log('Seeding challenges...');
  
  const challenges = [
    {
      title: 'Car-Free Week',
      description: 'Go 7 days without using a personal car',
      category: 'transport',
      durationDays: 7,
      targetReductionKg: 50,
      difficulty: 'medium',
      xpReward: 500,
      badgeIcon: '🚲',
      isActive: true,
      createdAt: new Date()
    },
    {
      title: 'Meatless Monday',
      description: 'Avoid meat for 4 consecutive Mondays',
      category: 'food',
      durationDays: 28,
      targetReductionKg: 30,
      difficulty: 'easy',
      xpReward: 300,
      badgeIcon: '🥗',
      isActive: true,
      createdAt: new Date()
    },
    {
      title: 'Energy Saver',
      description: 'Reduce electricity usage by 20% for 2 weeks',
      category: 'energy',
      durationDays: 14,
      targetReductionKg: 40,
      difficulty: 'medium',
      xpReward: 400,
      badgeIcon: '💡',
      isActive: true,
      createdAt: new Date()
    },
    {
      title: 'Zero Waste Shopping',
      description: 'Make 10 purchases with minimal packaging',
      category: 'shopping',
      durationDays: 30,
      targetReductionKg: 20,
      difficulty: 'hard',
      xpReward: 600,
      badgeIcon: '♻️',
      isActive: true,
      createdAt: new Date()
    }
  ];
  
  const batch = db.batch();
  
  for (const challenge of challenges) {
    const docRef = db.collection('challenges').doc();
    batch.set(docRef, challenge);
  }
  
  await batch.commit();
  console.log(`✅ Seeded ${challenges.length} challenges`);
}

async function main() {
  try {
    await seedEmissionFactors();
    await seedChallenges();
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main();
```

**✅ Deliverable:** Firestore configured with security rules, indexes, and seed data

---

### Day 5-7: Next.js Project Initialization

#### Step 1: Initialize Next.js Project
```bash
# Create Next.js app with TypeScript
npx create-next-app@latest carbon-footprint-tracker --typescript --tailwind --app --src-dir --import-alias "@/*"

cd carbon-footprint-tracker
```

#### Step 2: Install Dependencies
```bash
# Core dependencies
npm install firebase firebase-admin
npm install next-auth@beta
npm install @auth/firebase-adapter
npm install zod react-hook-form @hookform/resolvers
npm install zustand
npm install recharts
npm install date-fns
npm install lucide-react

# UI components (shadcn/ui)
npx shadcn-ui@latest init

# Install specific shadcn components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom
npm install -D tsx
npm install -D vitest @vitest/ui
npm install -D @playwright/test
```

#### Step 3: Configure Project Structure
```bash
# Create folder structure
mkdir -p src/app/\(auth\)
mkdir -p src/app/\(dashboard\)
mkdir -p src/app/api
mkdir -p src/app/onboarding
mkdir -p src/components/ui
mkdir -p src/components/dashboard
mkdir -p src/components/tracking
mkdir -p src/components/challenges
mkdir -p src/components/community
mkdir -p src/lib/firebase
mkdir -p src/lib/services
mkdir -p src/lib/utils
mkdir -p src/types
mkdir -p scripts
mkdir -p public/images
```

#### Step 4: Configure Firebase Client

Create [`src/lib/firebase/config.ts`](src/lib/firebase/config.ts):
```typescript
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
```

Create [`src/lib/firebase/admin.ts`](src/lib/firebase/admin.ts):
```typescript
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export const adminDb = getFirestore();
export const adminStorage = getStorage();
```

#### Step 5: Configure Environment Variables

Create [`.env.local`](.env.local):
```env
# Firebase Client Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Production (uncomment when deploying)
# NEXTAUTH_URL=https://your-cloud-run-url.run.app
```

Create [`.env.example`](.env.example) with placeholder values.

#### Step 6: Configure Next.js

Update [`next.config.js`](next.config.js):
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Cloud Run
  images: {
    domains: ['storage.googleapis.com', 'firebasestorage.googleapis.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
```

#### Step 7: Create Dockerfile for Cloud Run

Create [`Dockerfile`](Dockerfile):
```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

Create [`.dockerignore`](.dockerignore):
```
node_modules
.next
.git
.env*.local
README.md
```

#### Step 8: Configure CI/CD

Create [`cloudbuild.yaml`](cloudbuild.yaml):
```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/carbon-tracker:$COMMIT_SHA', '.']
  
  # Push the container image to Container Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/carbon-tracker:$COMMIT_SHA']
  
  # Deploy container image to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'carbon-tracker'
      - '--image'
      - 'gcr.io/$PROJECT_ID/carbon-tracker:$COMMIT_SHA'
      - '--region'
      - 'us-central1'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--memory'
      - '512Mi'
      - '--cpu'
      - '1'
      - '--max-instances'
      - '10'

images:
  - 'gcr.io/$PROJECT_ID/carbon-tracker:$COMMIT_SHA'
```

#### Step 9: Update package.json Scripts

Update [`package.json`](package.json):
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "deploy": "gcloud run deploy carbon-tracker --source .",
    "seed": "tsx scripts/seed-firestore.ts",
    "test": "vitest",
    "test:e2e": "playwright test"
  }
}
```

#### Step 10: Test Local Development

```bash
# Run development server
npm run dev

# Visit http://localhost:3000
# You should see the default Next.js page
```

**✅ Deliverable:** Next.js app running locally with Firebase configured

---

## 🗓️ Week 2: Authentication & Onboarding

### Day 1-3: Authentication System

#### Step 1: Configure NextAuth.js

Create [`src/app/api/auth/[...nextauth]/route.ts`](src/app/api/auth/[...nextauth]/route.ts):
```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { FirestoreAdapter } from "@auth/firebase-adapter";
import { adminDb } from "@/lib/firebase/admin";
import { compare } from "bcryptjs";

const handler = NextAuth({
  adapter: FirestoreAdapter(adminDb),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Query user from Firestore
        const usersRef = adminDb.collection('users');
        const snapshot = await usersRef.where('email', '==', credentials.email).limit(1).get();
        
        if (snapshot.empty) {
          return null;
        }

        const userDoc = snapshot.docs[0];
        const user = userDoc.data();

        // Verify password
        const isValid = await compare(credentials.password, user.password);
        
        if (!isValid) {
          return null;
        }

        return {
          id: userDoc.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl,
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

#### Step 2: Create Authentication Pages

Create [`src/app/(auth)/login/page.tsx`](src/app/(auth)/login/page.tsx):
```typescript
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to track your carbon footprint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-green-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

Create [`src/app/(auth)/signup/page.tsx`](src/app/(auth)/signup/page.tsx) with similar structure.

#### Step 3: Create Protected Route Middleware

Create [`src/middleware.ts`](src/middleware.ts):
```typescript
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/tracking/:path*",
    "/challenges/:path*",
    "/community/:path*",
  ],
};
```

**✅ Deliverable:** Working authentication system with login/signup

---

### Day 4-7: Lifestyle Quiz & Onboarding

#### Step 1: Design Quiz Questions

Create [`src/lib/data/quiz-questions.ts`](src/lib/data/quiz-questions.ts):
```typescript
export const quizQuestions = [
  {
    id: 'transport',
    title: 'Transportation',
    questions: [
      {
        id: 'car_ownership',
        question: 'Do you own a car?',
        type: 'radio',
        options: ['Yes', 'No'],
      },
      {
        id: 'car_type',
        question: 'What type of car do you drive?',
        type: 'radio',
        options: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        dependsOn: { car_ownership: 'Yes' },
      },
      {
        id: 'weekly_km',
        question: 'How many kilometers do you drive per week?',
        type: 'number',
        unit: 'km',
        dependsOn: { car_ownership: 'Yes' },
      },
      {
        id: 'public_transport',
        question: 'How often do you use public transport?',
        type: 'radio',
        options: ['Daily', 'Weekly', 'Monthly', 'Rarely', 'Never'],
      },
      {
        id: 'flights_per_year',
        question: 'How many flights do you take per year?',
        type: 'number',
        unit: 'flights',
      },
    ],
  },
  {
    id: 'food',
    title: 'Food & Diet',
    questions: [
      {
        id: 'diet_type',
        question: 'What best describes your diet?',
        type: 'radio',
        options: ['Meat daily', 'Meat weekly', 'Vegetarian', 'Vegan'],
      },
      {
        id: 'local_food',
        question: 'How often do you buy local/seasonal food?',
        type: 'radio',
        options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'],
      },
      {
        id: 'food_waste',
        question: 'How much food do you waste per week?',
        type: 'radio',
        options: ['None', 'A little', 'Some', 'A lot'],
      },
    ],
  },
  {
    id: 'energy',
    title: 'Home Energy',
    questions: [
      {
        id: 'home_type',
        question: 'What type of home do you live in?',
        type: 'radio',
        options: ['Apartment', 'House', 'Shared accommodation'],
      },
      {
        id: 'home_size',
        question: 'What is the size of your home?',
        type: 'radio',
        options: ['< 50 m²', '50-100 m²', '100-150 m²', '> 150 m²'],
      },
      {
        id: 'heating_type',
        question: 'What type of heating do you use?',
        type: 'radio',
        options: ['Gas', 'Electric', 'Oil', 'Renewable'],
      },
      {
        id: 'renewable_energy',
        question: 'Do you use renewable energy?',
        type: 'radio',
        options: ['Yes', 'No', 'Partially'],
      },
    ],
  },
  {
    id: 'shopping',
    title: 'Shopping & Lifestyle',
    questions: [
      {
        id: 'new_clothes',
        question: 'How many new clothing items do you buy per month?',
        type: 'number',
        unit: 'items',
      },
      {
        id: 'electronics',
        question: 'How often do you buy new electronics?',
        type: 'radio',
        options: ['Every year', 'Every 2-3 years', 'Every 4-5 years', 'Rarely'],
      },
      {
        id: 'recycling',
        question: 'Do you recycle?',
        type: 'radio',
        options: ['Always', 'Often', 'Sometimes', 'Never'],
      },
    ],
  },
];
```

#### Step 2: Create Quiz UI Components

Create [`src/components/onboarding/QuizStep.tsx`](src/components/onboarding/QuizStep.tsx):
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizStepProps {
  question: any;
  value: any;
  onChange: (value: any) => void;
}

export function QuizStep({ question, value, onChange }: QuizStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.question}</CardTitle>
        {question.description && (
          <CardDescription>{question.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {question.type === 'radio' && (
          <RadioGroup value={value} onValueChange={onChange}>
            {question.options.map((option: string) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={option} />
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {question.type === 'number' && (
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="0"
            />
            {question.unit && <span className="text-sm text-gray-500">{question.unit}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

#### Step 3: Create Carbon Score Calculation

Create [`src/lib/services/carbon-calculator.ts`](src/lib/services/carbon-calculator.ts):
```typescript
export function calculateBaselineScore(responses: Record<string, any>): number {
  let totalEmissions = 0;

  // Transport calculations
  if (responses.car_ownership === 'Yes') {
    const weeklyKm = parseFloat(responses.weekly_km) || 0;
    const yearlyKm = weeklyKm * 52;
    
    const carFactors: Record<string, number> = {
      'Petrol': 0.192,
      'Diesel': 0.171,
      'Electric': 0.053,
      'Hybrid': 0.120,
    };
    
    const factor = carFactors[responses.car_type] || 0.192;
    totalEmissions += yearlyKm * factor;
  }

  // Public transport
  const publicTransportFactors: Record<string, number> = {
    'Daily': 2000,
    'Weekly': 800,
    'Monthly': 200,
    'Rarely': 50,
    'Never': 0,
  };
  totalEmissions += publicTransportFactors[responses.public_transport] || 0;

  // Flights
  const flightsPerYear = parseFloat(responses.flights_per_year) || 0;
  totalEmissions += flightsPerYear * 1000; // Average 1000 kg per flight

  // Food calculations
  const dietFactors: Record<string, number> = {
    'Meat daily': 2500,
    'Meat weekly': 1500,
    'Vegetarian': 1000,
    'Vegan': 800,
  };
  totalEmissions += dietFactors[responses.diet_type] || 1500;

  // Energy calculations
  const homeSizeFactors: Record<string, number> = {
    '< 50 m²': 1000,
    '50-100 m²': 2000,
    '100-150 m²': 3000,
    '> 150 m²': 4000,
  };
  totalEmissions += homeSizeFactors[responses.home_size] || 2000;

  // Shopping
  const newClothes = parseFloat(responses.new_clothes) || 0;
  totalEmissions += newClothes * 12 * 15; // 15 kg per item

  return Math.round(totalEmissions);
}
```

#### Step 4: Create Onboarding Flow

Create [`src/app/onboarding/page.tsx`](src/app/onboarding/page.tsx):
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { quizQuestions } from '@/lib/data/quiz-questions';
import { QuizStep } from '@/components/onboarding/QuizStep';
import { calculateBaselineScore } from '@/lib/services/carbon-calculator';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  const allQuestions = quizQuestions.flatMap(section => section.questions);
  const currentQuestion = allQuestions[currentStep];
  const progress = ((currentStep + 1) / allQuestions.length) * 100;

  const handleNext = () => {
    if (currentStep < allQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const baselineScore = calculateBaselineScore(responses);
    
    // Save to Firestore
    await fetch('/api/quiz/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses, baselineScore }),
    });

    router.push('/onboarding/results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <Progress value={progress} className="mb-8" />
        
        <QuizStep
          question={currentQuestion}
          value={responses[currentQuestion.id]}
          onChange={(value) => setResponses({ ...responses, [currentQuestion.id]: value })}
        />

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button onClick={handleNext}>
            {currentStep === allQuestions.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
```

**✅ Deliverable:** Complete onboarding flow with baseline carbon score

---

## 🗓️ Week 3-7: Continue Implementation

Due to length constraints, I'll provide the structure for remaining weeks. Each week follows similar detailed patterns:

### Week 3: Carbon Calculator & Activity Tracking
- Create carbon calculation service
- Build activity logging UI
- Implement activity management

### Week 4: Dashboard & Visualization
- Design dashboard layout
- Implement data visualization with Recharts
- Add goal tracking

### Week 5: Insights & Challenges
- Create insights generation algorithm
- Build challenge system
- Implement gamification

### Week 6: Community & Testing
- Build community feed
- Write comprehensive tests
- Bug fixes and optimization

### Week 7: Deployment & Launch
- Deploy to Cloud Run
- Configure monitoring
- Production launch

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)

---

**Ready to start building? Follow Week 1 steps and let's create something impactful! 🌍💚**