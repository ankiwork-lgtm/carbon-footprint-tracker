import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Check for auth token in cookies
  const token = req.cookies.get('auth_token')?.value
  const isLoggedIn = !!token

  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnTracking = req.nextUrl.pathname.startsWith('/tracking')
  const isOnChallenges = req.nextUrl.pathname.startsWith('/challenges')
  const isOnCommunity = req.nextUrl.pathname.startsWith('/community')
  const isOnOnboarding = req.nextUrl.pathname.startsWith('/onboarding')
  const isOnAuth = req.nextUrl.pathname.startsWith('/auth')

  // Protected routes
  const protectedRoutes = isOnDashboard || isOnTracking || isOnChallenges || isOnCommunity || isOnOnboarding

  // For now, allow access to protected routes without strict auth check
  // The client-side components will handle redirects if needed
  if (protectedRoutes && !isLoggedIn) {
    // Don't redirect, let the client-side handle it
    return NextResponse.next()
  }

  // Redirect logged-in users away from auth pages
  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

// Made with Bob
