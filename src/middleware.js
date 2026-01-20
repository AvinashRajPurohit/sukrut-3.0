import { NextResponse } from 'next/server';
import { hasPassedLogoutTime } from '@/lib/utils/timezone';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect /app routes
  if (pathname.startsWith('/app')) {
    // Allow API routes and login page
    if (pathname.startsWith('/app/api/auth/login') || pathname.startsWith('/app/api/auth/refresh')) {
      return NextResponse.next();
    }
    
    if (pathname === '/app/login') {
      return NextResponse.next();
    }

    // Check if daily logout time has passed (using UTC)
    const logoutTime = process.env.DAILY_LOGOUT_TIME || '12:00';
    if (hasPassedLogoutTime(logoutTime, 'UTC')) {
      // Clear cookies and redirect to login
      const response = NextResponse.redirect(new URL('/app/login', request.url));
      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');
      return response;
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
