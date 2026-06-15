import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard')
  const isOnTracking = req.nextUrl.pathname.startsWith('/tracking')
  const isOnChallenges = req.nextUrl.pathname.startsWith('/challenges')
  const isOnCommunity = req.nextUrl.pathname.startsWith('/community')
  const isOnOnboarding = req.nextUrl.pathname.startsWith('/onboarding')
  const isOnAuth = req.nextUrl.pathname.startsWith('/auth')

  // Protected routes
  const protectedRoutes = isOnDashboard || isOnTracking || isOnChallenges || isOnCommunity || isOnOnboarding

  if (protectedRoutes && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Redirect logged-in users away from auth pages
  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

// Made with Bob
