"use client";

import {
  FiBox,
  FiCode,
  FiCloud,
} from "react-icons/fi";

const ICON_MAP = {
  product: FiBox,
  code: FiCode,
  cloud: FiCloud,
};

export default function FocusPoints({ data, active, onChange }) {
  return (
    <div className="space-y-6 ">
      {data.items.map((item) => {
        const isActive = active === item.id;
        const Icon = ICON_MAP[item.icon];

        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`
              group relative w-full text-left px-4 py-5 sm:px-6 sm:py-8 
              transition-all duration-500 ease-out cursor-pointer
              ${isActive
                ? "bg-[#3A3225] border border-[#E39A2E] shadow-lg shadow-[#E39A2E]/20"
                : "bg-black/30 border border-transparent hover:bg-black/40 hover:border-white/10"}
            `}
          >
            {/* 🔥 ACTIVE LEFT LINE with smooth transition */}
            <span 
              className={`
                absolute left-0 top-0 h-full w-1 bg-[#E39A2E] 
                transition-all duration-500 ease-out
                ${isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'}
              `}
            />

            {/* Background glow effect for active state */}
            <div 
              className={`
                absolute inset-0 rounded-lg bg-gradient-to-r from-[#E39A2E]/5 to-transparent
                transition-opacity duration-500 ease-out
                ${isActive ? 'opacity-100' : 'opacity-0'}
              `}
            />

            <div className="relative flex items-center gap-4">
              {/* ICON with smooth transitions */}
              <div
                className={`
                  flex h-12 w-12 items-center justify-center rounded-md
                  transition-all duration-500 ease-out
                  ${isActive 
                    ? "bg-[#E39A2E]/20 text-[#E39A2E] scale-110 shadow-md shadow-[#E39A2E]/20" 
                    : "bg-white/10 text-gray-300 group-hover:bg-white/15 group-hover:scale-105"}
                `}
              >
                <Icon 
                  size={22} 
                  className="transition-transform duration-500 ease-out"
                  style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
                />
              </div>

              {/* TEXT with smooth transitions */}
              <div className="flex-1">
                <h3 
                  className={`
                    font-medium text-base sm:text-lg transition-all duration-500 ease-out
                    ${isActive 
                      ? "text-white" 
                      : "text-gray-300 group-hover:text-white"}
                  `}
                >
                  {item.title}
                </h3>
                <p 
                  className={`
                    text-xs sm:text-sm mt-1 leading-relaxed transition-all duration-500 ease-out
                    ${isActive 
                      ? "text-gray-300" 
                      : "text-gray-400 group-hover:text-gray-300"}
                  `}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
