'use client';

import { usePathname } from 'next/navigation';
import UserSidebar from '@/components/user/UserSidebar';
import { NavbarActionsProvider, useNavbarActions } from '@/components/shared/NavbarActionsContext';

const pageTitles = {
  '/app/user': { title: 'Dashboard', subtitle: 'Your attendance overview and quick actions' },
  '/app/user/reports': { title: 'My Reports', subtitle: 'View your attendance history and track your progress' },
  '/app/user/leaves': { title: 'Leave Requests', subtitle: 'Request and track your leave' },
};

function UserLayoutContent({ children }) {
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || { title: 'Dashboard', subtitle: '' };
  const { actions } = useNavbarActions();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <UserSidebar />
      <main className="flex-1 overflow-y-auto w-full flex flex-col">
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{pageInfo.title}</h1>
                {pageInfo.subtitle && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">{pageInfo.subtitle}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                {actions}
              </div>
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

export default function UserLayout({ children }) {
  return (
    <NavbarActionsProvider>
      <UserLayoutContent>{children}</UserLayoutContent>
    </NavbarActionsProvider>
  );
}
