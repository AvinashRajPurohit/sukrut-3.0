"use client";

import { useEffect, useRef, forwardRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function OrbitCircles({ points }) {
  const containerRef = useRef(null);
  const productVisionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const originEl = productVisionRef.current;
      if (!originEl) return;

      const originRect = originEl.getBoundingClientRect();
      const originX = originRect.left + originRect.width / 2;
      const originY = originRect.top + originRect.height / 2;

      gsap.set(".orbit-animate", {
        opacity: 0,
        scale: 0,
        x: (i, el) => {
          const r = el.getBoundingClientRect();
          return originX - (r.left + r.width / 2);
        },
        y: (i, el) => {
          const r = el.getBoundingClientRect();
          return originY - (r.top + r.height / 2);
        },
      });

      gsap.to(".orbit-animate", {
        opacity: 1,
        scale: 1,
        x: 0,
        y: 0,
        duration: 1.6,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          once: true, // 🔥 user aate hi ek baar chale
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden min-h-[360px] sm:min-h-[400px] md:min-h-[520px] lg:min-h-[700px]"
    >
      {/* Wrapper: centered (top-1/2) so orbit isn't cut top or bottom; min-height gives enough room on md/lg */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 origin-center scale-[0.5] sm:scale-[0.58] md:scale-75 lg:scale-100"
        style={{ width: 700, height: 686 }}
      >
        {/* 620x620 canvas offset so circles (top:-66, right:-50) and labels (right:-80) fit inside 700x686 */}
        <div className="absolute left-0 top-[66px] w-[620px] h-[620px]">
          {/* ================= CIRCLES ================= */}
          <div className="absolute inset-0 z-0">
            <div
              className="orbit-animate absolute rounded-full bg-gray-100 border border-gray-200"
              style={{ width: 620, height: 620, top: -66, right: -50, transform: "rotate(-15deg)" }}
            />
            <div
              className="orbit-animate absolute rounded-full bg-white border border-gray-200"
              style={{ width: 500, height: 500, top: -50, right: -30, transform: "rotate(-8deg)" }}
            />
            <div
              className="orbit-animate absolute rounded-full bg-gray-100 border border-gray-200"
              style={{ width: 400, height: 400, top: -34, right: -20, transform: "rotate(-3deg)" }}
            />
            <div
              className="orbit-animate absolute rounded-full bg-white border border-gray-200"
              style={{ width: 280, height: 280, top: -20, right: 0, transform: "rotate(2deg)" }}
            />
            <div
              className="orbit-animate absolute rounded-full bg-gray-100 border border-gray-200"
              style={{ width: 180, height: 180, top: 0, right: 10, transform: "rotate(6deg)" }}
            />
          </div>

          {/* ================= LABELS ================= */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Label
              ref={productVisionRef}
              className="orbit-animate"
              right="-80px"
              top="24px"
              text="Product Vision"
            />
            <Label className="orbit-animate" right="44px" top="100px" text="Technical Feasibility" />
            <Label className="orbit-animate" right="-40px" top="248px" text="Scalability & Performance" />
            <Label className="orbit-animate" right="200px" top="180px" text="Reliability & Performance" />
            <Label className="orbit-animate" left="300px" bottom="177px" text="Clean Code & Modern Frameworks" />
            <Label className="orbit-animate" left="66px" bottom="250px" text="Deployment, Support & Growth" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🔹 Label - responsive dot and text */
const Label = forwardRef(
  ({ text, top, left, right, bottom, className }, ref) => (
    <div
      ref={ref}
      className={`absolute flex items-center gap-1.5 sm:gap-2 text-sm md:text-base text-black shrink-0 ${className || ""}`}
      style={{ top, left, right, bottom }}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-[#E39A2E] shrink-0" />
      <span className="whitespace-nowrap">{text}</span>
    </div>
  )
);

Label.displayName = "Label";
