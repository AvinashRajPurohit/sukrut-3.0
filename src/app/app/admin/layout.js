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
  '/app/admin/settings': { title: 'Settings', subtitle: 'Configure attendance rules and preferences' },
};

function AdminLayoutContent({ children }) {
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || { title: 'Admin', subtitle: '' };
  const { actions } = useNavbarActions();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto w-full flex flex-col">
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="px-8 flex items-center justify-between" style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem', minHeight: 'calc(1.5rem * 2 + 2rem + 0.25rem + 1.25rem)' }}>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{pageInfo.title}</h1>
              {pageInfo.subtitle && (
                <p className="text-sm text-slate-600 dark:text-slate-400">{pageInfo.subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <NotificationBell />
              {actions}
            </div>
          </div>
        </div>
        <div className="flex-1 p-8">
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
