'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

export default function TimePicker({
  label,
  value,
  onChange,
  placeholder = 'Select time',
  error,
  className = '',
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState(null); // null until calculated
  const [hours, setHours] = useState(9);
  const [minutes, setMinutes] = useState(0);
  const timePickerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(':').map(Number);
      setHours(h || 9);
      setMinutes(m || 0);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        timePickerRef.current && 
        !timePickerRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Calculate position immediately when opening
      updatePosition();
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Reset position when closing
      setPosition(null);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isOpen) {
        updatePosition();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isOpen]);

  const updatePosition = () => {
    if (timePickerRef.current) {
      const rect = timePickerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Time picker dimensions (approximate)
      const pickerWidth = 320;
      const pickerHeight = 400;
      const spacing = 4;
      
      // Calculate available space
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.right;
      const spaceLeft = rect.left;
      
      // Determine vertical placement
      let top, placement;
      if (spaceBelow >= pickerHeight + spacing || spaceBelow >= spaceAbove) {
        // Place below
        top = rect.bottom + scrollY + spacing;
        placement = 'bottom';
      } else {
        // Place above
        top = rect.top + scrollY - pickerHeight - spacing;
        placement = 'top';
      }
      
      // Ensure top doesn't go above viewport
      if (top < scrollY) {
        top = scrollY + spacing;
        placement = 'bottom';
      }
      
      // Determine horizontal placement
      let left;
      if (spaceRight >= pickerWidth) {
        // Align to left edge of input
        left = rect.left + scrollX;
      } else if (spaceLeft >= pickerWidth) {
        // Align to right edge of input
        left = rect.right + scrollX - pickerWidth;
      } else {
        // Center in viewport if input is too wide
        left = scrollX + Math.max(spacing, (viewportWidth - pickerWidth) / 2);
      }
      
      // Ensure left doesn't go outside viewport
      if (left < scrollX) {
        left = scrollX + spacing;
      }
      if (left + pickerWidth > scrollX + viewportWidth) {
        left = scrollX + viewportWidth - pickerWidth - spacing;
      }
      
      setPosition({
        top,
        left,
        width: Math.max(rect.width, pickerWidth),
        placement
      });
    }
  };

  const handleTimeChange = (newHours, newMinutes) => {
    setHours(newHours);
    setMinutes(newMinutes);
    const timeString = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    onChange(timeString);
  };

  const handleConfirm = () => {
    setIsOpen(false);
  };

  const displayValue = value
    ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    : placeholder;

  const dropdownContent = isOpen && mounted && position && (
    <div
      ref={dropdownRef}
      className={`fixed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[10000] p-6 ${
        position.placement === 'top' ? 'animate-in slide-in-from-top-2' : 'animate-in slide-in-from-bottom-2'
      }`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        minWidth: '320px',
        maxWidth: 'calc(100vw - 16px)'
      }}
    >
      <div className="flex items-center justify-center gap-6 mb-6">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">Hour</label>
          <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto custom-scrollbar px-2">
            {Array.from({ length: 24 }, (_, i) => i).map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => handleTimeChange(h, minutes)}
                className={`
                  w-14 px-4 py-2.5 rounded-lg
                  transition-all duration-150 cursor-pointer
                  font-medium text-sm
                  ${hours === h
                    ? 'bg-[#E39A2E] text-white shadow-md scale-105'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105'
                  }
                `}
              >
                {String(h).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        <div className="text-2xl font-bold text-slate-400 dark:text-slate-600 py-8">:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-3 uppercase tracking-wide">Minute</label>
          <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto custom-scrollbar px-2">
            {Array.from({ length: 60 }, (_, i) => i).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => handleTimeChange(hours, m)}
                className={`
                  w-14 px-4 py-2.5 rounded-lg
                  transition-all duration-150 cursor-pointer
                  font-medium text-sm
                  ${minutes === m
                    ? 'bg-[#E39A2E] text-white shadow-md scale-105'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105'
                  }
                `}
              >
                {String(m).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer font-medium"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="flex-1 px-4 py-2.5 bg-[#E39A2E] text-white rounded-lg hover:bg-[#d18a1f] transition-colors cursor-pointer font-medium"
        >
          Confirm
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className={`w-full ${className}`} ref={timePickerRef}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={`
              w-full px-4 py-2.5 
              bg-white dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              rounded-lg 
              text-left
              flex items-center justify-between
              text-slate-900 dark:text-slate-100
              focus:outline-none focus:ring-2 focus:ring-[#E39A2E] focus:border-[#E39A2E]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
              ${isOpen ? 'ring-2 ring-[#E39A2E] border-[#E39A2E]' : ''}
              hover:border-slate-300 dark:hover:border-slate-600
            `}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400 flex-shrink-0" />
              <span className={`flex-1 truncate ${value ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                {displayValue}
              </span>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 ml-2" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500 flex-shrink-0 ml-2" />
            )}
          </button>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
      </div>
      {mounted && createPortal(dropdownContent, document.body)}
    </>
  );
}
