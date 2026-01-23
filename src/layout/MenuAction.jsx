'use client';

import Link from "next/link";
import { useState } from "react";

export default function MenuAction({ data, currentPath }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <nav
      role="navigation"
      aria-label="Primary navigation"
      className="flex items-center gap-1"
    >
      {data.items.map((item, index) => {
        const isActive = currentPath === item.href || 
          (item.href !== '/' && currentPath?.startsWith(item.href));
        
        return (
          <Link
            key={item.id}
            href={item.href}
            prefetch={true}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
              group
              relative
              px-5 py-2.5
              text-sm font-semibold
              transition-all duration-300 ease-out
              rounded-xl
              ${
                isActive 
                  ? 'text-gray-900' 
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
            style={{ 
              fontFamily: 'var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif',
              letterSpacing: '0.025em'
            }}
          >
            {/* Ultra premium hover background with multi-layer gradient */}
            <span 
              className={`
                absolute inset-0 rounded-xl -z-10
                transition-all duration-300 ease-out
                ${
                  hoveredIndex === index || isActive
                    ? 'bg-gradient-to-br from-gray-50/90 via-gray-50/70 to-gray-100/60 opacity-100 scale-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]' 
                    : 'bg-transparent opacity-0 scale-95'
                }
              `}
              aria-hidden="true"
            />
            
            {/* Additional depth layer */}
            {(hoveredIndex === index || isActive) && (
              <span 
                className="absolute inset-0 rounded-xl -z-10 bg-gradient-to-br from-white/50 to-transparent opacity-60"
                aria-hidden="true"
              />
            )}
            
            {/* Active indicator - premium gradient bottom border */}
            {isActive && (
              <span 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.15)]"
                aria-hidden="true"
              />
            )}
            
            {/* Premium hover underline with animated gradient */}
            {hoveredIndex === index && !isActive && (
              <span 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full transition-all duration-300 shadow-sm"
                aria-hidden="true"
              />
            )}
            
            {/* Shimmer effect on hover */}
            {hoveredIndex === index && !isActive && (
              <span 
                className="absolute inset-0 rounded-xl -z-10 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 2s infinite'
                }}
                aria-hidden="true"
              />
            )}
            
            {/* Subtle glow on active */}
            {isActive && (
              <span 
                className="absolute inset-0 rounded-xl -z-10 bg-gray-50/30 blur-sm opacity-50"
                aria-hidden="true"
              />
            )}
            
            {/* Text with premium effects and micro-animations */}
            <span 
              className={`
                relative z-10 block transition-all duration-300
                ${
                  isActive 
                    ? 'scale-105 drop-shadow-sm' 
                    : 'group-hover:scale-105'
                }
              `}
            >
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
