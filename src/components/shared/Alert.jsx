'use client';

import { useState } from 'react';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function Alert({ 
  type = 'error', // 'error', 'success', 'warning', 'info'
  message,
  onDismiss,
  className = '',
  dismissible = true
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !message) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const variants = {
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-600 dark:text-red-400',
      icon: AlertCircle
    },
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-600 dark:text-emerald-400',
      icon: CheckCircle
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-600 dark:text-amber-400',
      icon: AlertTriangle
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-600 dark:text-blue-400',
      icon: Info
    }
  };

  const variant = variants[type] || variants.error;
  const Icon = variant.icon;

  return (
    <div className={`p-3 ${variant.bg} border ${variant.border} rounded-lg text-sm ${variant.text} flex items-start gap-3 ${className}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        {typeof message === 'string' ? <p>{message}</p> : message}
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
