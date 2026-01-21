"use client";

import impactData from "@/components/data/impact.json";
import OrbitCircles from "../Mockups/OrbitGraphic";
import { FiCornerDownRight } from "react-icons/fi";

export default function ImpactSection() {
  return (
    <section className="relative py-32 bg-[#FDFDFD]">
      
     
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

      <div className="relative z-10 mx-auto max-w-[90%] px-6">

        <div className="text-center mx-auto mb-20">
          
          {/* PREMIUM BADGE */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF8F0] border border-[#FFE8CC] px-4 py-1.5 shadow-[0_2px_8px_-2px_rgba(227,154,46,0.15)] transition-transform hover:scale-105 cursor-default mb-6">
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

          <h2 className="text-5xl font-bold text-black leading-tight tracking-tight">
            {impactData.title}
          </h2>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200 px-12 py-20 relative">
           
           {/* Technical Notches (Corners) */}
           <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black" />
           <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-black" />
           <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-black" />
           <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black" />

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center justify-between">

            {/* LEFT CONTENT */}
            <div>
              <p className="text-3xl font-medium max-w-2xl leading-snug text-gray-800 border-l-4 border-[#E39A2E] pl-6">
                {impactData.heading.line1}
                <span className="text-gray-400 block mt-2">
                  {impactData.heading.line2}
                </span>
              </p>

              {/* STATS (Grid Layout) */}
              <div className="mt-16 grid grid-cols-2 gap-x-12 gap-y-12">
                {impactData.stats.map((stat, i) => (
                  <div key={i} className="group">
                    <div className="text-5xl font-bold text-black font-mono tracking-tighter">
                      {stat.value}
                    </div>
                    {/* Technical divider line */}
                    <div className="mt-3 mb-2 h-[2px] w-12 bg-gray-200 group-hover:w-full group-hover:bg-[#E39A2E] transition-all duration-500" />
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-full w-full mx-auto relative">
              {/* Optional Grid behind orbit for depth */}
              <div className="absolute inset-0 border border-dashed border-gray-200 rounded-full opacity-50 pointer-events-none scale-90" />
              
              {/* RIGHT VISUAL */}
              <OrbitCircles points={impactData.orbitPoints} />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}