'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to handle automatic token refresh and daily logout countdown
 */
export function useTokenRefresh() {
  const router = useRouter();
  const refreshIntervalRef = useRef(null);
  const checkIntervalRef = useRef(null);

  useEffect(() => {
    // Refresh access token every 14 minutes (before 15 min expiry)
    refreshIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch('/app/api/auth/refresh', {
          method: 'POST',
          credentials: 'include'
        });

        if (!response.ok) {
          // If refresh fails, redirect to login
          const data = await response.json();
          if (data.error && data.error.includes('Daily session')) {
            // Daily logout time reached
            router.push('/app/login?message=Daily session expired');
          } else {
            router.push('/app/login');
          }
        }
      } catch (error) {
        console.error('Token refresh error:', error);
        router.push('/app/login');
      }
    }, 14 * 60 * 1000); // 14 minutes

    // Check for daily logout every minute
    checkIntervalRef.current = setInterval(async () => {
      try {
        // Try to access a protected endpoint to check if session is still valid
        const response = await fetch('/app/api/auth/me', {
          credentials: 'include'
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.error && data.error.includes('Daily session')) {
            router.push('/app/login?message=Daily session expired');
          }
        }
      } catch (error) {
        // Silently fail - don't interrupt user
        console.error('Session check error:', error);
      }
    }, 60 * 1000); // Every minute

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [router]);
}
