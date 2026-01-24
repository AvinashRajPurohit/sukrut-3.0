"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProcessStep from "./ProcessStep";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessTimeline({ steps, activeStep, setActiveStep }) {
  const containerRef = useRef(null);
  const timelineRef = useRef(null); // Timeline ko track karne ke liye ref

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%",
        once: true, // Trigger sirf ek baar start hoga
        onEnter: () => {
          
          // Create a Master Timeline
          timelineRef.current = gsap.timeline({
            repeat: -1, // Infinite Loop (Chalta rahega)
            repeatDelay: 2 // Last step ke baad 2 second ka break fir restart
          });

          steps.forEach((step) => {
            // Add step to timeline
            timelineRef.current
              .call(() => setActiveStep(step.id)) // State change karo
              .to({}, { duration: 2.5 }); // 2.5 second tak wait karo next step se pehle
          });

        },
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup on unmount
  }, [steps, setActiveStep]);

  // Handle Manual Click
  const handleStepClick = (id) => {
    // Agar user click kare, toh active step set karo
    setActiveStep(id);
    
    // Optional: Agar user click kare toh loop rokna hai to ye uncomment karein:
    // if (timelineRef.current) timelineRef.current.pause();
    
    // Filhal loop chalta rahega background mein jaisa aapne manga hai
  };

  return (
    <div ref={containerRef} className="relative mt-4 sm:mt-6 md:mt-10">
      {/* MOBILE: Vertical timeline line — runs through dot centers */}
      <div
        className="absolute top-4 bottom-4 left-[7px] w-px bg-gray-200 md:hidden"
        aria-hidden
      />

      {/* DESKTOP: Horizontal line — aligned with dot centers */}
      <div
        className="absolute top-6 left-0 right-0 h-px bg-gray-200 hidden md:block"
        aria-hidden
      />

      {/* MOBILE: Vertical stack — DESKTOP: Horizontal spread with snap scroll */}
      <div className="relative flex flex-col md:flex-row justify-start md:justify-between gap-4 md:gap-0 py-2 md:pt-4 md:pb-2 md:overflow-x-auto md:scrollbar-hide md:flex-nowrap md:snap-x md:snap-mandatory md:-mx-0.5">
        {steps.map((step) => (
          <div key={step.id} className="md:snap-center md:shrink-0">
            <ProcessStep
              step={step}
              active={activeStep === step.id}
              onClick={() => handleStepClick(step.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}