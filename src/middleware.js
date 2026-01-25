import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /app routes
  if (pathname.startsWith('/app')) {
    // Allow public API routes (auth endpoints)
    if (pathname.startsWith('/app/api/auth/login') || pathname.startsWith('/app/api/auth/refresh')) {
      return NextResponse.next();
    }
    
    // Allow login page
    if (pathname === '/app/login') {
      return NextResponse.next();
    }

    // For API routes, let them through - they'll handle auth internally
    // This prevents middleware from interfering with API route handling
    if (pathname.startsWith('/app/api/')) {
      return NextResponse.next();
    }

    // Check for access token for non-API routes
    const accessToken = request.cookies.get('accessToken');

    // If no token and trying to access protected route, redirect to login
    if (!accessToken) {
      const loginUrl = new URL('/app/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Decode JWT payload (no verify in Edge) to get role for route protection
    let role = null;
    try {
      const parts = accessToken.value.split('.');
      if (parts.length === 3) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        role = payload.role;
      }
    } catch {
      // If decode fails, let through; API routes will enforce auth
    }

    // Redirect to correct dashboard when role doesn't match the route
    if (role) {
      if (pathname === '/app') {
        return NextResponse.redirect(new URL(role === 'admin' ? '/app/admin' : '/app/user', request.url));
      }
      if (pathname.startsWith('/app/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/app/user', request.url));
      }
      if (pathname.startsWith('/app/user') && role === 'admin') {
        return NextResponse.redirect(new URL('/app/admin', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/app/:path*',
  ],
};
