'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, ChevronDown } from 'lucide-react';

export default function ProfileMenu() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/app/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setUser(data.user);
        }
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await fetch('/app/api/auth/logout', { method: 'POST' });
    router.push('/app/login');
  };

  if (!user) {
    return (
      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    );
  }

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative w-full" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E39A2E] to-[#d18a1f] flex items-center justify-center text-white font-semibold text-sm shadow-lg flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">{user.role === 'admin' ? 'Administrator' : 'User'}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">{user.email}</p>
            <span className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin' 
                ? 'bg-[#E39A2E]/10 text-[#E39A2E]' 
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {user.role === 'admin' ? 'Administrator' : 'User'}
            </span>
          </div>
          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
