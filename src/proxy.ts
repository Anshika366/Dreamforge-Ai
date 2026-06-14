import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const loggedIn = request.cookies.get('dreamforge_logged_in')?.value === 'true';
  const { pathname } = request.nextUrl;

  // Protect dashboard, upload, and world simulation routes
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/upload') || 
    pathname.startsWith('/worlds') || 
    pathname.startsWith('/world');

  if (isProtectedRoute && !loggedIn) {
    // Redirect unauthenticated user to login screen
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in, redirect away from the login page directly to dashboard
  if (pathname === '/login' && loggedIn) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Specify matcher paths to run proxy only on relevant routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/upload/:path*',
    '/worlds/:path*',
    '/world/:path*',
    '/login'
  ],
};
