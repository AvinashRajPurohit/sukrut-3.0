'use client';

import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Info, Trash2, Power, XCircle } from 'lucide-react';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger', 'warning', 'info'
  icon: CustomIcon,
  loading = false,
  error = ''
}) {
  const variants = {
    danger: {
      icon: Trash2,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100 dark:bg-red-900/20',
      confirmVariant: 'danger'
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-100 dark:bg-amber-900/20',
      confirmVariant: 'danger'
    },
    info: {
      icon: Info,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20',
      confirmVariant: 'primary'
    }
  };

  const config = variants[variant] || variants.danger;
  const Icon = CustomIcon || config.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
    >
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.iconBg} mb-4`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          {title}
        </h3>
        
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          {typeof message === 'string' ? <p>{message}</p> : message}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="min-w-[100px]"
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={onConfirm}
            disabled={loading}
            loading={loading}
            className="min-w-[100px]"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
