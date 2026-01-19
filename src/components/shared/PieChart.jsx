'use client';

import { useMemo } from 'react';

export default function PieChart({ data, height = 200, fullHeight = false }) {
  const uniqueId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600">
        No data available
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600">
        No data available
      </div>
    );
  }

  let currentAngle = -90;
  // Larger radius in fullHeight mode for better visibility
  const radius = fullHeight ? 85 : 70;
  const centerX = 50;
  const centerY = 50;

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    currentAngle += angle;

    return {
      ...item,
      pathData,
      percentage: percentage.toFixed(1),
      labelAngle: startAngle + angle / 2
    };
  });

  // Increased spacing for fullHeight mode to prevent overlap
  const chartHeight = fullHeight ? height - 200 : height - 100;
  const legendHeight = fullHeight ? 200 : 100;
  const chartPadding = fullHeight ? 60 : 0;

  return (
    <div className="w-full flex flex-col items-center justify-center" style={{ height: `${height}px` }}>
      <div 
        className="relative flex items-center justify-center w-full" 
        style={{ 
          height: `${chartHeight}px`,
          paddingTop: `${chartPadding}px`,
          paddingBottom: `${chartPadding}px`
        }}
      >
        <svg 
          width="100%" 
          height="100%" 
          viewBox="0 0 100 100" 
          className="overflow-visible" 
          style={{ maxHeight: '100%', maxWidth: '100%' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={segment.pathData}
                fill={segment.color || '#E39A2E'}
                className="transition-opacity duration-300 hover:opacity-80 cursor-pointer"
                stroke="white"
                strokeWidth={fullHeight ? "3" : "2"}
              />
              <title>{`${segment.label}: ${segment.value} (${segment.percentage}%)`}</title>
            </g>
          ))}
        </svg>
      </div>
      <div 
        className={`flex flex-wrap justify-center items-center gap-6 ${fullHeight ? 'pt-8 pb-4' : 'pt-4 pb-0'}`} 
        style={{ 
          height: `${legendHeight}px`, 
          minHeight: `${legendHeight}px`,
          maxHeight: `${legendHeight}px`
        }}
      >
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`${fullHeight ? 'w-4 h-4' : 'w-3 h-3'} rounded-full flex-shrink-0`}
              style={{ backgroundColor: segment.color || '#E39A2E' }}
            />
            <span className={`${fullHeight ? 'text-lg' : 'text-sm'} text-slate-600 dark:text-slate-400 whitespace-nowrap`}>
              {segment.label}: <span className="font-semibold text-slate-900 dark:text-slate-100">{segment.value}</span>
              {fullHeight && <span className="text-slate-500 dark:text-slate-500 ml-1">({segment.percentage}%)</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
