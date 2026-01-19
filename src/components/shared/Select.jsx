'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  className = '',
  icon: Icon,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        selectRef.current && 
        !selectRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      updatePosition();
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
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  const dropdownContent = isOpen && mounted && (
    <div
      ref={dropdownRef}
      className="fixed bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-[10000]"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        maxHeight: '240px'
      }}
    >
      <div className="py-1 overflow-y-auto max-h-60">
        {options.length === 0 ? (
          <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
            No options available
          </div>
        ) : (
          options.map((option, index) => {
            const OptionIcon = option.icon;
            const isSelected = value === option.value;
            
            return (
              <button
                key={option.value || index}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  w-full px-4 py-2.5 
                  flex items-center gap-3
                  text-left
                  transition-colors duration-150
                  cursor-pointer
                  ${isSelected
                    ? 'bg-[#E39A2E]/10 text-[#E39A2E] dark:bg-[#E39A2E]/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }
                `}
              >
                {OptionIcon && (
                  <OptionIcon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-[#E39A2E]' : 'text-slate-500 dark:text-slate-400'}`} />
                )}
                <span className="flex-1">{option.label}</span>
                {isSelected && (
                  <svg className="w-5 h-5 text-[#E39A2E] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={`w-full ${className}`} ref={selectRef}>
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
              {selectedOption?.icon && (
                <div className="flex-shrink-0">
                  <selectedOption.icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
              )}
              {Icon && !selectedOption?.icon && (
                <div className="flex-shrink-0">
                  <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
              )}
              <span className={`flex-1 truncate ${selectedOption ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                {selectedOption ? selectedOption.label : placeholder}
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
