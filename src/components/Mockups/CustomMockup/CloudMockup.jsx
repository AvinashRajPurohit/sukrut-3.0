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
  FiGlobe,
  FiCpu,
  FiZap,
  FiMoreHorizontal,
  FiLayout
} from "react-icons/fi";

const TABS = [
  { label: "Architecture", icon: FiLayout, desc: "Topology" },
  { label: "Auto-Scaling", icon: FiTrendingUp, desc: "Elasticity" },
  { label: "Monitoring", icon: FiActivity, desc: "Health" },
  { label: "Status", icon: FiCheckCircle, desc: "Live" },
];

export function CloudMockup() {
  const [stage, setStage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef(null);
  const progressBarRef = useRef(null);
  const barsRef = useRef([]);

  /* --- FIXED: AUTO FLOW CONTROL --- */
  useEffect(() => {
    if (isHovered) return;

    // GSAP Context ensures proper cleanup in React Strict Mode
    const ctx = gsap.context(() => {
      gsap.fromTo(progressBarRef.current, 
        { width: "0%" }, 
        { 
          width: "100%", 
          duration: 2.0, // FAST: Reduced from 3.5s to 2.0s
          ease: "linear", 
          onComplete: () => {
            // Using callback to ensure we get the latest state safely
            setStage((prev) => (prev + 1) % TABS.length);
          }
        }
      );
    });

    return () => ctx.revert(); // This kills the animation completely on unmount/update
  }, [stage, isHovered]);

  /* --- CONTENT TRANSITIONS (Faster) --- */
  useEffect(() => {
    if (!contentRef.current) return;
    
    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 15, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3, // FAST: Reduced from 0.5s
        stagger: 0.05, // FAST: Reduced stagger
        ease: "power2.out",
        clearProps: "all"
      }
    );
  }, [stage]);

  /* --- SCALING BAR ANIMATION (Faster) --- */
  useEffect(() => {
    if (stage !== 1) return;
    
    // Reset bars first to ensure re-animation works
    gsap.set(barsRef.current, { width: "0%" });

    gsap.to(barsRef.current, {
        width: (i, el) => el.dataset.value,
        duration: 0.8, // FAST: Reduced from 1.2s
        ease: "expo.out",
        stagger: 0.05,
    });
  }, [stage]);

  return (
    <div 
      className="w-full max-w-[900px] min-w-0 h-[360px] sm:h-[420px] md:h-[500px] mx-auto p-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* OUTER CONTAINER */}
      <div className="relative h-full rounded-xl sm:rounded-2xl bg-white border border-gray-100 flex flex-col shadow-2xl shadow-blue-900/5 overflow-hidden ring-1 ring-gray-900/5 font-sans">
        
        {/* HEADER */}
        <div className="h-12 sm:h-14 md:h-16 px-3 sm:px-4 md:px-6 border-b border-gray-100 flex justify-between items-center bg-white z-20 gap-2 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0">
            <div className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm flex-shrink-0">
              <FiCloud className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-900 leading-tight truncate">Cloud Console</h4>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                <span className="text-gray-300">|</span>
                <span className="text-green-600 font-medium flex items-center gap-1 sm:gap-1.5 truncate">
                  <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0"></span>
                  Operational
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-100 text-xs text-gray-600">
                <FiGlobe /> Global Edge
             </div>
             <FiMoreHorizontal className="text-gray-400 cursor-pointer w-4 h-4" />
          </div>
        </div>

        {/* PROGRESS LINE */}
        <div className="h-[2px] w-full bg-gray-50">
           <div ref={progressBarRef} className="h-full bg-[#E39A2E]" />
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 flex bg-[#FAFAFA] relative min-h-0">
           
           {/* SIDEBAR NAVIGATION - narrower on mobile */}
           <div className="w-20 sm:w-36 md:w-48 lg:w-60 bg-white border-r border-gray-100 p-2 sm:p-3 md:p-4 flex flex-col gap-1 sm:gap-2 z-10 flex-shrink-0">
              <div className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 sm:px-2 mb-1 sm:mb-2">Infra</div>
              {TABS.map((tab, i) => {
                 const isActive = stage === i;
                 const Icon = tab.icon;
                 return (
                    <button
                      key={i}
                      onClick={() => setStage(i)}
                      className={`
                        text-left flex items-center gap-1.5 sm:gap-2 md:gap-3 px-1.5 py-2 sm:px-2 sm:py-2.5 md:px-3 md:py-3 rounded-lg sm:rounded-xl transition-all duration-200 group relative min-w-0
                        ${isActive ? "bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}
                      `}
                    >
                       <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                       <div className="min-w-0 hidden sm:block">
                          <div className="text-[10px] md:text-xs font-bold truncate">{tab.label}</div>
                          <div className="text-[8px] md:text-[10px] opacity-70 font-normal truncate">{tab.desc}</div>
                       </div>
                       {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 sm:w-1 h-6 sm:h-8 bg-blue-500 rounded-r-full" />}
                    </button>
                 )
              })}

              <div className="mt-auto bg-gradient-to-br from-orange-50 to-orange-100 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-orange-200 hidden sm:block">
                 <div className="text-[9px] sm:text-[10px] md:text-xs font-bold text-orange-800 mb-0.5 sm:mb-1">Cost Savings</div>
                 <div className="text-base sm:text-lg md:text-2xl font-bold text-orange-600">$4.2k</div>
                 <div className="text-[8px] sm:text-[9px] md:text-[10px] text-orange-700 mt-0.5 sm:mt-1 opacity-80">Est. monthly</div>
              </div>
           </div>

           {/* CONTENT AREA */}
           <div className="flex-1 p-3 sm:p-5 md:p-8 overflow-hidden relative min-w-0">
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
              
              <div ref={contentRef} className="h-full w-full relative z-10 flex flex-col">
                 
                 {/* STAGE 0: ARCHITECTURE */}
                 {stage === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-2">
                       <div className="mb-3 sm:mb-5 md:mb-8 text-center">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Infrastructure Topology</h3>
                          <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">High-availability load balanced cluster</p>
                       </div>
                       
                       <div className="relative flex flex-wrap items-center justify-center gap-4 sm:gap-8 md:gap-12">
                          <div className="relative z-10">
                             <div className="h-16 w-16 bg-white rounded-2xl border-2 border-orange-100 shadow-lg flex items-center justify-center text-orange-500 relative">
                                <div className="absolute -top-2 -right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                                <FiGlobe size={28} />
                             </div>
                             <div className="text-center mt-2 text-xs font-bold text-gray-600">Load Balancer</div>
                          </div>

                          <div className="absolute left-16 right-16 top-8 h-[2px] bg-gradient-to-r from-orange-200 via-blue-200 to-purple-200">
                             <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-8 w-[1px] bg-blue-200" />
                          </div>

                          <div className="flex flex-col gap-6 relative z-10">
                             <NodeCard icon={<FiServer />} label="App Server 1" color="blue" />
                             <NodeCard icon={<FiServer />} label="App Server 2" color="blue" />
                             <NodeCard icon={<FiDatabase />} label="Primary DB" color="purple" />
                          </div>
                       </div>
                    </div>
                 )}

                 {/* STAGE 1: AUTO SCALING */}
                 {stage === 1 && (
                    <div className="h-full flex flex-col justify-center py-2">
                       <div className="flex justify-between items-end mb-3 sm:mb-6 gap-2">
                          <div className="min-w-0">
                             <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Auto-Scaling Events</h3>
                             <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">Real-time resource allocation</p>
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-orange-50 text-orange-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-bold border border-orange-100 flex-shrink-0">
                             <FiZap className="w-3 h-3" /> Scaling Up
                          </div>
                       </div>

                       <div className="bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm space-y-3 sm:space-y-6">
                          {[
                             { label: "CPU Utilization", value: "85%", color: "bg-red-500", width: "85%" },
                             { label: "Memory Usage", value: "62%", color: "bg-blue-500", width: "62%" },
                             { label: "Network I/O", value: "45%", color: "bg-green-500", width: "45%" },
                             { label: "Active Instances", value: "12 / 20", color: "bg-purple-500", width: "60%" },
                          ].map((m, i) => (
                             <div key={i} className="group">
                                <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                                   <span>{m.label}</span>
                                   <span className="text-gray-900">{m.value}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                   <div 
                                      ref={el => {
                                          if(el) barsRef.current[i] = el;
                                      }}
                                      data-value={m.width}
                                      className={`h-full rounded-full ${m.color} opacity-80 shadow-sm`}
                                      style={{ width: "0%" }}
                                   />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 )}

                 {/* STAGE 2: MONITORING */}
                 {stage === 2 && (
                    <div className="h-full flex flex-col py-2">
                       <div className="mb-3 sm:mb-6 flex justify-between items-center gap-2">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">System Health</h3>
                          <button className="text-[9px] sm:text-[10px] md:text-xs bg-white border border-gray-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-gray-600 shadow-sm flex-shrink-0">View Logs</button>
                       </div>

                       <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                          <HealthCard title="Avg Response" value="45ms" status="Healthy" trend="-2ms" color="green" icon={<FiActivity />} />
                          <HealthCard title="Error Rate" value="0.02%" status="Stable" trend="0%" color="blue" icon={<FiShield />} />
                          <HealthCard title="Throughput" value="12k rpm" status="High Load" trend="+1.2k" color="orange" icon={<FiZap />} />
                          <HealthCard title="CPU Load" value="34%" status="Normal" trend="-5%" color="purple" icon={<FiCpu />} />
                       </div>
                    </div>
                 )}

                 {/* STAGE 3: STATUS */}
                 {stage === 3 && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-2">
                       <div className="relative mb-4 sm:mb-6 md:mb-8">
                          <div className="absolute inset-0 border-2 sm:border-4 border-green-100 rounded-full animate-ping opacity-20" />
                          <div className="absolute inset-1 sm:inset-2 border-2 sm:border-4 border-green-200 rounded-full animate-pulse opacity-30" />
                          
                          <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-24 md:w-24 bg-white rounded-full border-2 sm:border-4 border-green-50 shadow-xl flex items-center justify-center relative z-10">
                             <FiCloud className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-green-500" />
                             <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-white p-1 sm:p-1.5 rounded-full">
                                <FiCheckCircle className="text-white w-3 h-3 sm:w-3.5 sm:h-3.5" />
                             </div>
                          </div>
                       </div>

                       <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Systems Operational</h3>
                       <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 max-w-xs mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
                          Your infrastructure is fully deployed, secured, and running at peak performance.
                       </p>

                       <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-600 bg-white px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-full border border-gray-200 shadow-sm">
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-green-500" />
                             API
                          </div>
                          <div className="h-4 w-[1px] bg-gray-200" />
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-green-500" />
                             Database
                          </div>
                          <div className="h-4 w-[1px] bg-gray-200" />
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-green-500" />
                             CDN
                          </div>
                       </div>
                    </div>
                 )}

              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function NodeCard({ icon, label, color }) {
   const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100",
   };

   return (
      <div className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl border bg-white shadow-sm w-28 sm:w-36 md:w-44 min-w-0 hover:scale-105 transition-transform duration-300`}>
         <div className={`p-1.5 sm:p-2 rounded-lg ${colors[color]} border flex-shrink-0`}>
            {icon}
         </div>
         <div className="text-[10px] sm:text-xs font-bold text-gray-700 truncate">{label}</div>
         <div className="ml-auto h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-400 flex-shrink-0" />
      </div>
   )
}

function HealthCard({ title, value, status, trend, color, icon }) {
   const colorMap = {
      green: "text-green-600 bg-green-50",
      blue: "text-blue-600 bg-blue-50",
      orange: "text-orange-600 bg-orange-50",
      purple: "text-purple-600 bg-purple-50",
   };

   return (
      <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:border-gray-300 transition-colors min-w-0">
         <div className="flex justify-between items-start mb-1 sm:mb-2 gap-1">
            <div className={`p-1.5 sm:p-2 rounded-lg ${colorMap[color]} flex-shrink-0`}>{icon}</div>
            <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full ${colorMap[color]} bg-opacity-20 truncate`}>
               {status}
            </span>
         </div>
         <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">{value}</div>
         <div className="flex items-center gap-1 sm:gap-2 mt-0.5 sm:mt-1">
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium truncate">{title}</span>
            <span className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-400 bg-gray-50 px-1 rounded flex-shrink-0">{trend}</span>
         </div>
      </div>
   )
}