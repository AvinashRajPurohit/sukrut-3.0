"use client";

import FeatureCard from "./FeatureCard";
import cards from "@/components/data/featureCards.json"; // Data imported from JSON file
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function FeatureCardsSection() {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [cardsRef, cardsVisible] = useScrollAnimation({ threshold: 0.1 });
  return (
    <section className="py-32 bg-black text-white">
      
      {/* ===== CENTER HEADER ===== */}
      <div 
        ref={headerRef}
        className={`mx-auto text-center mb-24 px-6 transition-all duration-700 ease-out ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        
        {/* Pulsing Badge */}
        <div className={`inline-flex items-center gap-2.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8 transition-all duration-700 ease-out ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
        style={{ transitionDelay: '100ms' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
          </span>
          <span className="text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
            Core Capabilities
          </span>
        </div>

        <h2 className={`text-4xl md:text-5xl font-semibold leading-tight text-white transition-all duration-700 ease-out ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
        style={{ transitionDelay: '200ms' }}
        >
          The Future of <span className="text-[#E39A2E]">System Architecture</span> Is Here
        </h2>
      </div>

      {/* ===== 3 COLUMN GRID ===== */}
      <div className="mx-auto max-w-7xl px-6">
        {/* Grid Layout: 
            - 1 Column on Mobile
            - 3 Columns on Large Screens
            - Borders between items using divide-x (Clean approach)
            - Top/Bottom borders on the container
        */}
        <div 
          ref={cardsRef}
          className={`grid grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-gray-800 border-t border-b border-gray-800 transition-all duration-700 ease-out ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
            {cards.map((card, index) => (
                <div 
                  key={card.id}
                  className={`transition-all duration-700 ease-out ${
                    cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                    <FeatureCard item={card} />
                </div>
            ))}
        </div>
      </div>

    </section>
  );
}