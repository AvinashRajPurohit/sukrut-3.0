"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ProductMockup } from "./CustomMockup/ProductMockup";
import CustomMockup from "./CustomMockup/ustomMockup";
import CloudMockup from "./CustomMockup/CloudMockup";

export default function FocusMockup({ active }) {
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

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
  }, [active]);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="rounded-2xl bg-white p-6 shadow-2xl min-h-[375px]"
      >
        {active === "product" && <ProductMockup />}
        {active === "custom" && <CustomMockup />}
        {active === "cloud" && <CloudMockup />}
      </div>
    </div>
  );
}
