"use client";

import impactData from "@/components/data/impact.json";
import OrbitCircles from "../Mockups/OrbitGraphic";
import { FiCornerDownRight } from "react-icons/fi";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ImpactSection() {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [contentRef, contentVisible] = useScrollAnimation({ threshold: 0.1 });
  const [visualRef, visualVisible] = useScrollAnimation({ threshold: 0.1 });
  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-[#FDFDFD]">
      
     
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `
              linear-gradient(#E5E7EB 1px, transparent 1px), 
              linear-gradient(90deg, #E5E7EB 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
        
        <div className="absolute top-0 left-10 w-[1px] h-full bg-gray-200 hidden lg:block" />
        <div className="absolute top-0 right-10 w-[1px] h-full bg-gray-200 hidden lg:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-[95%] sm:max-w-[90%] px-4 sm:px-6">

        <div 
          ref={headerRef}
          className={`text-center mx-auto mb-10 md:mb-16 lg:mb-20 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          
          {/* PREMIUM BADGE */}
          <div className={`inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-[#FFF8F0] border border-[#FFE8CC] px-3 py-1 sm:px-4 sm:py-1.5 shadow-[0_2px_8px_-2px_rgba(227,154,46,0.15)] transition-all duration-700 ease-out hover:scale-105 cursor-default mb-4 sm:mb-6 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: '100ms' }}
          >
            {/* Pulsing Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
            </span>
            
            {/* Text */}
            <span className="text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
              {impactData.badge}
            </span>
          </div>

          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight tracking-tight transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '200ms' }}
          >
            {impactData.title}
          </h2>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200 px-4 py-8 sm:px-8 sm:py-12 md:px-10 md:py-16 lg:px-12 lg:py-20 relative overflow-hidden">
           
           {/* Technical Notches (Corners) */}
           <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-black" />
           <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-black" />
           <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-black" />
           <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-black" />

           <div
             ref={contentRef}
             className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 items-center justify-between transition-all duration-700 ease-out ${
               contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
             }`}
             style={{ transitionDelay: '300ms' }}
           >

            {/* LEFT CONTENT */}
            <div
              className={`min-w-0 transition-all duration-700 ease-out ${
                contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium max-w-2xl leading-snug text-gray-800 border-l-4 border-[#E39A2E] pl-3 sm:pl-4 md:pl-6">
                {impactData.heading.line1}
                <span className="text-gray-400 block mt-1 sm:mt-2">
                  {impactData.heading.line2}
                </span>
              </p>

              {/* STATS (Grid Layout) */}
              <div className="mt-6 sm:mt-8 md:mt-16 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 sm:gap-y-8 md:gap-x-12 md:gap-y-12">
                {impactData.stats.map((stat, i) => (
                  <div key={i} className="group min-w-0">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold text-black font-mono tracking-tighter">
                      {stat.value}
                    </div>
                    <div className="mt-2 sm:mt-3 mb-1.5 sm:mb-2 h-[2px] w-8 sm:w-12 bg-gray-200 group-hover:w-full group-hover:bg-[#E39A2E] transition-all duration-500" />
                    <div className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* RIGHT VISUAL - Orbit graphic; min-h and min-w-0 so it doesn't overflow on mobile */}
            <div
              ref={visualRef}
              className={`min-w-0 overflow-hidden h-full w-full mx-auto relative min-h-[360px] sm:min-h-[400px] md:min-h-[520px] lg:min-h-0 transition-all duration-700 ease-out ${
                visualVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              {/* Optional Grid behind orbit for depth - hidden on small to reduce noise */}
              <div className="absolute inset-0 border border-dashed border-gray-200 rounded-full opacity-50 pointer-events-none scale-90 hidden md:block" />
              
              <OrbitCircles points={impactData.orbitPoints} />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}