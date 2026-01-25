'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Users, 
  Server, 
  FileText, 
  Settings,
  Calendar,
  BookOpen
} from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import Logo from '@/components/shared/Logo';
import ProfileMenu from '@/components/shared/ProfileMenu';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/app/admin', label: 'Dashboard', icon: Home },
    { href: '/app/admin/users', label: 'Users', icon: Users },
    { href: '/app/admin/ips', label: 'IP Management', icon: Server },
    { href: '/app/admin/reports', label: 'Reports', icon: FileText },
    { href: '/app/admin/holidays', label: 'Holidays', icon: Calendar },
    { href: '/app/admin/leaves', label: 'Leave Requests', icon: FileText },
    { href: '/app/admin/blogs', label: 'Blogs', icon: BookOpen },
    { href: '/app/admin/settings', label: 'Settings', icon: Settings },
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
          // For dashboard, only match exact path. For others, match exact or child routes
          const isActive = item.href === '/app/admin' 
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
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

      <div className="shrink-0 px-4 pt-4 pb-8 lg:pb-4 border-t border-slate-200 dark:border-slate-800">
        <ProfileMenu />
      </div>
    </div>
  );
}
