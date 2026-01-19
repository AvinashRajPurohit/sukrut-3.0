"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { FiArrowUpRight } from "react-icons/fi";



export default function MenuAction({ data }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuRef.current) return;

    if (open) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
        }
      );
    } else {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  }, [open]);

  return (
    <div className="relative z-10">
      {/* Menu Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex items-center gap-2 text-sm font-medium cursor-pointer"
      >
        <span className="inline-flex flex-col gap-0.75 ">
          <span className="w-10 h-0.5 bg-black"></span>
          <span className="w-7.5 h-0.5 bg-black"></span>
          <span className="w-5 h-0.5 bg-black"></span>
        </span>
        <div className="text-black hover:text-[#E39A2E]">
        {data.label}
        </div>
      </button>

      {/* Menu Panel */}
   {open && (
  <nav
    ref={menuRef}
    id="mobile-menu"
    role="navigation"
    className="absolute top-full mt-5"
  >
    <ul className="flex flex-col gap-2 whitespace-nowrap">
      {data.items.map((item) => {
        const isCaseStudy = item.title === "Case Studies";

        return (
          <li key={item.id}>
            <Link
              href={item.href}
              onClick={() => setOpen(false)}
              className="
                flex items-center justify-between
                text-sm text-gray-700
                hover:text-black
                transition-colors gap-2
              "
            >
              <span>{item.title}</span>

              {/* Icon AFTER text, only for Case Studies */}
              {isCaseStudy && (
                <span className="text-gray-500">
                  <FiArrowUpRight size={14} />
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
)}


    </div>
  );
}
