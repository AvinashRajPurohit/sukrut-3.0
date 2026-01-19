'use client';

import { useEffect, useState } from 'react';
import Card from './Card';

export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  color = 'blue',
  trend,
  description,
  delay = 0 
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-blue-600'
    },
    emerald: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/20',
      icon: 'text-emerald-600 dark:text-emerald-400',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    amber: {
      bg: 'bg-amber-100 dark:bg-amber-900/20',
      icon: 'text-amber-600 dark:text-amber-400',
      gradient: 'from-amber-500 to-amber-600'
    },
    purple: {
      bg: 'bg-purple-100 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-500 to-purple-600'
    },
    primary: {
      bg: 'bg-[#E39A2E]/10',
      icon: 'text-[#E39A2E]',
      gradient: 'from-[#E39A2E] to-[#d18a1f]'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;
    
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) {
      setAnimatedValue(value);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = numValue / steps;
    let current = 0;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setAnimatedValue(numValue);
        clearInterval(interval);
      } else {
        setAnimatedValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value, isVisible]);

  return (
    <Card 
      className={`
        group relative overflow-hidden
        transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-${color}-500/10 dark:hover:shadow-${color}-500/20
        hover:-translate-y-1
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}
    >
      {/* Gradient overlay on hover */}
      <div className={`
        absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 
        group-hover:opacity-5 dark:group-hover:opacity-10
        transition-opacity duration-300
      `} />
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 transition-all duration-300">
              {typeof value === 'string' && isNaN(parseFloat(value)) ? value : animatedValue}
            </p>
            {trend && (
              <span className={`text-xs font-medium ${
                trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
              {description}
            </p>
          )}
        </div>
        <div className={`
          p-4 rounded-xl ${colors.bg}
          transition-all duration-300
          group-hover:scale-110 group-hover:rotate-3
        `}>
          <Icon className={`w-7 h-7 ${colors.icon} transition-transform duration-300 group-hover:scale-110`} />
        </div>
      </div>
    </Card>
  );
}
