'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const overlayRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    // Only close if clicking directly on the overlay, not on child elements
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen || !mounted) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  const modalContent = (
    <div 
      ref={overlayRef}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-pointer"
      onClick={handleOverlayClick}
      style={{ 
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div 
        className={`
          w-full ${size === 'full' ? 'h-[95vh]' : sizes[size]} 
          bg-white dark:bg-slate-800
          rounded-xl 
          shadow-xl
          border border-slate-200 dark:border-slate-700
          ${size === 'full' ? '' : 'max-h-[90vh]'} overflow-hidden
          flex flex-col
        `}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 10000
        }}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              type="button"
            >
              <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        )}
        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
