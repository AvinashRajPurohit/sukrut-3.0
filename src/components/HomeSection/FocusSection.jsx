"use client";
import focusData from "@/components/data/focus.json";
import FocusMockup from "../Mockups/FocusMockup";
import FocusPoints from "./FocusPoints";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function FocusSection() {
  const [active, setActive] = useState(focusData.items[0].id);
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [contentRef, contentVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="py-12 md:py-16 lg:py-24 relative">
      
      {/* Optional: Glow behind the container for extra depth on the main page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#E39A2E] opacity-5 blur-[150px] -z-10 rounded-full pointer-events-none" />

      <div className="mx-auto max-w-[95%] sm:max-w-[90%] relative rounded-xl md:rounded-2xl lg:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        
        
        <div className="absolute inset-0 bg-[#0F0F0F]" />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.08),_transparent_70%)]" />

        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8 lg:p-10">

          <div 
            ref={headerRef}
            className={`text-center max-w-3xl mx-auto mb-10 sm:mb-16 lg:mb-24 transition-all duration-700 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            
            <span className={`inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-5 py-2 text-xs font-medium text-[#E39A2E] backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-700 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
              </span>
              {focusData.badge}
            </span>

            <h2 className={`mt-6 md:mt-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-white tracking-tight transition-all duration-700 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '200ms' }}
            >
              {focusData.title.split("\n").map((line, i) => (
                <span 
                  key={i} 
                  className={`block drop-shadow-md transition-all duration-600 ease-out ${
                    headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  {line}
                </span>
              ))}
            </h2>
            
            <p className={`mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '500ms' }}
            >
              Experience precision and control like never before. Our platform creates a focused environment for high-performance engineering.
            </p>
          </div>

          {/* CONTENT GRID */}
          <div 
            ref={contentRef}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-24 items-center transition-all duration-700 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '300ms' }}
          >

            {/* LEFT MOCKUP - min-w-0 and overflow-hidden so content doesn't spill on mobile */}
            <div className="relative group min-w-0 overflow-hidden">
               <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 hidden lg:block" />
               <div className="relative z-10 min-w-0">
                 <FocusMockup active={active} />
               </div>
            </div>

            {/* RIGHT POINTS */}
            <div className="relative">
               {/* Vertical Line Decoration */}
               <div className="absolute left-[-40px] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent hidden lg:block" />
               
               <FocusPoints
                 data={focusData}
                 active={active}
                 onChange={setActive}
               />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}