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
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const pointerX = useRef(null);

  const pointerRef = useRef(null);
  const navRef = useRef(null);
  const contentRef = useRef(null);

  /* ---------- HYDRATION SAFE MOUNT ---------- */
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /* ---------- RESPONSIVE CHECK (CLIENT ONLY) ---------- */
  useEffect(() => {
    if (!isMounted) return;

    const check = () => setIsMobile(window.innerWidth < 768);
    check();

    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [isMounted]);

  /* ---------- AUTO PAGE CYCLE ---------- */
  useEffect(() => {
    if (!isMounted) return;

    const t = setInterval(() => {
      setClicking(true);
      setTimeout(() => {
        setPage((p) => (p + 1) % pages.length);
        setClicking(false);
      }, 250);
    }, 2000);

    return () => clearInterval(t);
  }, [isMounted]);

  /* ---------- POINTER ANIMATION (DESKTOP ONLY) ---------- */
 useEffect(() => {
  if (!pointerRef.current || isMobile) return;

  // Create updater once
  if (!pointerX.current) {
    pointerX.current = gsap.quickTo(pointerRef.current, "x", {
      duration: 0.45,
      ease: "power3.out",
    });
  }

  const xPos = page * 120 + 20;

  pointerX.current(xPos);

  gsap.to(pointerRef.current, {
    y: clicking ? -4 : 0,
    scale: clicking ? 0.9 : 1,
    duration: 0.25,
    ease: "power2.out",
  });
}, [page, clicking, isMobile]);


  /* ---------- NAV MICRO ANIMATION ---------- */
  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
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
    });

    return () => ctx.revert();
  }, [page]);

  /* ---------- CONTENT FADE ---------- */
  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current.children,
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
    });

    return () => ctx.revert();
  }, [page]);

  /* ---------- PREVENT HYDRATION MISMATCH ---------- */
  if (!isMounted) return null;


  return (
    <div className="w-full max-w-[900px] min-w-0 h-[360px] sm:h-[420px] md:h-[500px] mx-auto p-0">
      {/* OUTER FRAME - Shadow & Border for depth */}
      <div className="relative h-full rounded-xl sm:rounded-2xl bg-white border border-gray-100 flex flex-col shadow-2xl shadow-gray-200/50 overflow-hidden ring-1 ring-gray-900/5">

        {/* TOP BAR - Mac Style - compact on mobile */}
        <div className="flex items-center justify-between px-2 sm:px-4 md:px-5 py-2 sm:py-3 border-b border-gray-100 bg-gray-50/80 backdrop-blur-sm">
          <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
            <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-red-400/80 border border-red-500/10 shadow-sm" />
            <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-yellow-400/80 border border-yellow-500/10 shadow-sm" />
            <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-green-400/80 border border-green-500/10 shadow-sm" />
          </div>
          {/* Fake URL Bar - hide or shrink on very small */}
          <div className="flex-1 min-w-0 max-w-[140px] sm:max-w-[200px] md:max-w-sm mx-auto h-6 sm:h-7 bg-white rounded-md border border-gray-200 shadow-sm flex items-center justify-center flex-shrink-0">
             <span className="text-[8px] sm:text-[10px] text-gray-400 flex items-center gap-1 truncate">
               <span className="text-green-500">🔒</span> sukrut.io
             </span>
          </div>
          <div className="w-6 sm:w-10 flex-shrink-0"></div>
        </div>

        {/* NAVBAR - scrollable on mobile */}
        <div className="hidden md:flex relative z-20 flex items-center justify-between gap-1 sm:gap-2 px-1 sm:px-2 py-1.5 sm:py-2 border-b border-gray-100 bg-white min-w-0">
          {/* LOGO - shrink on mobile */}
          <Image
            src="/sukrut_light_mode_logo.png"
            alt="Sukrut Logo"
            width={70}
            height={30}
            className="opacity-90 hover:opacity-100 transition-opacity w-12 h-6 sm:w-14 sm:h-7 md:w-[70px] md:h-[30px] object-contain object-left flex-shrink-0"
          />

                        <div 
                ref={pointerRef}
                className="absolute top-6 sm:top-8 left-44 z-50 pointer-events-none drop-shadow-lg"
              >
                <FaHandPointer 
                  size={20}
                  className="sm:w-6 sm:h-6 text-gray-800"
                  style={{ 
                    stroke: "white", 
                    strokeWidth: "20px",
                    transformOrigin: "top left"
                  }} 
                />
              </div>

          {/* CENTER NAV - overflow-x-auto on mobile */}
          <div className="flex-1 flex justify-center min-w-0 overflow-hidden">
            <div
              ref={navRef}
              className="relative flex items-center gap-1 sm:gap-2 p-1 bg-gray-50/50 rounded-lg border border-gray-100/50 overflow-x-auto scrollbar-hide"
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
                      relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md transition-all duration-300 cursor-pointer flex-shrink-0
                      ${isActive ? "bg-white shadow-sm border border-gray-100" : "hover:bg-gray-100/50 border border-transparent"}
                    `}
                    style={{ minWidth: "64px", maxWidth: "110px", justifyContent: "center" }}
                  >
                    <Icon
                      size={14}
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 transition-colors duration-300 ${isActive ? "text-[#E39A2E]" : "text-gray-400"}`}
                    />
                    <span
                      className={`text-[10px] sm:text-xs font-medium transition-colors duration-300 truncate ${isActive ? "text-gray-900" : "text-gray-500"}`}
                    >
                      {item.label}
                    </span>
                    
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#E39A2E]" />
                    )}
                  </div>
                );
              })}

            </div>
          </div>

          {/* CTA - smaller on mobile */}
          <button
            className="rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 text-[9px] sm:text-[10px] md:text-[11px] font-semibold transition-all hover:brightness-105 active:scale-95 shadow-sm shadow-orange-200 flex-shrink-0"
            style={{ backgroundColor: PRIMARY, color: "white" }}
          >
           Contact
          </button>
        </div>
{/* MOBILE NAVBAR */}
{isMobile && (
  <div className="relative z-20 flex items-center justify-center gap-4 px-3 py-2 border-b border-gray-100 bg-white">

    {/* ICON NAV */}
    {[
      { icon: FiHome },
      { icon: FiGrid },
      { icon: FiBookOpen },
      { icon: FiUploadCloud },
    ].map((item, i) => {
      const Icon = item.icon;
      const isActive = page === i;

      return (
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`h-10 w-10 flex items-center justify-center rounded-lg transition-all
            ${isActive ? "bg-orange-100 text-[#E39A2E]" : "text-gray-400"}
          `}
        >
          <Icon size={18} />
        </button>
      );
    })}
  </div>
)}

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-hidden bg-gray-50/30 p-3 sm:p-5 md:p-8 relative min-h-0">
          <div ref={contentRef} className="h-full flex flex-col">
            
            {/* --- HOME TAB --- */}
            {page === 0 && (
              <>
                <div className="mb-3 sm:mb-5 md:mb-8 text-center space-y-1 sm:space-y-2">
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                    Scale with Confidence
                  </h3>
                  <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mx-auto max-w-md">
                    Enterprise-grade engineering platform built for high-performance teams.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {[
                    { label: "Architecture", icon: FiLayers, desc: "Modular Design" },
                    { label: "Performance", icon: FiTrendingUp, desc: "Sub-ms Latency" },
                    { label: "Security", icon: FiShield, desc: "Enterprise Ready" },
                  ].map((f) => {
                    const Icon = f.icon;
                    return (
                      <div
                        key={f.label}
                        className="group bg-white p-2 sm:p-3 md:p-5 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-300"
                      >
                        <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-lg bg-orange-50 flex items-center justify-center mb-1 sm:mb-2 md:mb-3 group-hover:bg-[#E39A2E] transition-colors">
                           <Icon size={16} className="sm:w-5 sm:h-5 text-[#E39A2E] group-hover:text-white transition-colors" />
                        </div>
                        <p className="font-semibold text-gray-800 text-[10px] sm:text-xs md:text-sm">
                          {f.label}
                        </p>
                        <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 mt-0.5 sm:mt-1">
                          {f.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-auto pt-3 sm:pt-4 md:pt-6 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 opacity-70">
                   {["99.9% Uptime", "Global CDN", "24/7 Support", "SOC2 Type II"].map((s) => (
                      <div key={s} className="text-[8px] sm:text-[9px] md:text-[10px] font-medium text-center text-gray-500 bg-gray-100/50 py-1 sm:py-1.5 rounded">
                         {s}
                      </div>
                   ))}
                </div>
              </>
            )}

            {/* --- FEATURES TAB --- */}
            {page === 1 && (
              <div className="h-full flex flex-col justify-center">
                 <div className="text-center mb-3 sm:mb-6">
                    <span className="text-[8px] sm:text-[10px] font-bold tracking-widest text-[#E39A2E] uppercase">Powerful Tools</span>
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 mt-1">Everything you need</h3>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    {[
                      { label: "Design System", icon: FiCpu, color: "text-blue-500", bg: "bg-blue-50" },
                      { label: "API Gateway", icon: FiServer, color: "text-purple-500", bg: "bg-purple-50" },
                      { label: "Real-time Monitoring", icon: FiTrendingUp, color: "text-green-500", bg: "bg-green-50" },
                      { label: "Cloud Uploads", icon: FiUploadCloud, color: "text-pink-500", bg: "bg-pink-50" },
                    ].map((f) => {
                      const Icon = f.icon;
                      return (
                        <div key={f.label} className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 md:p-4 bg-white border border-gray-100 rounded-lg sm:rounded-xl shadow-sm hover:border-gray-200 transition-colors min-w-0">
                           <div className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full ${f.bg} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`${f.color} w-4 h-4 sm:w-5 sm:h-5`} />
                           </div>
                           <div className="min-w-0">
                              <div className="font-semibold text-gray-800 text-[10px] sm:text-xs md:text-sm truncate">{f.label}</div>
                              <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-400">Production ready</div>
                           </div>
                        </div>
                      )
                    })}
                 </div>
              </div>
            )}

            {/* --- DOCS TAB --- */}
            {page === 2 && (
              <div className="h-full flex gap-2 sm:gap-4 md:gap-6 min-w-0">
                 {/* Sidebar Mockup */}
                 <div className="w-1/3 min-w-[60px] sm:min-w-[70px] space-y-1 sm:space-y-2 border-r border-gray-100 pr-2 sm:pr-4 flex-shrink-0">
                    <div className="text-[9px] sm:text-xs font-bold text-gray-400 uppercase mb-1 sm:mb-2">Nav</div>
                    {["Quick Start", "Installation", "Components", "CLI Reference"].map((item, i) => (
                       <div key={item} className={`p-1.5 sm:p-2 rounded text-[9px] sm:text-xs cursor-pointer flex items-center justify-between truncate ${i===0 ? "bg-orange-50 text-[#E39A2E] font-medium" : "text-gray-500 hover:bg-gray-50"}`}>
                          <span className="truncate">{item}</span>
                          {i===0 && <span className="text-[8px] sm:text-[10px] flex-shrink-0 ml-1">→</span>}
                       </div>
                    ))}
                 </div>
                 
                 {/* Content Mockup */}
                 <div className="flex-1 space-y-2 sm:space-y-4 min-w-0 overflow-hidden">
                    <div className="h-3 sm:h-4 w-3/4 max-w-full bg-gray-200 rounded animate-pulse" />
                    <div className="h-1.5 sm:h-2 w-full bg-gray-100 rounded" />
                    <div className="h-1.5 sm:h-2 w-5/6 max-w-full bg-gray-100 rounded" />
                    
                    <div className="mt-2 sm:mt-4 p-2 sm:p-3 md:p-4 bg-gray-900 rounded-lg shadow-md font-mono text-[9px] sm:text-[10px] md:text-xs text-gray-300 relative overflow-hidden group">
                       <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex gap-1">
                          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-red-500" />
                          <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-yellow-500" />
                       </div>
                       <span className="text-purple-400">npm</span> install <span className="text-green-400">@sukrut/sdk</span>
                       <br/>
                       <span className="text-gray-500"># Initializing...</span>
                       <br/>
                       <span className="text-blue-400">✓</span> Done in 1.2s
                    </div>
                 </div>
              </div>
            )}

            {/* --- DEPLOY TAB --- */}
            {page === 3 && (
              <div className="h-full flex flex-col items-center justify-center relative py-2">
                 <div className="relative mb-3 sm:mb-6">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50" />
                    <div className="relative h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                       <FiCheckCircle size={24} className="sm:w-8 sm:h-8 md:w-10 md:h-10 text-green-500" />
                    </div>
                 </div>
                 
                 <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800">Deployment Complete!</h3>
                 <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mt-1 sm:mt-2 text-center max-w-xs">
                    Your application is now live on the global edge network.
                 </p>
                 
                 <div className="mt-3 sm:mt-6 flex gap-2 sm:gap-3">
                    <button className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-white border border-gray-200 rounded-lg text-[10px] sm:text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50">View Logs</button>
                    <button className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-green-600 text-white rounded-lg text-[10px] sm:text-xs font-medium shadow-md shadow-green-200 hover:bg-green-700">Visit Site</button>
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}