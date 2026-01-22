"use client";

import FeatureCard from "./FeatureCard";
import cards from "@/components/data/featureCards.json"; // Data imported from JSON file

export default function FeatureCardsSection() {
  return (
    <section className="py-32 bg-black text-white">
      
      {/* ===== CENTER HEADER ===== */}
      <div className="mx-auto text-center mb-24 px-6">
        
        {/* Pulsing Badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
          </span>
          <span className="text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
            Core Capabilities
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:divide-x lg:divide-gray-800 border-t border-b border-gray-800">
            {cards.map((card) => (
                <div key={card.id}>
                    <FeatureCard item={card} />
                </div>
            ))}
        </div>
      </div>

    </section>
  );
}