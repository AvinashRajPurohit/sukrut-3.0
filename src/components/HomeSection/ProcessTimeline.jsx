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
      {/* LINE */}
      <div className="absolute top-2 left-0 right-0 h-px bg-gray-200" />

      {/* STEPS - horizontal scroll on mobile, spread on md+ */}
      <div className="relative flex justify-start md:justify-between overflow-x-auto pb-2 -mx-0.5 sm:-mx-1 scrollbar-hide gap-3 sm:gap-4 md:gap-0 flex-nowrap snap-x snap-mandatory">
        {steps.map((step) => (
          <div key={step.id} className="snap-center shrink-0">
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