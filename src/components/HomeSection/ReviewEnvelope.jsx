"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ReviewCard from "./ReviewCard";

export default function EnvelopeReviews({ items }) {
  const containerRef = useRef(null);
  const innerTrackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (innerTrackRef.current) {
        gsap.to(innerTrackRef.current, {
          x: '-50%',
          duration: 30,
          repeat: -1,
          ease: 'none',
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[272px] h-[272px] sm:min-h-[308px] sm:h-[308px] md:min-h-[360px] md:h-[360px] lg:min-h-[380px] lg:h-[380px] flex justify-center items-center"
    >
      <div className="absolute top-0 left-0 w-full overflow-x-hidden px-4 sm:px-8 md:px-12 lg:px-16 py-4 sm:py-6 md:py-10">
        <div
          ref={innerTrackRef}
          className="flex gap-4 sm:gap-8 md:gap-12 w-max"
        >
          {[...items, ...items].map((item, i) => (
            <div key={`${item.id}-${i}`} className="shrink-0">
              <ReviewCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
