"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReviewCard from "./ReviewCard";

gsap.registerPlugin(ScrollTrigger);

export default function EnvelopeReviews({ items }) {
  const ref = useRef(null);

  const latest = items[0];
  const rest = items.slice(1, 4);

useEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: "top 70%",
        once: true,
      },
    });

    // Initial states
    gsap.set(".card-main", {
      y: 0,          // ❗ no vertical offset
      x: 0,
      scale: 0.95,
      opacity: 1,
    });

    gsap.set(".flap-left", { rotate: 0, transformOrigin: "100% 100%" });
    gsap.set(".flap-right", { rotate: 0, transformOrigin: "0% 100%" });

    gsap.set(".stack-card", {
      opacity: 0,
      x: 0,
      y: 0,
      scale: 0.96,
    });

    // ✉️ OPEN ENVELOPE
    tl.to(".flap-left", {
      rotate: -45,
      duration: 0.6,
      ease: "power2.out",
    })
      .to(
        ".flap-right",
        {
          rotate: 45,
          duration: 0.6,
          ease: "power2.out",
        },
        "<"
      )

      // 📤 CARD COMES OUT (CENTER, NO UP SLIDE)
      .to(".card-main", {
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      })

      // ⏳ HOLD
      .to({}, { duration: 1.8 })

      // 🔁 MERGE INTO HORIZONTAL STACK
      .to(".card-main", {
        x: -60,
        rotate: -6,
        scale: 0.95,
        opacity: 0.4,
        duration: 0.7,
        ease: "power3.out",
      })
      .to(
        ".stack-card",
        {
          opacity: 1,
          stagger: 0.15,
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      );
  }, ref);

  return () => ctx.revert();
}, []);


  return (
    <div
      ref={ref}
      className="relative h-[520px] flex justify-center items-center"
    >
      {/* ENVELOPE */}
      <div className="absolute bottom-24 w-[360px] h-[220px]">
        <div className="flap-left absolute left-0 bottom-0 w-1/2 h-full bg-white rotate-0 clip-path-envelope-left" />
        <div className="flap-right absolute right-0 bottom-0 w-1/2 h-full bg-white rotate-0 clip-path-envelope-right" />
      </div>

      {/* MAIN CARD */}
      <ReviewCard
        item={latest}
        className="card-main z-20"
      />

      {/* STACK */}
      {rest.map((item, i) => (
        <ReviewCard
          key={item.id}
          item={item}
          className="stack-card z-10"
          style={{
            transform: `translateX(${i * 40}px) translateY(${i * 18}px) rotate(${i % 2 ? 6 : -6}deg)`,
          }}
        />
      ))}
    </div>
  );
}
