"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReviewCard from "./ReviewCard";

gsap.registerPlugin(ScrollTrigger);

export default function EnvelopeReviews({ items }) {
  const containerRef = useRef(null);
  const envelopeRef = useRef(null);
  const popupRef = useRef(null);
  const rowRef = useRef(null);

  const latest = items[0];
  const rest = items.slice(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 90%",
          once: true,
        },
      });

     gsap.set(popupRef.current, {
  y: 420,      // ✅ fully hidden inside mask
  scale: 0.96,
  opacity: 1,
});

      gsap.set(envelopeRef.current, {
        opacity: 1,
        scale: 1,
      });

      gsap.set(rowRef.current.children, {
        opacity: 0,
        y: 20,
      });

      // 1️⃣ CARD POPS OUT (MASKED)
      tl.to(popupRef.current, {
  y: 80,      // ✅ comes cleanly out
  scale: 1,
  duration: 0.9,
  ease: "power3.out",
})

        // 2️⃣ HOLD FOR READING
        .to({}, { duration: 2 })

        // 3️⃣ ENVELOPE DISAPPEARS
        .to(envelopeRef.current, {
          opacity: 0,
          scale: 0.96,
          duration: 0.4,
          ease: "power2.inOut",
        })

        // 4️⃣ POPUP CARD GOES AWAY
        .to(
          popupRef.current,
          {
            opacity: 0,
            scale: 0.95,
            duration: 0.4,
            ease: "power2.inOut",
          },
          "<"
        )

        // 5️⃣ ALL REVIEWS APPEAR (CLEAN ROW, NO OVERLAP)
        .to(
          rowRef.current.children,
          {
            opacity: 1,
            y: 0,
            stagger: 0.12,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.1"
        )

        .to(containerRef.current, {
  height: 360,
  duration: 0.6,
  ease: "power2.inOut",
  onComplete: () => ScrollTrigger.refresh(),
});
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[600px] flex justify-center items-center"
    >
      {/* 📨 BIG HERO ENVELOPE */}
      <div
        ref={envelopeRef}
        className="absolute w-[800px] h-[420px] pointer-events-none" 
        style={{ bottom: 140 }}
      >
        {/* envelope back */}
        <div className="absolute inset-0 rounded-[48px] bg-white shadow-2xl" />

        {/* inner purple */}
        <div className="absolute inset-x-20 inset-y-16 bg-[#E39A2E] rounded-[32px]" />

        {/* left flap */}
        <div className="absolute left-0 bottom-0 w-1/2 h-[75%] bg-white rotate-[-14deg] origin-bottom-right" />

        {/* right flap */}
        <div className="absolute right-0 bottom-0 w-1/2 h-[75%] bg-white rotate-[14deg] origin-bottom-left" />
      </div>

     {/* 📄 MASKED POP-UP CARD (FIXED – NO OVERLAP) */}
<div
  className="absolute z-20 overflow-hidden"
  style={{
    width: 560,
    height: 460,   // ✅ >= card height
    bottom: 180,   // aligns with envelope
  }}
>
  <div ref={popupRef}>
    <ReviewCard item={latest} />
  </div>
</div>


<div
  ref={rowRef}
  className="
    absolute top-0
    w-full
    px-16 py-10
    flex gap-12
    overflow-x-auto
    overflow-y-hidden
    scrollbar-hide
    
  "
>
  {[latest, ...rest].map((item) => (
    <div key={item.id} className="flex-shrink-0">
      <ReviewCard item={item} />
    </div>
  ))}
</div>

    </div>
  );
}
