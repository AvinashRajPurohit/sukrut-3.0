"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ProductEngineeringMockup } from "./CustomMockup/ProductMockup";
import { CustomMockup } from "./CustomMockup/CustomMockup";
import { CloudMockup } from "./CustomMockup/CloudMockup";

export default function FocusMockup({ active }) {
  const contentRef = useRef(null);
  const prevActiveRef = useRef(active);

  useEffect(() => {
    if (!contentRef.current) return;

    // Only animate if active actually changed
    if (prevActiveRef.current === active) return;
    
    prevActiveRef.current = active;

    // Smooth fade out then fade in
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -12,
      scale: 0.96,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        // Fade in with smooth animation
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
          }
        );
      }
    });
  }, [active]);

  return (
    <div className="relative w-full min-w-0 max-w-full overflow-hidden">
      <div
        ref={contentRef}
        className="rounded-xl sm:rounded-2xl bg-white p-3 sm:p-4 md:p-6 shadow-2xl min-h-0 transition-all duration-500 overflow-hidden"
      >
        {active === "product" && <ProductEngineeringMockup />}
        {active === "custom" && <CustomMockup />}
        {active === "cloud" && <CloudMockup />}
      </div>
    </div>
  );
}
