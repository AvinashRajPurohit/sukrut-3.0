"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  FiCloud,
  FiServer,
  FiDatabase,
  FiActivity,
  FiTrendingUp,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

const PRIMARY = "#E39A2E";

export function CloudMockup() {
  const [stage, setStage] = useState(0);
  const contentRef = useRef(null);
  const barsRef = useRef([]);


  /* AUTO FLOW */
  useEffect(() => {
    const t = setInterval(() => {
      setStage((s) => (s + 1) % 4);
    }, 2600);
    return () => clearInterval(t);
  }, []);

  /* GSAP ANIMATION */
  useEffect(() => {
    if (!contentRef.current) return;

    const items = contentRef.current.querySelectorAll(
      ".cloud-card, .metric-bar, .status-chip"
    );

    gsap.fromTo(
      items,
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, [stage]);

  useEffect(() => {
  if (stage !== 1) return;
  if (!barsRef.current.length) return;

  gsap.fromTo(
    barsRef.current,
    { width: "0%" },
    {
      width: (i, el) => el.dataset.value,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.15,
    }
  );
}, [stage]);

  return (
    <div className="w-full max-w-[960px] h-[460px] rounded-2xl border border-gray-100 overflow-hidden">
      <div className="relative h-full rounded-2xl bg-white shadow-xl flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#FFF7ED] flex items-center justify-center">
              <FiCloud className="text-[#E39A2E]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">
                Scalable Cloud Solutions
              </h4>
              <p className="text-xs text-gray-500">
                Cloud-native architectures designed for performance and growth
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 bg-[#FAFAFA] overflow-y-auto p-8">
          <div ref={contentRef} className="space-y-8">

            {/* STAGE 0 – ARCHITECTURE */}
            {stage === 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900">
                  Cloud Architecture Overview
                </h3>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: "Compute Services", icon: FiServer },
                    { label: "Managed Databases", icon: FiDatabase },
                    { label: "Load Balancers", icon: FiTrendingUp },
                  ].map((i) => {
                    const Icon = i.icon;
                    return (
                      <div
                        key={i.label}
                        className="cloud-card rounded-2xl bg-white p-6 shadow-sm border border-gray-200"
                      >
                        <Icon size={22} className="text-[#E39A2E]" />
                        <p className="mt-3 text-sm font-medium text-gray-800">
                          {i.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          Designed for high availability
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* STAGE 1 – AUTO SCALING */}
          {stage === 1 && (
  <>
    <h3 className="text-lg font-semibold text-gray-900">
      Auto Scaling in Action
    </h3>

    <div className="space-y-4">
      {[
        { label: "Traffic Load", value: "80%" },
        { label: "Compute Scale", value: "65%" },
        { label: "Database Throughput", value: "70%" },
      ].map((m, i) => (
        <div key={m.label} className="metric-bar">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>{m.label}</span>
            <span>{m.value}</span>
          </div>

          <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              ref={(el) => (barsRef.current[i] = el)}
              data-value={m.value}
              className="h-full rounded-full"
              style={{
                backgroundColor: PRIMARY,
                width: "0%", // 🔴 start empty
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </>
)}


            {/* STAGE 2 – MONITORING */}
            {stage === 2 && (
              <>
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance & Monitoring
                </h3>

                <div className="grid grid-cols-3 gap-6">
                  {[
                    { label: "Uptime", value: "99.99%", icon: FiActivity },
                    { label: "Latency", value: "Low", icon: FiTrendingUp },
                    { label: "Security", value: "Protected", icon: FiShield },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.label}
                        className="cloud-card rounded-2xl bg-white p-6 shadow-sm border border-gray-200"
                      >
                        <Icon size={22} className="text-[#E39A2E]" />
                        <p className="mt-3 text-sm font-medium text-gray-800">
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-500">{s.value}</p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* STAGE 3 – DEPLOYED */}
            {stage === 3 && (
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <span className="status-chip flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs text-green-700">
                  <FiCheckCircle size={14} />
                  Cloud Infrastructure Live
                </span>
                <p className="text-xs text-gray-500 max-w-sm text-center">
                  Secure, scalable, and continuously monitored cloud
                  environment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
