'use client';

import { useEffect } from 'react';
import Modal from './Modal';
import { X } from 'lucide-react';

export default function ChartModal({ isOpen, onClose, title, subtitle, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
            {subtitle && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <div className="flex-1 overflow-auto px-4 pb-4">
          {children}
        </div>
      </div>
    </Modal>
  );
}
