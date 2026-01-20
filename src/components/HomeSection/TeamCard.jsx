"use client";

import Image from "next/image";
import gsap from "gsap";
import { useRef } from "react";

export default function TeamCard({ member }) {
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const onEnter = () => {
    // 🔥 kill running animations
    gsap.killTweensOf([frontRef.current, backRef.current]);

    gsap.to(frontRef.current, {
      rotate: 20,
      y: 128,
      scale: 1.04,
      duration: 0.28,
      ease: "power3.out",
      overwrite: "auto",
    });

    gsap.to(backRef.current, {
      rotate: -12,
      y: -150,
      scale: 0.98,
      duration: 0.28,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const onLeave = () => {
    // 🔥 kill running animations
    gsap.killTweensOf([frontRef.current, backRef.current]);

    gsap.to(frontRef.current, {
      rotate: 0,
      y: 0,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });

    gsap.to(backRef.current, {
      rotate: 0,
      y: 0,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative flex-shrink-0 w-[320px] h-[460px]"
    >
      {/* BACK IMAGE CARD */}
      <div
        ref={backRef}
        className="absolute inset-0 rounded-[28px] bg-gray-100 p-5"
      >
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div
  ref={frontRef}
  className="
    absolute inset-0
    rounded-[28px]
    bg-[linear-gradient(135deg,rgba(255,255,255,0.6)_0%,#FFE2B8_40%,#E39A2E_100%)]

    p-6
    flex flex-col
    pointer-events-none
  "
>
  <div className="py-5">
    <h3 className="font-semibold text-gray-800 text-xl">
      {member.name}
    </h3>
    <p className="text-sm text-gray-600">
      {member.role}
    </p>
  </div>

  <div className="flex items-center py-10">
    <p className="text-md text-gray-700 leading-relaxed">
      {member.bio}
    </p>
  </div>
</div>

    </div>
  );
}
