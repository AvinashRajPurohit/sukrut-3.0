"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaHandPointer } from "react-icons/fa";
import {
  FiCode,
  FiLayout,
  FiServer,
  FiDatabase,
  FiLayers,
  FiCheckCircle,
  FiSettings,
} from "react-icons/fi";

const PRIMARY = "#E39A2E";
const TABS = ["Overview", "Build", "Integrations", "Delivery"];

export function CustomMockup() {
  const [step, setStep] = useState(0);
  const [clicking, setClicking] = useState(false);

  const pointerRef = useRef(null);
  const contentRef = useRef(null);
  const tabRef = useRef(null);

  /* AUTO CYCLE */
  useEffect(() => {
    const t = setInterval(() => {
      setClicking(true);
      setTimeout(() => {
        setStep((s) => (s + 1) % TABS.length);
        setClicking(false);
      }, 180);
    }, 2600);

    return () => clearInterval(t);
  }, []);

  /* POINTER – SMOOTH GSAP MOVE */
  useEffect(() => {
    if (!pointerRef.current) return;

    gsap.to(pointerRef.current, {
      x: step * 110 + 20,
      scale: clicking ? 0.85 : 1,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [step, clicking]);

  /* CONTENT TRANSITION */
  useEffect(() => {
    if (!contentRef.current) return;

    const items = contentRef.current.querySelectorAll(
      "h3, h4, p, div.card"
    );

    gsap.fromTo(
      items,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [step]);

  return (
    <div className="w-full max-w-[960px] h-[460px] rounded-2xl border border-gray-100 overflow-hidden">
      <div className="relative h-full rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900">
            Custom Development Studio
          </h4>
          <p className="text-xs text-gray-500 max-w-md">
            Bespoke software crafted around your exact business needs.
          </p>
        </div>

        {/* STEP NAV */}
        <div className="relative px-6 py-3 border-b border-gray-200 bg-[#FAFAFA]">
          <div className="flex justify-center">
            <div ref={tabRef} className="relative flex gap-3">
              {TABS.map((label, i) => {
                const isActive = step === i;
                return (
                  <div
                    key={label}
                    className="px-4 py-2 rounded-lg text-xs transition-all"
                    style={{
                      background: isActive ? "#FFF7ED" : "transparent",
                      color: isActive ? PRIMARY : "#6B7280",
                      border: isActive
                        ? "1px solid rgba(227,154,46,0.35)"
                        : "1px solid transparent",
                      boxShadow: isActive
                        ? "0 6px 18px rgba(227,154,46,0.25)"
                        : "none",
                      fontWeight: isActive ? 500 : 400,
                    }}
                  >
                    {label}
                  </div>
                );
              })}

              {/* POINTER */}
              <FaHandPointer
                ref={pointerRef}
                size={22}
                className="absolute pointer-events-none"
                style={{
                  bottom: "-30px",
                  color: PRIMARY,
                  zIndex: 20,
                }}
              />
            </div>
          </div>
        </div>

        {/* CONTENT CANVAS */}
        <div className="flex-1 bg-[#FAFAFA] overflow-y-auto p-8">
          <div ref={contentRef} className="space-y-8">

            {/* OVERVIEW */}
            {step === 0 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Discovery & Planning
                  </h3>
                  <p className="text-sm text-gray-500 max-w-lg">
                    We deeply understand your workflows, users, and business
                    goals before writing a single line of code.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: "Business Logic", icon: FiLayers },
                    { label: "User Experience", icon: FiLayout },
                    { label: "Technology Stack", icon: FiSettings },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className="card rounded-2xl bg-white p-6 shadow-sm border border-gray-200"
                      >
                        <Icon size={22} className="text-[#E39A2E]" />
                        <p className="mt-3 text-sm font-medium text-gray-800">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          Carefully defined & validated
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* BUILD */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-8">
                {[
                  {
                    title: "Frontend Engineering",
                    desc: "Clean, scalable interfaces built for performance.",
                    icon: FiLayout,
                  },
                  {
                    title: "Backend Engineering",
                    desc: "Robust APIs and services designed to scale.",
                    icon: FiServer,
                  },
                ].map((b) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.title}
                      className="card rounded-2xl bg-white p-8 shadow-sm border border-gray-200"
                    >
                      <Icon size={24} className="text-[#E39A2E]" />
                      <h4 className="mt-3 text-sm font-semibold text-gray-900">
                        {b.title}
                      </h4>
                      <p className="text-xs text-gray-500">{b.desc}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* INTEGRATIONS */}
            {step === 2 && (
              <>
                <h4 className="text-sm font-semibold text-gray-900">
                  Integrations & Systems
                </h4>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: "APIs & Services", icon: FiServer },
                    { label: "Databases", icon: FiDatabase },
                    { label: "Third-Party Tools", icon: FiLayers },
                  ].map((i) => {
                    const Icon = i.icon;
                    return (
                      <div
                        key={i.label}
                        className="card rounded-2xl bg-white p-6 shadow-sm border border-gray-200"
                      >
                        <Icon size={22} className="text-[#E39A2E]" />
                        <p className="mt-3 text-sm font-medium text-gray-800">
                          {i.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          Securely connected & tested
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* DELIVERY */}
            {step === 3 && (
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs text-green-700">
                  <FiCheckCircle size={14} />
                  Delivered & Production-Ready
                </span>
                <p className="text-xs text-gray-500 max-w-sm text-center">
                  Your custom solution is tested, documented, and successfully
                  deployed.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
