'use client';

import { usePathname } from 'next/navigation';
import Header from '@/layout/Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on /app routes
  if (pathname?.startsWith('/app')) {
    return null;
  }
  
  return <Header />;
}
