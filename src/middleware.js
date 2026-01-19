import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /app routes
  if (pathname.startsWith('/app')) {
    // Allow API routes and login page
    if (pathname.startsWith('/app/api/auth/login') || pathname === '/app/login') {
      return NextResponse.next();
    }

    // Check for access token
    const accessToken = request.cookies.get('accessToken');
    
    // If no token and trying to access protected route, redirect to login
    if (!accessToken && !pathname.startsWith('/app/api/auth/')) {
      const loginUrl = new URL('/app/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/app/:path*',
  ],
};
