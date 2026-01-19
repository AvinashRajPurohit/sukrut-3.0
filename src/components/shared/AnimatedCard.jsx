'use client';

import { useEffect, useState } from 'react';

export default function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  padding = 'md',
  ...props 
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div
      className={`
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        rounded-xl
        shadow-sm
        transition-all duration-500 ease-out
        ${paddings[padding]}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50
        hover:-translate-y-0.5
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
