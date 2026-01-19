"use client";

import { useState, useRef, useEffect } from "react";
import TeamCard from "./TeamCard";

export default function TeamCarousel({ members }) {
  const [activeId, setActiveId] = useState(null);
  const outerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (outerRef.current && !outerRef.current.contains(e.target)) {
        setActiveId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="py-24">
     

      {/* VIEWPORT */}
      <div
        ref={outerRef}
        className="mx-auto max-w-[90%] overflow-hidden"
      >
        {/* SCROLL ROW */}
        <div className="flex gap-10 space-y-10 overflow-x-auto no-scrollbar px-4">
          {members.map((member) => (
            <TeamCard
              key={member.id}
              member={member}
              active={activeId === member.id}
              onClick={() => setActiveId(member.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
