"use client";

import { useState } from "react";
import data from "@/components/data/process.json";
import ProcessTimeline from "./ProcessTimeline";
import Link from "next/link";
import { FiArrowUpRight, FiCornerDownRight } from "react-icons/fi";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function ProcessSection() {
  const [activeStepId, setActiveStepId] = useState(data.steps[0].id);
  const activeStepData = data.steps.find((s) => s.id === activeStepId);
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [timelineRef, timelineVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="relative py-12 sm:py-16 md:py-24 lg:py-36 xl:py-60 bg-[#FDFDFD] overflow-x-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage: `
              linear-gradient(#E5E7EB 1px, transparent 1px),
              linear-gradient(90deg, #E5E7EB 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-10 w-px h-full bg-gray-200 hidden lg:block" />
        <div className="absolute top-0 right-10 w-px h-full bg-gray-200 hidden lg:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-[95%] sm:max-w-[90%] px-4 sm:px-6">
        {/* TOP GRID */}
        <div
          ref={headerRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-20 items-start mb-8 sm:mb-10 md:mb-16 lg:mb-24 transition-all duration-700 ease-out ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* LEFT: Heading */}
          <div
            className={`relative transition-all duration-700 ease-out ${
              headerVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-black leading-tight tracking-tight">
              {data.heading}
              <span className="text-[#E39A2E]">.</span>
            </h2>
            <div className="absolute -bottom-10 sm:-bottom-12 left-2 text-gray-300 hidden lg:block">
              <FiCornerDownRight size={40} />
            </div>
          </div>

          {/* RIGHT: Dynamic Content & CTA */}
          <div
            className={`space-y-6 sm:space-y-8 flex flex-col items-stretch sm:items-start lg:items-end text-left lg:text-right transition-all duration-700 ease-out ${
              headerVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <Link
              href={data.cta.href}
              className="group relative inline-flex items-center justify-center sm:justify-start gap-2 rounded-none border border-black bg-transparent px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm font-bold text-black transition-all hover:bg-black hover:text-white w-full sm:w-auto"
            >
              {data.cta.label}
              <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 shrink-0" />
              <span className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-black transition-all group-hover:top-0 group-hover:left-0" />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-black transition-all group-hover:bottom-0 group-hover:right-0" />
            </Link>

            <div className="min-h-[88px] sm:min-h-[96px] md:h-[120px] w-full max-w-lg border-l-2 lg:border-l-0 lg:border-r-2 border-[#E39A2E] pl-3 sm:pl-4 lg:pl-0 lg:pr-4 flex flex-col justify-center lg:items-end">
              <p
                key={activeStepId}
                className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                {activeStepData?.detailDescription || data.description}
              </p>
            </div>
          </div>
        </div>

        {/* TIMELINE SECTION */}
        <div
          ref={timelineRef}
          className={`py-4 sm:py-6 md:py-10 bg-white/50 backdrop-blur-sm border border-gray-200 p-3 sm:p-4 md:p-6 lg:p-10 xl:p-12 relative transition-all duration-700 ease-out ${
            timelineVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          {/* Notches */}
          <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-black" />
          <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-black" />
          <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-black" />
          <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-black" />

          <ProcessTimeline
            steps={data.steps}
            activeStep={activeStepId}
            setActiveStep={setActiveStepId}
          />
        </div>
      </div>
    </section>
  );
}