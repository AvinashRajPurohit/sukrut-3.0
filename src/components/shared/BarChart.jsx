'use client';

export default function BarChart({ data, labelKey = 'label', valueKey = 'value', color = '#E39A2E', height = 200, fullHeight = false }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600">
        No data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item[valueKey] || 0));
  // Fit all data within card - up to 31 days for month view
  const shouldScroll = data.length > 31;
  const barWidth = shouldScroll ? 40 : 100 / data.length;
  const labelHeight = fullHeight ? 50 : 35;
  const gap = shouldScroll ? 2 : Math.max(0.5, 100 / data.length * 0.05); // Smaller gap for more data points
  const chartAreaHeight = height - labelHeight; // Consistent chart area height

  return (
    <div className="w-full overflow-x-auto" style={{ height: `${height}px` }}>
      <div className={`relative h-full flex items-end ${shouldScroll ? 'justify-start' : 'justify-between'} px-1`} style={{ 
        minWidth: shouldScroll ? `${data.length * (barWidth + gap)}px` : '100%',
        gap: shouldScroll ? `${gap}px` : `${gap}%`
      }}>
        {data.map((item, index) => {
          const value = item[valueKey] || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          return (
            <div
              key={index}
              className={`${shouldScroll ? '' : 'flex-1'} flex flex-col items-center group`}
              style={shouldScroll ? { width: `${barWidth}px`, minWidth: `${barWidth}px` } : { maxWidth: `${barWidth}%` }}
            >
              <div className="relative w-full flex items-end justify-center" style={{ height: `${chartAreaHeight}px` }}>
                <div
                  className="w-full rounded-t transition-all duration-500 hover:opacity-80 cursor-pointer"
                  style={{
                    height: `${percentage}%`,
                    backgroundColor: color,
                    minHeight: value > 0 ? '4px' : '0'
                  }}
                  title={`${item[labelKey]}: ${value}`}
                />
              </div>
              {data.length > 14 ? (
                // Month/Custom view: Show date label (day number or MMM d) with count below
                <>
                  <div className={`mt-1 ${fullHeight ? 'text-xs' : 'text-[10px]'} text-slate-600 dark:text-slate-400 text-center truncate w-full px-0.5 leading-tight`}>
                    {item[labelKey]}
                  </div>
                  <div className={`${fullHeight ? 'text-xs' : 'text-[10px]'} font-semibold text-slate-900 dark:text-slate-100 mt-0.5 leading-tight`}>
                    {value}
                  </div>
                </>
              ) : (
                // Week/short view: Show date label with count below
                <>
                  <div className={`mt-1 ${fullHeight ? 'text-xs' : 'text-[10px]'} text-slate-600 dark:text-slate-400 text-center truncate w-full px-0.5 leading-tight`}>
                    {item[labelKey]}
                  </div>
                  {value > 0 && (
                    <div className={`${fullHeight ? 'text-xs' : 'text-[10px]'} font-semibold text-slate-900 dark:text-slate-100 mt-0.5 leading-tight`}>
                      {value}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
