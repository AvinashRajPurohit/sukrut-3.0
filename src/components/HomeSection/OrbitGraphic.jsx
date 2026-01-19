"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function OrbitCircles() {
  const c1 = useRef(null);
  const c2 = useRef(null);
  const c3 = useRef(null);
  const c4 = useRef(null);
  const c5 = useRef(null); // 🔥 NEW INNER CIRCLE

  useEffect(() => {
    const circles = [
      c1.current,
      c2.current,
      c3.current,
      c4.current,
      c5.current,
    ];

    gsap.set(circles, {
      scale: 0,
      transformOrigin: "0% 0%", // TOP LEFT
    });

    gsap.to(circles, {
      scale: 1,
      duration: 1.8,
      ease: "power3.out",
      stagger: 0.1,
    });
  }, []);

  return (
    <div className="relative w-130 h-130 ml-32">

      {/* ================= CIRCLES (BACKGROUND LAYER) ================= */}
      <div className="absolute inset-0 z-0">

        {/* OUTERMOST */}
        <div
          ref={c1}
          className="absolute rounded-full bg-gray-100 border border-gray-200"
          style={{ width: 620, height: 620, top: 46, right: 0, transform: "rotate(-15deg)" }}
        />

        {/* SECOND */}
        <div
          ref={c2}
          className="absolute rounded-full bg-white border border-gray-200"
          style={{ width: 480, height: 480, top: 0, right: 0, transform: "rotate(-8deg)" }}
        />

        {/* THIRD */}
        <div
          ref={c3}
          className="absolute rounded-full bg-gray-100 border border-gray-200"
          style={{ width: 380, height: 380, top: -18, right: 0, transform: "rotate(-3deg)" }}
        />

        {/* FOURTH */}
        <div
          ref={c4}
          className="absolute rounded-full bg-white border border-gray-200"
          style={{ width: 280, height: 280, top: -20, right: 0, transform: "rotate(2deg)" }}
        />

        {/* 🔥 FIFTH (NEW INNER CIRCLE) */}
        <div
          ref={c5}
          className="absolute rounded-full bg-gray-100 border border-gray-200"
          style={{ width: 180, height: 180, top: -10, right: 10, transform: "rotate(6deg)" }}
        />
      </div>

      {/* ================= TEXT & DOTS (FOREGROUND LAYER) ================= */}
      <div className="absolute inset-0 z-10 pointer-events-none">

        <Label right="-45px" top="5px" text="Product Vision" />
        <Label right="60px" top="100px" text="Technical Feasibility" />
        <Label right="4px" top="250px" text="Scalability & Performance" />
        <Label right="195px" top="200px" text="Reliability & Performance" />
        <Label left="300px" bottom="66px" text="Clean code & Modern Frameworks" />
        <Label left="2px" bottom="100px" text="Deployment & Support & Growth" />

      </div>
    </div>
  );
}

/* 🔹 Reusable label component */
function Label({ text, top, left, right, bottom }) {
  return (
    <div
      className="absolute flex items-center gap-2 text-sm text-black"
      style={{ top, left, right, bottom }}
    >
      <span className="w-2.5 h-2.5 rounded-full bg-[#E39A2E]" />
      <span className="whitespace-nowrap">{text}</span>
    </div>
  );
}
