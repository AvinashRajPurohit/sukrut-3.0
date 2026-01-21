"use client";

import data from "@/components/data/process.json";
import ProcessTimeline from "./ProcessTimeline";
import Link from "next/link";
import { FiArrowUpRight, FiCornerDownRight } from "react-icons/fi";

export default function ProcessSection() {
  return (
    <section className="relative py-60 bg-[#FDFDFD]">

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

        {/* TOP GRID (Structure Unchanged) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-24">

          {/* LEFT */}
          <div className="relative">

            <h2 className="text-5xl font-bold text-black leading-tight tracking-tight">
              {data.heading}
              <span className="text-[#E39A2E]">.</span>
            </h2>

            {/* Decorative arrow connecting title to content */}
            <div className="absolute -bottom-12 left-2 text-gray-300 hidden lg:block">
              <FiCornerDownRight size={40} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-8 flex flex-col items-start lg:items-end text-left lg:text-right">

            {/* CTA BUTTON - Tech Pill Style */}
            <Link
              href={data.cta.href}
              className="group relative inline-flex items-center gap-2 rounded-none border border-black bg-transparent px-8 py-3 text-sm font-bold text-black transition-all hover:bg-black hover:text-white"
            >
              {data.cta.label}
              <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

              {/* Corner accents for the button */}
              <span className="absolute -top-1 -left-1 h-2 w-2 border-t-2 border-l-2 border-black transition-all group-hover:top-0 group-hover:left-0" />
              <span className="absolute -bottom-1 -right-1 h-2 w-2 border-b-2 border-r-2 border-black transition-all group-hover:bottom-0 group-hover:right-0" />
            </Link>

            <p className="text-lg text-gray-600 leading-relaxed max-w-lg font-medium border-l-2 lg:border-l-0 lg:border-r-2 border-[#E39A2E] pl-4 lg:pl-0 lg:pr-4">
              {data.description}
            </p>

          </div>

        </div>

        {/* TIMELINE SECTION */}
        <div className="py-10 bg-white/50 backdrop-blur-sm border border-gray-200 p-8 lg:p-12 relative">
          {/* Technical notches */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-black" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-black" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-black" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-black" />

          <ProcessTimeline steps={data.steps} />
        </div>

      </div>
    </section>
  );
}