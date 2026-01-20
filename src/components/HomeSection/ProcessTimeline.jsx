"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProcessStep from "./ProcessStep";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessTimeline({ steps }) {
  const [activeStep, setActiveStep] = useState(steps[0].id);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 75%", // thoda late start
        once: true,
        onEnter: () => {
          steps.forEach((step, index) => {
            gsap.delayedCall(index * 0.9, () => {
              setActiveStep(step.id);
            });
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [steps]);

  return (
    <div ref={containerRef} className="relative mt-10">

      {/* LINE */}
      <div className="absolute top-2 left-0 right-0 h-px bg-gray-200" />

      {/* STEPS */}
      <div className="relative flex justify-between">
        {steps.map((step) => (
          <ProcessStep
            key={step.id}
            step={step}
            active={activeStep === step.id}
            onClick={() => setActiveStep(step.id)}
          />
        ))}
      </div>
    </div>
  );
}
