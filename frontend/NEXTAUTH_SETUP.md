# NextAuth Configuration Guide

## Overview
This project uses NextAuth v5 (beta) for authentication with support for:
- Credentials-based authentication (email/password)
- Google OAuth (optional)
- JWT session strategy

## Files Created

### 1. `auth.ts` (Root Level)
Main NextAuth configuration file containing:
- Provider configurations (Credentials, Google)
- Custom pages (sign-in, sign-out, error)
- JWT and session callbacks
- Authentication logic

### 2. `app/api/auth/[...nextauth]/route.ts`
API route handler for NextAuth endpoints:
- `/api/auth/signin` - Sign in page
- `/api/auth/signout` - Sign out
- `/api/auth/callback` - OAuth callbacks
- `/api/auth/session` - Get current session

### 3. `middleware.ts`
Route protection middleware:
- Protects dashboard, tracking, challenges, community, and onboarding routes
- Redirects unauthenticated users to sign-in
- Redirects authenticated users away from auth pages

### 4. `lib/auth/session.ts`
Helper functions for server-side session access:
- `getSession()` - Get current session
- `getCurrentUser()` - Get current user

## Environment Variables

Required in `.env.local`:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=x5Zl+JkLxhGbB6u2sCjKMFI2PcWO32o1sLCkzmFdbh0=

# Optional: Google OAuth
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret

# Backend API URL (for credentials authentication)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Usage Examples

### Server Components (App Router)

```typescript
import { getCurrentUser } from "@/lib/auth/session"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/auth/signin')
  }
  
  return <div>Welcome, {user.name}!</div>
}
```

### Client Components

```typescript
"use client"

import { useSession } from "next-auth/react"

export default function ProfileButton() {
  const { data: session, status } = useSession()
  
  if (status === "loading") {
    return <div>Loading...</div>
  }
  
  if (status === "unauthenticated") {
    return <a href="/auth/signin">Sign In</a>
  }
  
  return <div>Hello, {session?.user?.name}</div>
}
```

### Sign In/Out Actions

```typescript
import { signIn, signOut } from "@/auth"

// Sign in with credentials
await signIn("credentials", {
  email: "user@example.com",
  password: "password123",
  redirectTo: "/dashboard"
})

// Sign in with Google
await signIn("google", { redirectTo: "/dashboard" })

// Sign out
await signOut({ redirectTo: "/" })
```

## Backend Integration

The credentials provider calls your backend API at:
```
POST ${NEXT_PUBLIC_API_URL}/auth/login
```

Expected request body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Expected response:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "image": "https://example.com/avatar.jpg"
}
```

## Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env.local`

## Protected Routes

The following routes are automatically protected by middleware:
- `/dashboard/*`
- `/tracking/*`
- `/challenges/*`
- `/community/*`
- `/onboarding/*`

Unauthenticated users will be redirected to `/auth/signin`.

## Session Management

- **Strategy**: JWT (stored in HTTP-only cookies)
- **Session Duration**: Default 30 days
- **Auto-refresh**: Sessions refresh automatically on activity

## Security Features

- ✅ HTTP-only cookies (prevents XSS attacks)
- ✅ CSRF protection (built-in)
- ✅ Secure session tokens
- ✅ Password hashing (handled by backend)
- ✅ OAuth state validation

## Troubleshooting

### "NEXTAUTH_SECRET is not set"
Make sure `NEXTAUTH_SECRET` is set in `.env.local` and restart the dev server.

### "Invalid credentials"
Check that your backend API is running and the endpoint matches the configuration.

### "Redirect loop"
Ensure middleware matcher doesn't conflict with NextAuth routes (`/api/auth/*`).

### Session not persisting
Clear browser cookies and ensure `NEXTAUTH_URL` matches your actual URL.

## Next Steps

1. ✅ NextAuth is configured
2. ⏳ Update sign-in page to use NextAuth
3. ⏳ Update sign-up page to integrate with backend
4. ⏳ Add session provider to layout
5. ⏳ Test authentication flow