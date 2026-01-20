'use client';

export default function LineChart({ data, labelKey = 'label', valueKey = 'value', color = '#E39A2E', height = 200, fullHeight = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item[valueKey] || 0));
  // Match BarChart exactly for consistent bottom spacing
  const labelHeight = fullHeight ? 50 : 35;
  const chartAreaHeight = height - labelHeight; // Same as BarChart's chartAreaHeight
  const padding = fullHeight ? 20 : 10;
  
  // Fit all data within card - up to 31 days for month view
  const shouldScroll = data.length > 31;
  const totalWidth = shouldScroll ? data.length * 40 : 100;
  const pointSpacing = shouldScroll ? (totalWidth / (data.length - 1 || 1)) : (100 / (data.length - 1 || 1));

  const points = data.map((item, index) => {
    const value = item[valueKey] || 0;
    const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
    const x = index * pointSpacing;
    const y = 100 - percentage;
    return {
      x,
      y,
      value,
      label: item[labelKey]
    };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath = `${pathData} L ${shouldScroll ? totalWidth : 100} 100 L 0 100 Z`;
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className="w-full overflow-x-auto" style={{ height: `${height}px` }}>
      <div className="relative" style={{ 
        height: `${chartAreaHeight}px`, 
        padding: `${padding}px`, 
        minWidth: shouldScroll ? `${totalWidth}px` : '100%'
      }}>
        <svg width="100%" height="100%" className="overflow-visible" viewBox={`0 0 ${shouldScroll ? totalWidth : 100} 100`} preserveAspectRatio="none" style={{ minWidth: '100%' }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={areaPath}
            fill={`url(#${gradientId})`}
            className="transition-opacity duration-300"
          />
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={fullHeight ? "1" : "0.5"}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-opacity duration-300"
          />
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r={fullHeight ? "2" : "1.5"}
                fill={color}
                className="transition-all duration-300 hover:r-3 cursor-pointer"
              />
              <title>{`${point.label}: ${point.value}`}</title>
            </g>
          ))}
        </svg>
      </div>
      <div className={`flex ${shouldScroll ? 'justify-start' : 'justify-between'} mt-1 text-[10px] px-1 leading-tight`} style={{ minWidth: shouldScroll ? `${totalWidth}px` : '100%' }}>
        {data.map((item, index) => {
          const value = item[valueKey] || 0;
          return (
            <span 
              key={index} 
              className="truncate text-center text-slate-600 dark:text-slate-400"
              style={{ width: shouldScroll ? '40px' : `${100 / data.length}%` }}
            >
              {item[labelKey]}
            </span>
          );
        })}
      </div>
    </div>
  );
}
