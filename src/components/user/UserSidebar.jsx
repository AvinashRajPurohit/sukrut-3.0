'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, FileText, Calendar, X } from 'lucide-react';
import ThemeToggle from '@/components/shared/ThemeToggle';
import Logo from '@/components/shared/Logo';
import ProfileMenu from '@/components/shared/ProfileMenu';

export default function UserSidebar({ mobileOpen = false, onMobileClose }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/app/user', label: 'Dashboard', icon: Home },
    { href: '/app/user/reports', label: 'My Reports', icon: FileText },
    { href: '/app/user/leaves', label: 'Leave Requests', icon: Calendar },
  ];

  const sidebarContent = (
    <>
      <div className="shrink-0 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between py-4 lg:py-6">
        <Logo width={120} height={34} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
        </div>
      </div>
      
      <nav className="flex-1 min-h-0 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`
                flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer
                ${isActive 
                  ? 'bg-[#E39A2E]/10 text-[#E39A2E] font-medium' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="shrink-0 px-4 pt-4 pb-8 lg:pb-4 border-t border-slate-200 dark:border-slate-800">
        <ProfileMenu />
      </div>
    </>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {onMobileClose && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}
      {/* Sidebar: fixed drawer on mobile, static on lg+ */}
      <div
        className={`
          sidebar-drawer-h fixed lg:static inset-y-0 left-0 z-50 w-64 max-w-[85vw] lg:max-w-none
          bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          lg:h-full flex flex-col
          transform transition-transform duration-300 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
      >
        {sidebarContent}
      </div>
    </>
  );
}
