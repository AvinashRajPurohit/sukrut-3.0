"use client";

import data from "@/components/data/values.json";
import EnvelopeReviews from "./ReviewEnvelope";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function WhyClientsSection() {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [reviewsRef, reviewsVisible] = useScrollAnimation({ threshold: 0.1 });
  return (
    <section className="relative bg-white py-10 pb-12 sm:pb-16 md:pb-20 lg:pb-24 overflow-hidden">
      
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

      <div className="relative z-10 mx-auto max-w-[95%] sm:max-w-[90%] px-4 sm:px-6">

        <div 
          ref={headerRef}
          className={`text-center mb-10 sm:mb-12 md:mb-16 lg:mb-24 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          
          {/* 🔥 UPDATED PREMIUM BADGE */}
          <div className={`inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-[#FFF8F0] border border-[#FFE8CC] px-3 py-1 sm:px-4 sm:py-1.5 shadow-[0_2px_8px_-2px_rgba(227,154,46,0.15)] transition-all duration-700 ease-out hover:scale-105 cursor-default ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ transitionDelay: '100ms' }}
          >
            
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

          <h2 className={`mt-4 md:mt-6 text-2xl sm:text-3xl md:text-4xl font-semibold text-black transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '200ms' }}
          >
            {data.heading}
          </h2>
        </div>

        <div
          ref={reviewsRef}
          className={`transition-all duration-700 ease-out ${
            reviewsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <EnvelopeReviews items={data.items} />
        </div>
      </div>
    </section>
  );
}