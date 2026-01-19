'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Home, FileText, Calendar } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import Logo from '@/components/shared/Logo';
import ProfileMenu from '@/components/shared/ProfileMenu';

export default function UserSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/app/user', label: 'Dashboard', icon: Home },
    { href: '/app/user/reports', label: 'My Reports', icon: FileText },
    { href: '/app/user/leaves', label: 'Leave Requests', icon: Calendar },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col">
      <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', minHeight: 'calc(1.5rem * 2 + 2rem + 0.25rem + 1.25rem)' }}>
        <Logo width={120} height={34} />
        <ThemeToggle />
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer
                ${isActive 
                  ? 'bg-[#E39A2E]/10 text-[#E39A2E] font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <ProfileMenu />
      </div>
    </div>
  );
}
