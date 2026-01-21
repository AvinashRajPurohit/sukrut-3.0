"use client";

import { useState } from "react";
import Image from "next/image";
import workflowTabs from "@/components/data/workflowTabs.json";

export default function WorkflowSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-[#F7F4EF] py-20">
      <div className="mx-auto max-w-[90%]">
        {/* BADGE */}
        <div className="mb-4 flex justify-center">
          <span className="rounded-full border border-[#E39A2E]/40 px-4 py-2 text-xs font-medium text-[#E39A2E]">
           ⚡  Our Workflow
          </span>
        </div>

        {/* HEADING */}
        <h2 className="mb-20 text-center text-4xl font-semibold text-black">
          How We Go Beyond High-Performance Websites
        </h2>

        {/* HORIZONTAL ACCORDION */}
        <div className="flex h-[600px] gap-4">
          {workflowTabs.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={`relative cursor-pointer overflow-hidden rounded-3xl transition-all duration-500 ease-in-out
                  ${isActive ? "flex-[5]" : "flex-[1] bg-[#ECECEC]"}
                `}
              >
                {/* COLLAPSED */}
                {!isActive && (
                  <div className="flex h-full items-center justify-center">
                    <span
                      className="text-xs font-semibold tracking-widest text-gray-700"
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)"
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                )}

                {/* EXPANDED */}
                {isActive && (
                  <>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-black/30" />

                    <div className="relative z-10 flex h-full flex-col justify-end p-8 text-white">
                      <div className="mb-4">
                        <p className="text-5xl font-semibold">
                          {item.metric}
                        </p>
                        <p className="text-lg text-gray-200">
                          {item.metricLabel}
                        </p>
                      </div>

                      <p className="max-w-lg text-md leading-relaxed text-gray-200">
                        {item.description}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
