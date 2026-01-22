"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import workflowTabs from "@/components/data/workflowTabs.json";

export default function WorkflowSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // Track if user is interacting
  const intervalRef = useRef(null);

  // Auto-Play Logic
  useEffect(() => {
    if (isHovered) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % workflowTabs.length); // Cycle through tabs
    }, 3000); 

    return () => clearInterval(intervalRef.current);
  }, [isHovered]); 

  return (
    <section className="bg-[#F7F4EF] py-20">
      <div className="mx-auto max-w-[90%]">
        
        {/* BADGE */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF8F0] border border-[#FFE8CC] px-4 py-1.5 shadow-[0_2px_8px_-2px_rgba(227,154,46,0.15)] transition-transform hover:scale-105 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-[#E39A2E] ">
              Our Workflow
            </span>
          </div>
        </div>

  <h2 className="mb-20 text-center text-5xl font-semibold text-black tracking-tight leading-[1.1]">
            Engineering For <span className="text-gray-400">Real-World Scale.</span>
          </h2>
        {/* HORIZONTAL ACCORDION */}
        <div 
          className="flex h-[600px] gap-4"
          onMouseEnter={() => setIsHovered(true)}  
          onMouseLeave={() => setIsHovered(false)} 
        >
          {workflowTabs.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={`
                  relative cursor-pointer overflow-hidden rounded-3xl 
                  transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] 
                  ${isActive ? "flex-[5]" : "flex-[1] bg-[#ECECEC]"}
                `}
              >
                {/* COLLAPSED STATE (Vertical Text) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${ // Made faster (300ms) to hide quickly
                    isActive ? "opacity-0 delay-0" : "opacity-100 delay-300" // Delay appearance when collapsing back
                  }`}
                >
                  <span
                    className="text-xs font-semibold tracking-widest text-gray-700 uppercase whitespace-nowrap"
                    style={{
                      writingMode: "vertical-rl",
                      transform: "rotate(180deg)"
                    }}
                  >
                    {item.title}
                  </span>
                </div>

                {/* EXPANDED CONTENT */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40" />

                    <div className="relative z-10 flex h-full flex-col justify-end p-10 text-white">
                      
                      {/* FIX: Added 'delay-300'. 
                         This waits for the card to expand a bit before showing text, 
                         preventing the "flicker" effect.
                      */}
                      <div 
                        className={`transition-all duration-500 ease-out delay-300 ${
                          isActive 
                            ? 'translate-y-0 opacity-100' 
                            : 'translate-y-8 opacity-0'
                        }`}
                      >
                        <div className="mb-4">
                          <p className="text-5xl font-bold mb-2 text-[#E39A2E]">
                            {item.metric}
                          </p>
                          <p className="text-lg font-medium text-gray-100 uppercase tracking-wide">
                            {item.metricLabel}
                          </p>
                        </div>

                        <p className="max-w-lg text-lg leading-relaxed text-gray-200">
                          {item.description}
                        </p>
                      </div>
                    </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}