'use client';

import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import NotificationBell from '@/components/admin/NotificationBell';
import { NavbarActionsProvider, useNavbarActions } from '@/components/shared/NavbarActionsContext';

const pageTitles = {
  '/app/admin': { title: 'Dashboard', subtitle: 'Overview of attendance and analytics' },
  '/app/admin/users': { title: 'Users', subtitle: 'Manage system users and their permissions' },
  '/app/admin/ips': { title: 'IP Management', subtitle: 'Manage allowed IP addresses' },
  '/app/admin/reports': { title: 'Reports', subtitle: 'View and analyze attendance reports' },
  '/app/admin/holidays': { title: 'Holidays', subtitle: 'Manage holidays and weekends' },
  '/app/admin/leaves': { title: 'Leave Requests', subtitle: 'Review and manage employee leave requests' },
  '/app/admin/blogs': { title: 'Blogs', subtitle: 'Manage blog posts and articles' },
  '/app/admin/settings': { title: 'Settings', subtitle: 'Configure attendance rules and preferences' },
};

function AdminLayoutContent({ children }) {
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || { title: 'Admin', subtitle: '' };
  const { actions } = useNavbarActions();

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 min-h-0 overflow-y-auto w-full flex flex-col min-w-0">
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-0.5 sm:mb-1 truncate">{pageInfo.title}</h1>
              {pageInfo.subtitle && (
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 hidden sm:block truncate">{pageInfo.subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <NotificationBell />
              {actions}
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

export default function AdminLayout({ children }) {
  return (
    <NavbarActionsProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </NavbarActionsProvider>
  );
}
