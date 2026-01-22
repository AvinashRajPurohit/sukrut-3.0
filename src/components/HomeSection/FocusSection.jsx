"use client";
import focusData from "@/components/data/focus.json";
import FocusMockup from "../Mockups/FocusMockup";
import FocusPoints from "./FocusPoints";
import { useState } from "react";

export default function FocusSection() {
  const [active, setActive] = useState(focusData.items[0].id);

  return (
    <section className="py-24 relative">
      
      {/* Optional: Glow behind the container for extra depth on the main page */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#E39A2E] opacity-5 blur-[150px] -z-10 rounded-full pointer-events-none" />

      <div className="mx-auto max-w-[90%] relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
        
        
        <div className="absolute inset-0 bg-[#0F0F0F]" />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,255,255,0.08),_transparent_70%)]" />

        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />

        <div className="relative z-10 px-8 py-8 lg:p-10">

          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-5 py-2 text-xs font-medium text-[#E39A2E] backdrop-blur-md shadow-lg shadow-black/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
              </span>
              {focusData.badge}
            </span>

            <h2 className="mt-8 text-4xl lg:text-5xl font-bold leading-tight text-white tracking-tight">
              {focusData.title.split("\n").map((line, i) => (
                <span key={i} className="block drop-shadow-md">
                  {line}
                </span>
              ))}
            </h2>
            
            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Experience precision and control like never before. Our platform creates a focused environment for high-performance engineering.
            </p>
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* LEFT MOCKUP - Adding a subtle glow behind it */}
            <div className="relative group">
               <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="relative z-10">
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