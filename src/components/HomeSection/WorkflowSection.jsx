"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import workflowTabs from "@/components/data/workflowTabs.json";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function WorkflowSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false); // Track if user is interacting
  const intervalRef = useRef(null);
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [accordionRef, accordionVisible] = useScrollAnimation({ threshold: 0.1 });

  // Auto-Play Logic
  useEffect(() => {
    if (isHovered) return;

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % workflowTabs.length); // Cycle through tabs
    }, 3000); 

    return () => clearInterval(intervalRef.current);
  }, [isHovered]); 

  return (
    <section className="bg-[#F7F4EF] py-12 sm:py-12 md:py-16 lg:py-20 overflow-x-hidden">
      <div className="mx-auto max-w-[95%] sm:max-w-[90%] px-4 sm:px-6">
        {/* BADGE */}
        <div
          ref={headerRef}
          className={`mb-5 sm:mb-6 flex justify-center transition-all duration-700 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div
            className={`inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-[#FFF8F0] border border-[#FFE8CC] px-3 py-1.5 sm:px-4 sm:py-1.5 shadow-[0_2px_8px_-2px_rgba(227,154,46,0.15)] transition-all duration-700 ease-out hover:scale-105 cursor-default ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]" />
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
              Our Workflow
            </span>
          </div>
        </div>

        <h2
          className={`mb-8 sm:mb-10 md:mb-16 lg:mb-20 text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-black tracking-tight leading-tight transition-all duration-700 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          Engineering For <span className="text-gray-400">Real-World Scale.</span>
        </h2>

        <div ref={accordionRef} className="space-y-0">
         {/* MOBILE: Vertical Accordion (Desktop-like UI) */}
<div
  className={`md:hidden flex flex-col gap-3 transition-all duration-700 ease-out ${
    accordionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`}
  style={{ transitionDelay: "300ms" }}
  onTouchStart={() => setIsHovered(true)}
  onTouchEnd={() => setIsHovered(false)}
>
  {workflowTabs.map((item, index) => {
    const isActive = activeIndex === index;

    return (
      <div
        key={item.id}
        onClick={() => setActiveIndex(index)}
        className={`
          relative overflow-hidden rounded-xl cursor-pointer
          transition-[height] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isActive ? "h-[360px]" : "h-[80px] bg-[#ECECEC]"}
        `}
        style={{ willChange: "height" }}
      >
        {/* COLLAPSED STATE */}
        {!isActive && (
          <div className="absolute inset-0 flex items-center px-4">
            <p className="text-xs font-semibold tracking-widest text-gray-700 uppercase">
              {item.title}
            </p>
          </div>
        )}

        {/* EXPANDED CONTENT */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            priority={index === 0}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />

          <div className="relative z-10 flex h-full flex-col justify-end p-4 text-white">
            <div
              className={`transition-all duration-500 ease-out delay-300 ${
                isActive
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }`}
            >
              <div className="mb-3">
                <p className="text-2xl font-bold text-[#E39A2E] mb-1">
                  {item.metric}
                </p>
                <p className="text-[11px] font-medium text-gray-200 uppercase tracking-wide">
                  {item.metricLabel}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-gray-200">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>


          {/* DESKTOP: Horizontal accordion — swipe/expand, auto-play */}
          <div
          className={`hidden md:flex min-w-0 h-[400px] lg:h-[500px] xl:h-[600px] gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide transition-all duration-700 ease-out ${
            accordionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {workflowTabs.map((item, index) => {
            const isActive = activeIndex === index;
            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className={`
                  relative cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl snap-center shrink-0
                  transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]
                  ${isActive ? "flex-[5] min-w-0" : "flex-[1] min-w-[56px] bg-[#ECECEC]"}
                `}
              >
                {/* COLLAPSED STATE (Vertical Text) */}
                <div
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                    isActive ? "opacity-0 delay-0" : "opacity-100 delay-300"
                  }`}
                >
                  <span
                    className="text-xs font-semibold tracking-widest text-gray-700 uppercase whitespace-nowrap"
                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                  >
                    {item.title}
                  </span>
                </div>

                {/* EXPANDED CONTENT */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/25" />
                  <div className="relative z-10 flex h-full flex-col justify-end p-6 md:p-8 lg:p-10 xl:p-10 text-white">
                    <div
                      className={`transition-all duration-500 ease-out delay-300 ${
                        isActive
                          ? "translate-y-0 opacity-100"
                          : "translate-y-8 opacity-0"
                      }`}
                    >
                      <div className="mb-4">
                        <p className="text-3xl md:text-4xl xl:text-5xl font-bold mb-2 text-[#E39A2E]">
                          {item.metric}
                        </p>
                        <p className="text-sm md:text-base xl:text-lg font-medium text-gray-100 uppercase tracking-wide">
                          {item.metricLabel}
                        </p>
                      </div>
                      <p className="max-w-lg text-base lg:text-lg leading-relaxed text-gray-200">
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
      </div>
    </section>
  );
}