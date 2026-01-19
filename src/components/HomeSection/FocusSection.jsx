"use client";
import focusData from "@/components/data/focus.json";
import FocusMockup from "../Mockups/FocusMockup";
import FocusPoints from "./FocusPoints";
import { useState } from "react";

export default function FocusSection() {
  const [active, setActive] = useState(focusData.items[0].id);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-[90%] px-6">
        <div className="rounded-3xl bg-[#2B2B2B] p-14 text-white grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT MOCKUP */}
          <FocusMockup active={active} />

          {/* RIGHT CONTENT */}
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