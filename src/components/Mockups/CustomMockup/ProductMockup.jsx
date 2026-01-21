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
      }, 250); // Thoda slow click animation for visibility
    }, 3000); // Thoda zyada time diya content padhne ke liye

    return () => clearInterval(t);
  }, []);

  /* HAND POINTER ANIMATION - Smoother */
  useEffect(() => {
    if (!pointerRef.current) return;

    // Calculate approximate position based on tab width (assuming ~120px per tab including gap)
    const xPos = page * 120 + 20;

    gsap.to(pointerRef.current, {
      x: xPos,
      y: clicking ? -4 : 0, // Click effect - move up slightly
      scale: clicking ? 0.9 : 1,
      duration: 0.5,
      ease: "power2.out", // Smoother ease
    });
  }, [page, clicking]);

  /* NAV MICRO ANIMATION - Subtle Bounce */
  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current.children,
      { y: -2, opacity: 0.8 },
      {
        y: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.05,
        ease: "back.out(1.5)",
      }
    );
  }, [page]);

  /* PAGE CONTENT ANIMATION - Fade Up */
  useEffect(() => {
    if (!contentRef.current) return;

    // Target direct children for cleaner animation
    const items = contentRef.current.children;

    gsap.fromTo(
      items,
      { opacity: 0, y: 15, filter: "blur(4px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      }
    );
  }, [page]);

  return (
    <div className="w-full max-w-[900px] h-[500px] mx-auto p-0">
      {/* OUTER FRAME - Shadow & Border for depth */}
      <div className="relative h-full rounded-2xl bg-white border border-gray-100 flex flex-col shadow-2xl shadow-gray-200/50 overflow-hidden ring-1 ring-gray-900/5">

        {/* TOP BAR - Mac Style */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/80 border border-red-500/10 shadow-sm" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/80 border border-yellow-500/10 shadow-sm" />
            <span className="h-3 w-3 rounded-full bg-green-400/80 border border-green-500/10 shadow-sm" />
          </div>
          {/* Fake URL Bar for realism */}
          <div className="flex-1 max-w-sm mx-auto h-7 bg-white rounded-md border border-gray-200 shadow-sm flex items-center justify-center">
             <span className="text-[10px] text-gray-400 flex items-center gap-1">
               <span className="text-green-500">🔒</span> sukrut.io/engineering
             </span>
          </div>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>

        {/* NAVBAR */}
        <div className="relative z-20 flex items-center justify-between px-2 py-2 border-b border-gray-100 bg-white">
          {/* LOGO */}
          <Image
            src="/sukrut_light_mode_logo.png"
            alt="Sukrut Logo"
            width={70}
            height={30}
            className="opacity-90 hover:opacity-100 transition-opacity"
          />

          {/* CENTER NAV */}
          <div className="flex-1 flex justify-center">
            <div
              ref={navRef}
              className="relative flex items-center gap-2 p-1 bg-gray-50/50 rounded-lg border border-gray-100/50"
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
                    className={`
                      relative flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 cursor-pointer
                      ${isActive ? "bg-white shadow-sm border border-gray-100" : "hover:bg-gray-100/50 border border-transparent"}
                    `}
                    style={{ width: "110px", justifyContent: "center" }} // Fixed width for pointer alignment
                  >
                    <Icon
                      size={14}
                      className={`transition-colors duration-300 ${isActive ? "text-[#E39A2E]" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-xs font-medium transition-colors duration-300 ${isActive ? "text-gray-900" : "text-gray-500"}`}
                    >
                      {item.label}
                    </span>
                    
                    {isActive && (
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E39A2E]" />
                    )}
                  </div>
                );
              })}

              {/* HAND POINTER - Floating */}
              <div 
                ref={pointerRef}
                className="absolute top-8 left-0 z-50 pointer-events-none drop-shadow-lg"
              >
                <FaHandPointer 
                  size={24} 
                  className="text-gray-800"
                  style={{ 
                    stroke: "white", 
                    strokeWidth: "20px",
                    transformOrigin: "top left"
                  }} 
                />
              </div>
            </div>
          </div>

          {/* CTA - Subtle */}
          <button
            className="rounded-lg px-4 py-2 text-[11px] font-semibold transition-all hover:brightness-105 active:scale-95 shadow-sm shadow-orange-200"
            style={{ backgroundColor: PRIMARY, color: "white" }}
          >
           Contact Us
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-hidden bg-gray-50/30 p-8 relative">
          <div ref={contentRef} className="h-full flex flex-col">
            
            {/* --- HOME TAB --- */}
            {page === 0 && (
              <>
                <div className="mb-8 text-center space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Scale with Confidence
                  </h3>
                  <p className="text-sm text-gray-500 mx-auto max-w-md">
                    Enterprise-grade engineering platform built for high-performance teams.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Architecture", icon: FiLayers, desc: "Modular Design" },
                    { label: "Performance", icon: FiTrendingUp, desc: "Sub-ms Latency" },
                    { label: "Security", icon: FiShield, desc: "Enterprise Ready" },
                  ].map((f) => {
                    const Icon = f.icon;
                    return (
                      <div
                        key={f.label}
                        className="group bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-300"
                      >
                        <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center mb-3 group-hover:bg-[#E39A2E] transition-colors">
                           <Icon size={20} className="text-[#E39A2E] group-hover:text-white transition-colors" />
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {f.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {f.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-auto pt-6 border-t border-gray-100 grid grid-cols-4 gap-4 opacity-70">
                   {["99.9% Uptime", "Global CDN", "24/7 Support", "SOC2 Type II"].map((s) => (
                      <div key={s} className="text-[10px] font-medium text-center text-gray-500 bg-gray-100/50 py-1.5 rounded">
                         {s}
                      </div>
                   ))}
                </div>
              </>
            )}

            {/* --- FEATURES TAB --- */}
            {page === 1 && (
              <div className="h-full flex flex-col justify-center">
                 <div className="text-center mb-6">
                    <span className="text-[10px] font-bold tracking-widest text-[#E39A2E] uppercase">Powerful Tools</span>
                    <h3 className="text-xl font-bold text-gray-800 mt-1">Everything you need</h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Design System", icon: FiCpu, color: "text-blue-500", bg: "bg-blue-50" },
                      { label: "API Gateway", icon: FiServer, color: "text-purple-500", bg: "bg-purple-50" },
                      { label: "Real-time Monitoring", icon: FiTrendingUp, color: "text-green-500", bg: "bg-green-50" },
                      { label: "Cloud Uploads", icon: FiUploadCloud, color: "text-pink-500", bg: "bg-pink-50" },
                    ].map((f) => {
                      const Icon = f.icon;
                      return (
                        <div key={f.label} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-gray-200 transition-colors">
                           <div className={`h-12 w-12 rounded-full ${f.bg} flex items-center justify-center`}>
                              <Icon className={f.color} size={20} />
                           </div>
                           <div>
                              <div className="font-semibold text-gray-800 text-sm">{f.label}</div>
                              <div className="text-xs text-gray-400">Production ready</div>
                           </div>
                        </div>
                      )
                    })}
                 </div>
              </div>
            )}

            {/* --- DOCS TAB --- */}
            {page === 2 && (
              <div className="h-full flex gap-6">
                 {/* Sidebar Mockup */}
                 <div className="w-1/3 space-y-2 border-r border-gray-100 pr-4">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Navigation</div>
                    {["Quick Start", "Installation", "Components", "CLI Reference"].map((item, i) => (
                       <div key={item} className={`p-2 rounded text-xs cursor-pointer flex items-center justify-between ${i===0 ? "bg-orange-50 text-[#E39A2E] font-medium" : "text-gray-500 hover:bg-gray-50"}`}>
                          {item}
                          {i===0 && <span className="text-[10px]">→</span>}
                       </div>
                    ))}
                 </div>
                 
                 {/* Content Mockup */}
                 <div className="flex-1 space-y-4">
                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-2 w-full bg-gray-100 rounded" />
                    <div className="h-2 w-5/6 bg-gray-100 rounded" />
                    
                    <div className="mt-4 p-4 bg-gray-900 rounded-lg shadow-md font-mono text-xs text-gray-300 relative overflow-hidden group">
                       <div className="absolute top-2 right-2 flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-red-500" />
                          <div className="h-2 w-2 rounded-full bg-yellow-500" />
                       </div>
                       <span className="text-purple-400">npm</span> install <span className="text-green-400">@sukrut/sdk</span>
                       <br/>
                       <span className="text-gray-500"># Initializing project...</span>
                       <br/>
                       <span className="text-blue-400">✓</span> Done in 1.2s
                    </div>
                 </div>
              </div>
            )}

            {/* --- DEPLOY TAB --- */}
            {page === 3 && (
              <div className="h-full flex flex-col items-center justify-center relative">
                 {/* Success Animation Circle */}
                 <div className="relative mb-6">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50" />
                    <div className="relative h-20 w-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                       <FiCheckCircle size={40} className="text-green-500" />
                    </div>
                 </div>
                 
                 <h3 className="text-xl font-bold text-gray-800">Deployment Complete!</h3>
                 <p className="text-sm text-gray-400 mt-2 text-center max-w-xs">
                    Your application is now live on the global edge network.
                 </p>
                 
                 <div className="mt-6 flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">View Logs</button>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium shadow-md shadow-green-200 hover:bg-green-700">Visit Site</button>
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}