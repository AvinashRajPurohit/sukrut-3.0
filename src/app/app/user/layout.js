'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import UserSidebar from '@/components/user/UserSidebar';
import { NavbarActionsProvider, useNavbarActions } from '@/components/shared/NavbarActionsContext';
import UserNotificationBell from '@/components/user/UserNotificationBell';

const pageTitles = {
  '/app/user': { title: 'Dashboard', subtitle: 'Your attendance overview and quick actions' },
  '/app/user/reports': { title: 'My Reports', subtitle: 'View your attendance history and track your progress' },
  '/app/user/leaves': { title: 'Leave Requests', subtitle: 'Request and track your leave' },
};

function UserLayoutContent({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageInfo = pageTitles[pathname] || { title: 'Dashboard', subtitle: '' };
  const { actions } = useNavbarActions();

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900">
      <UserSidebar mobileOpen={sidebarOpen} onMobileClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-h-0 overflow-y-auto w-full flex flex-col min-w-0">
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </button>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">{pageInfo.title}</h1>
                  {pageInfo.subtitle && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block truncate">{pageInfo.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <UserNotificationBell />
                {actions}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 p-4 sm:p-6 lg:p-8 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:pb-[max(2rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function UserLayout({ children }) {
  return (
    <NavbarActionsProvider>
      <UserLayoutContent>{children}</UserLayoutContent>
    </NavbarActionsProvider>
  );
}
