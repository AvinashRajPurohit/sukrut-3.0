"use client";

import Image from "next/image";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function TeamCard({ member, active, onClick }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.to(cardRef.current, {
      rotate: active ? -5 : 0,
      scale: active ? 1.06 : 0.96,
      opacity: active ? 1 : 0.6,
      duration: 0.25,
      ease: "power2.out",
    });
  }, [active]);

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      className={`
        relative flex-shrink-0
        w-[300px]
        rounded-3xl p-6 text-left
        transition-colors
        ${active ? "bg-[#FFD89C]" : "bg-gray-100"}
      `}
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>

      {/* TEXT */}
      <h3 className="font-semibold text-black">
        {member.name}
      </h3>

      <p className="text-sm text-gray-600">
        {member.role}
      </p>

      {active && (
        <p className="mt-4 text-sm text-gray-700 leading-relaxed">
          {member.bio}
        </p>
      )}
    </button>
  );
}
