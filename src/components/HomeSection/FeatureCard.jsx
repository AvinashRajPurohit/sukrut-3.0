"use client";

import { useRef } from "react";
import gsap from "gsap";
import { FiArrowUpRight } from "react-icons/fi";

export default function FeatureCard({ item }) {
   const imageRef = useRef(null);
  const textRef = useRef(null);
  const detailRef = useRef(null);
  const iconRef = useRef(null);

  const onEnter = () => {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .to(imageRef.current, { x: 40, opacity: 0, duration: 0.5 })
      .to(textRef.current, { y: -20, duration: 0.4 }, "<")
      .fromTo(detailRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.2")
      .fromTo(iconRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 }, "-=0.2");
  };

  const onLeave = () => {
    gsap.timeline()
      .to(iconRef.current, { opacity: 0, duration: 0.2 })
      .to(detailRef.current, { opacity: 0, y: 10, duration: 0.2 })
      .to(textRef.current, { y: 0, duration: 0.3 }, "<")
      .to(imageRef.current, { x: 0, opacity: 1, duration: 0.4 }, "<");
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-900 p-6 cursor-pointer"
    >
      {/* IMAGE AS DIV */}
      <div
        ref={imageRef}
        className="absolute inset-0 bg-cover bg-center opacity-90"
        style={{ backgroundImage: `url(${item.image})` }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div ref={textRef}>
          <h3 className="text-lg mt-4 font-semibold text-white">
            {item.title}
          </h3>
          <p className="mt-2 text-sm text-gray-300">
            {item.short}
          </p>

          <p
          ref={detailRef}
          className="mt-28 text-sm text-gray-400 opacity-0"
        >
          {item.details}
        </p>
        </div>

        

        {/* EXPAND ICON */}
        <div
          ref={iconRef}
          className="absolute bottom-4 right-4 opacity-0"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E39A2E] text-black">
            <FiArrowUpRight />
          </div>
        </div>
      </div>
    </div>
  );
}