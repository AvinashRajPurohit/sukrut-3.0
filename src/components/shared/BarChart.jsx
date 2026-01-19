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
  const barWidth = 100 / data.length;
  const labelHeight = fullHeight ? 60 : 40;

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="relative h-full flex items-end justify-between gap-1 px-2">
        {data.map((item, index) => {
          const value = item[valueKey] || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center group"
              style={{ maxWidth: `${barWidth}%` }}
            >
              <div className="relative w-full flex items-end justify-center" style={{ height: `${height - labelHeight}px` }}>
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
              <div className={`mt-2 ${fullHeight ? 'text-sm' : 'text-xs'} text-slate-600 dark:text-slate-400 text-center truncate w-full px-1`}>
                {item[labelKey]}
              </div>
              {value > 0 && (
                <div className={`${fullHeight ? 'text-sm' : 'text-xs'} font-semibold text-slate-900 dark:text-slate-100 mt-1`}>
                  {value}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
