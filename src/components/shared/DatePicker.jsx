'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { format, parse, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, startOfWeek, endOfWeek } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

export default function DatePicker({
  label,
  value,
  onChange,
  placeholder = 'Select a date',
  error,
  className = '',
  disabled = false,
  minDate,
  maxDate
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState(null); // null until calculated
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : null;
  const minDateObj = minDate ? parse(minDate, 'yyyy-MM-dd', new Date()) : null;
  const maxDateObj = maxDate ? parse(maxDate, 'yyyy-MM-dd', new Date()) : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setCurrentMonth(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current && 
        !datePickerRef.current.contains(event.target) &&
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
    if (datePickerRef.current) {
      const rect = datePickerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;
      
      // Calendar dimensions (approximate)
      const calendarWidth = 320;
      const calendarHeight = 400;
      const spacing = 4;
      
      // Calculate available space
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.right;
      const spaceLeft = rect.left;
      
      // Determine vertical placement
      let top, placement;
      if (spaceBelow >= calendarHeight + spacing || spaceBelow >= spaceAbove) {
        // Place below
        top = rect.bottom + scrollY + spacing;
        placement = 'bottom';
      } else {
        // Place above
        top = rect.top + scrollY - calendarHeight - spacing;
        placement = 'top';
      }
      
      // Ensure top doesn't go above viewport
      if (top < scrollY) {
        top = scrollY + spacing;
        placement = 'bottom';
      }
      
      // Determine horizontal placement
      let left;
      if (spaceRight >= calendarWidth) {
        // Align to left edge of input
        left = rect.left + scrollX;
      } else if (spaceLeft >= calendarWidth) {
        // Align to right edge of input
        left = rect.right + scrollX - calendarWidth;
      } else {
        // Center in viewport if input is too wide
        left = scrollX + Math.max(spacing, (viewportWidth - calendarWidth) / 2);
      }
      
      // Ensure left doesn't go outside viewport
      if (left < scrollX) {
        left = scrollX + spacing;
      }
      if (left + calendarWidth > scrollX + viewportWidth) {
        left = scrollX + viewportWidth - calendarWidth - spacing;
      }
      
      setPosition({
        top,
        left,
        width: Math.max(rect.width, calendarWidth),
        placement
      });
    }
  };

  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    onChange(format(date, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const isDateDisabled = (date) => {
    if (disabled) return true;
    if (minDateObj && date < minDateObj) return true;
    if (maxDateObj && date > maxDateObj) return true;
    return false;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    if (!isDateDisabled(today)) {
      handleDateSelect(today);
    }
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const displayValue = selectedDate && !isNaN(selectedDate.getTime()) 
    ? format(selectedDate, 'MMM dd, yyyy') 
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 min-w-[140px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            type="button"
            onClick={goToNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <button
          type="button"
          onClick={goToToday}
          className="px-3 py-1.5 text-sm font-medium text-[#E39A2E] hover:bg-[#E39A2E]/10 dark:hover:bg-[#E39A2E]/20 rounded-lg transition-colors cursor-pointer"
        >
          Today
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, dayIdx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const isDisabled = isDateDisabled(day);

          return (
            <button
              key={dayIdx}
              type="button"
              onClick={() => handleDateSelect(day)}
              disabled={isDisabled}
              className={`
                aspect-square p-0 text-sm font-medium rounded-lg transition-all duration-150 cursor-pointer
                ${!isCurrentMonth 
                  ? 'text-slate-300 dark:text-slate-600' 
                  : isSelected
                    ? 'bg-[#E39A2E] text-white hover:bg-[#d18a1f] shadow-md scale-105'
                    : isToday
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-semibold hover:bg-slate-200 dark:hover:bg-slate-600'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }
                ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className={`w-full ${className}`} ref={datePickerRef}>
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
              cursor-pointer
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
              ${isOpen ? 'ring-2 ring-[#E39A2E] border-[#E39A2E]' : ''}
              hover:border-slate-300 dark:hover:border-slate-600
            `}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400 shrink-0" />
              <span className={`flex-1 truncate ${selectedDate ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                {displayValue}
              </span>
            </div>
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 ml-2" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 ml-2" />
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
