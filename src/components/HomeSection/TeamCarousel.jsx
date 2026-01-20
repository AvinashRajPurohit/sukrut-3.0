"use client";

import TeamCard from "./TeamCard";

export default function TeamCarousel({ members }) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-full">

        {/* X SCROLL ONLY */}
        <div
          className="
            overflow-x-scroll
            overflow-y-visible
            scrollbar-hide
          "
        >
          {/* INNER ROW */}
          <div className="flex gap-10 px-8 pt-44 pb-44 pl-20">
            {members.map((member) => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
