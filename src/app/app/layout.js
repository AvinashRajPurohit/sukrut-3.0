'use client';

import './attendance.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export default function AppLayout({ children }) {
  return (
    <ThemeProvider>
      <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 ${plusJakartaSans.variable} font-sans`}>
        {children}
      </div>
    </ThemeProvider>
  );
}
