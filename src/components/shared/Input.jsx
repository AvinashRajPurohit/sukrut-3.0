'use client';

export default function Input({
  label,
  error,
  className = '',
  as = 'input',
  ...props
}) {
  const baseStyles = `
    w-full px-4 py-2.5 
    bg-white dark:bg-slate-800
    border border-slate-200 dark:border-slate-700
    rounded-lg 
    text-slate-900 dark:text-slate-100
    placeholder-slate-400 dark:placeholder-slate-500
    focus:outline-none focus:ring-2 focus:ring-[#E39A2E] focus:border-[#E39A2E]
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
    ${className}
  `;

  const Component = as;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <Component
        className={baseStyles.trim()}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
