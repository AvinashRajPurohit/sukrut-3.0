'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Calendar({ 
  holidays = [], 
  leaves = [], 
  onDateClick,
  selectedDate,
  weekendDays = [0, 6] 
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get first day of month to calculate offset
  const firstDayOfMonth = getDay(monthStart);
  const offset = firstDayOfMonth;

  const isHoliday = (date) => {
    return holidays.some(h => isSameDay(new Date(h.date), date));
  };

  const getLeaveForDate = (date) => {
    return leaves.find(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return date >= start && date <= end;
    });
  };

  const isWeekend = (date) => {
    return weekendDays.includes(getDay(date));
  };

  const getDateStatus = (date) => {
    if (isHoliday(date)) {
      const holiday = holidays.find(h => isSameDay(new Date(h.date), date));
      return { type: 'holiday', label: holiday.name, color: 'purple' };
    }
    
    const leave = getLeaveForDate(date);
    if (leave) {
      if (leave.status === 'approved') {
        return { 
          type: 'leave', 
          label: leave.type === 'half-day' ? 'Half Day' : 'Full Day',
          color: leave.type === 'half-day' ? 'blue' : 'red'
        };
      } else if (leave.status === 'pending') {
        return { type: 'pending', label: 'Pending', color: 'amber' };
      } else if (leave.status === 'rejected') {
        return { type: 'rejected', label: 'Rejected', color: 'gray' };
      }
    }

    if (isWeekend(date)) {
      return { type: 'weekend', label: 'Weekend', color: 'slate' };
    }

    return null;
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <button
          onClick={prevMonth}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer touch-manipulation"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400" />
        </button>
        <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-slate-100 truncate mx-1">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer touch-manipulation"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1 sm:mb-2">
        {dayNames.map((day, index) => (
          <div
            key={day}
            className={`text-center text-[10px] sm:text-sm font-semibold py-1 sm:py-2 ${
              weekendDays.includes(index)
                ? 'text-slate-400 dark:text-slate-600'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {/* Empty cells for days before month starts */}
        {Array.from({ length: offset }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {daysInMonth.map((day) => {
          const status = getDateStatus(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateClick && onDateClick(day)}
              className={`
                aspect-square rounded-lg border-2 transition-all cursor-pointer
                ${isSelected
                  ? 'border-[#E39A2E] bg-[#E39A2E]/10'
                  : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                }
                ${isToday
                  ? 'ring-2 ring-[#E39A2E] ring-offset-2'
                  : ''
                }
                ${status
                  ? status.type === 'holiday'
                    ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : status.type === 'leave' && status.color === 'red'
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : status.type === 'leave' && status.color === 'blue'
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : status.type === 'pending'
                    ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                    : status.type === 'rejected'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-500'
                    : status.type === 'weekend'
                    ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                  : isWeekend(day)
                  ? 'bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                }
              `}
              title={status ? status.label : format(day, 'MMM d, yyyy')}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-xs sm:text-sm font-medium">{format(day, 'd')}</span>
                {status && (
                  <span className="text-[10px] sm:text-xs mt-0.5 truncate w-full px-0.5 sm:px-1">
                    {status.label}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-purple-100 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 shrink-0"></div>
          <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">Holiday</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-red-100 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 shrink-0"></div>
          <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400"><span className="sm:hidden">Full</span><span className="hidden sm:inline">Full Day Leave</span></span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-blue-100 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 shrink-0"></div>
          <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400"><span className="sm:hidden">Half</span><span className="hidden sm:inline">Half Day Leave</span></span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-amber-100 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 shrink-0"></div>
          <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400">Pending</span>
        </div>
      </div>
    </div>
  );
}
