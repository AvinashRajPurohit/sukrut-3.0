"use client";
import focusData from "@/components/data/focus.json";
import FocusMockup from "../Mockups/FocusMockup";
import FocusPoints from "./FocusPoints";
import { useState } from "react";

export default function FocusSection() {
  const [active, setActive] = useState(focusData.items[0].id);

  return (
    <section className="py-44">
      <div className="mx-auto max-w-[90%] rounded-3xl bg-[#2B2B2B]  p-14">

        {/* 🔥 CENTER HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2.5 text-xs text-white">
            ⚡ {focusData.badge}
          </span>

          <h2 className="mt-6 text-3xl lg:text-4xl font-semibold leading-snug text-white">
            {focusData.title.split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h2>
        </div>

        {/* 🔥 CONTENT GRID */}
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-10">

          {/* LEFT MOCKUP */}
          <FocusMockup active={active} />

          {/* RIGHT POINTS */}
          <FocusPoints
            data={focusData}
            active={active}
            onChange={setActive}
          />

        </div>
      </div>
    </section>
  );
}