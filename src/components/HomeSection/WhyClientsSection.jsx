"use client";

import data from "@/components/data/values.json";
import EnvelopeReviews from "./ReviewEnvelope";

export default function WhyClientsSection() {
  return (
    <section className="relative bg-white py-10 pb-60 overflow-hidden">
      
      {/* === BACKGROUND GRID (Faded Edges) === */}
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
            backgroundSize: '32px 32px', // Graph paper size
          }}
        />

        <div className="absolute top-0 left-10 w-[1px] h-full bg-gray-200 hidden lg:block" />
        <div className="absolute top-0 right-10 w-[1px] h-full bg-gray-200 hidden lg:block" />
      </div>

      <div className="relative z-10 mx-auto max-w-[90%] px-6">

        <div className="text-center mb-24">
          
          {/* 🔥 UPDATED PREMIUM BADGE */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-[#FFF8F0] border border-[#FFE8CC] px-4 py-1.5 shadow-[0_2px_8px_-2px_rgba(227,154,46,0.15)] transition-transform hover:scale-105 cursor-default">
            
            {/* Animated Pulsing Dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
            </span>
            
            {/* Text */}
            <span className="text-xs font-bold tracking-widest text-[#E39A2E] ">
              {data.badge}
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-semibold text-black">
            {data.heading}
          </h2>
        </div>

        <EnvelopeReviews items={data.items} />
      </div>
    </section>
  );
}