"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaHandPointer } from "react-icons/fa";
import {
  FiHome,
  FiGrid,
  FiBookOpen,
  FiUploadCloud,
  FiLayers,
  FiTrendingUp,
  FiShield,
  FiCpu,
  FiServer,
  FiCheckCircle,
} from "react-icons/fi";

const PRIMARY = "#E39A2E";
const pages = ["home", "features", "docs", "live"];

export function ProductEngineeringMockup() {
  const [page, setPage] = useState(0);
  const [clicking, setClicking] = useState(false);

  const pointerRef = useRef(null);
  const navRef = useRef(null);
  const contentRef = useRef(null);

  /* AUTO PAGE CYCLE */
  useEffect(() => {
    const t = setInterval(() => {
      setClicking(true);
      setTimeout(() => {
        setPage((p) => (p + 1) % pages.length);
        setClicking(false);
      }, 180);
    }, 2600);

    return () => clearInterval(t);
  }, []);

  /* HAND POINTER ANIMATION */
  useEffect(() => {
    if (!pointerRef.current) return;

    gsap.to(pointerRef.current, {
      x: page * 112 + 16,
      scale: clicking ? 0.85 : 1,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [page, clicking]);

  /* NAV MICRO ANIMATION */
  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current.children,
      { opacity: 0.6, y: -6 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
      }
    );
  }, [page]);

  /* PAGE CONTENT ANIMATION */
  useEffect(() => {
    if (!contentRef.current) return;

    const items = contentRef.current.querySelectorAll(
      "h3, h4, p, div.rounded-xl, div.rounded-lg"
    );

    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [page]);

  return (
    <div className="w-full max-w-[960px] h-[460px] rounded-xl overflow-hidden">
      <div className="relative h-full rounded-xl bg-white border border-gray-200 flex flex-col shadow-xl overflow-hidden">

        {/* TOP BAR */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        </div>

        {/* NAVBAR */}
        <div className="relative z-20 flex items-center gap-6 px-6 py-3 border-b border-gray-200 text-xs">
          {/* LOGO */}
          <Image
            src="/sukrut_light_mode_logo.png"
            alt="Sukrut Logo"
            width={60}
            height={28}
            priority
          />

          {/* CENTER NAV */}
          <div className="flex-1 flex justify-center">
            <div
              ref={navRef}
              className="relative flex items-center justify-center gap-3"
            >
              {[
                { label: "Home", icon: FiHome },
                { label: "Features", icon: FiGrid },
                { label: "Docs", icon: FiBookOpen },
                { label: "Deploy", icon: FiUploadCloud },
              ].map((item, i) => {
                const Icon = item.icon;
                const isActive = page === i;

                return (
                  <div
                    key={item.label}
                    className="relative flex items-center gap-2 px-4 py-2 rounded-md transition-all"
                    style={{
                      backgroundColor: isActive ? "#FFF7ED" : "transparent",
                      boxShadow: isActive
                        ? "0 6px 16px rgba(227,154,46,0.25)"
                        : "none",
                      border: isActive
                        ? "1px solid rgba(227,154,46,0.35)"
                        : "1px solid transparent",
                    }}
                  >
                    <Icon
                      size={14}
                      style={{ color: isActive ? PRIMARY : "#6B7280" }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        color: isActive ? PRIMARY : "#6B7280",
                        fontWeight: isActive ? 500 : 400,
                      }}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <span
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: PRIMARY }}
                      />
                    )}
                  </div>
                );
              })}

              {/* HAND POINTER */}
              <FaHandPointer size={22} className="absolute pointer-events-none transition-all duration-500" style={{ bottom: "-28px", left: page * 112 + 16,color: PRIMARY, transform: clicking ? "scale(0.85)" : "scale(1)", zIndex: 100, }} />
            </div>
          </div>

          {/* CTA */}
          <button
            className="rounded-md px-3 py-1.5 text-[11px] font-medium"
            style={{ backgroundColor: PRIMARY, color: "#111" }}
          >
            Contact Us
          </button>
        </div>

        {/* CONTENT */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto mockup-scroll p-6 bg-[#FAFAFA]"
        >
          {/* HOME */}
          {page === 0 && (
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Engineering Software for Real-World Scale
                </h3>
                <p className="text-sm text-gray-500 max-w-lg">
                  From strategy to deployment, we build systems that scale with
                  your business.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-5">
                {[
                  { label: "Architecture", icon: FiLayers },
                  { label: "Performance", icon: FiTrendingUp },
                  { label: "Security", icon: FiShield },
                ].map((f) => {
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.label}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                    >
                      <Icon size={20} className="text-[#E39A2E]" />
                      <p className="mt-2 text-sm font-medium text-gray-800">
                        {f.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        Built for long-term scale.
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-4 gap-4">
                {["10+ Years", "50+ Projects", "98% Satisfaction", "40+ Tech"].map(
                  (s) => (
                    <div
                      key={s}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-xs text-gray-700"
                    >
                      {s}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* FEATURES */}
          {page === 1 && (
            <div className="grid grid-cols-3 gap-6">
              {[
                { label: "Design System", icon: FiCpu },
                { label: "API Layer", icon: FiServer },
                { label: "Monitoring", icon: FiTrendingUp },
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.label}
                    className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <Icon size={22} className="text-[#E39A2E]" />
                    <h4 className="mt-2 text-sm font-medium text-gray-800">
                      {f.label}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Modular, scalable, production-ready.
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* DOCS */}
          {page === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-800">
                Documentation
              </h4>
              {[
                "Getting Started",
                "Authentication",
                "Deployment Guide",
                "Scaling Strategy",
              ].map((d) => (
                <div
                  key={d}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600"
                >
                  {d}
                </div>
              ))}
            </div>
          )}

          {/* DEPLOY */}
          {page === 3 && (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
              <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs text-green-700">
                <FiCheckCircle size={14} />
                Deployment Successful
              </span>
              <p className="text-xs text-gray-500">
                Production environment is live.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
