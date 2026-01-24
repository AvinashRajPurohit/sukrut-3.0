"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { FaHandPointer, FaReact, FaNodeJs, FaAws, FaDocker, FaStripe } from "react-icons/fa";
import {
  FiCode,
  FiLayout,
  FiServer,
  FiDatabase,
  FiLayers,
  FiCheckCircle,
  FiSettings,
  FiGitBranch,
  FiActivity,
  FiBox,
  FiZap,
} from "react-icons/fi";

const PRIMARY = "#E39A2E";
const TABS = [
  { label: "Planning", icon: FiLayout },
  { label: "Development", icon: FiCode },
  { label: "Integration", icon: FiZap },
  { label: "Delivery", icon: FiBox },
];

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
      }, 250);
    }, 2000); // Thoda time badhaya taaki content dikhe

    return () => clearInterval(t);
  }, []);

  /* POINTER ANIMATION */
  useEffect(() => {
    if (!pointerRef.current) return;
    // Approx width per tab (130px) + spacing
    const xPos = step * 135 + 30;

    gsap.to(pointerRef.current, {
      x: xPos,
      y: clicking ? -4 : 0,
      scale: clicking ? 0.9 : 1,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [step, clicking]);

  /* CONTENT TRANSITION */
  useEffect(() => {
    if (!contentRef.current) return;
    
    // Kill overlapping animations
    gsap.killTweensOf(contentRef.current.children);

    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 20, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.2)",
      }
    );
  }, [step]);

  return (
    <div className="w-full max-w-[900px] min-w-0 h-[360px] sm:h-[420px] md:h-[500px] mx-auto p-0 perspective-1000">
      {/* OUTER CONTAINER */}
      <div className="relative h-full rounded-xl sm:rounded-2xl bg-white border border-gray-100 flex flex-col shadow-2xl shadow-gray-200/50 overflow-hidden ring-1 ring-gray-900/5 font-sans">
        
        {/* HEADER AREA */}
        <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center gap-2 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
             <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                <FiLayers size={14} className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px]" />
             </div>
             <div className="min-w-0">
                <h4 className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-900 truncate">Project: Enterprise CRM</h4>
                <div className="flex items-center gap-1.5 sm:gap-2">
                   <span className="h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                   <p className="text-[8px] sm:text-[9px] md:text-[10px] text-gray-500 font-medium uppercase tracking-wide">Active Sprint</p>
                </div>
             </div>
          </div>
          <div className="flex -space-x-1.5 sm:-space-x-2 flex-shrink-0">
             {[1,2,3].map(i => (
                <div key={i} className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full border-2 border-white bg-gray-200" />
             ))}
             <div className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] sm:text-[9px] md:text-[10px] font-bold text-gray-500">+4</div>
          </div>
        </div>

        {/* NAVIGATION TABS - scroll on mobile */}
        <div className="relative px-2 sm:px-4 md:px-6 py-2 sm:py-3 border-b border-gray-100 bg-white z-20 min-w-0">
          <div className="flex justify-center overflow-x-auto scrollbar-hide">
            <div ref={tabRef} className="relative flex gap-1 sm:gap-2 p-1 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-100">
              {TABS.map((tab, i) => {
                const isActive = step === i;
                const Icon = tab.icon;
                return (
                  <div
                    key={tab.label}
                    className={`
                      min-w-[72px] sm:min-w-[90px] md:w-[130px] flex items-center justify-center gap-1 sm:gap-2 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-300 flex-shrink-0
                      ${isActive ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}
                    `}
                  >
                    <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? "text-[#E39A2E]" : "text-gray-400"}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                );
              })}

              {/* POINTER */}
              <div 
                ref={pointerRef}
                className="absolute top-6 sm:top-8 left-0 z-50 pointer-events-none drop-shadow-md"
              >
                <FaHandPointer 
                  size={20}
                  className="sm:w-6 sm:h-6 text-gray-800"
                  style={{ stroke: "white", strokeWidth: "20px", transformOrigin: "top left" }} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 bg-[#FAFAFA] p-3 sm:p-5 md:p-8 relative overflow-hidden min-h-0">
          <div ref={contentRef} className="h-full flex flex-col gap-6">

            {/* STEP 1: PLANNING (Kanban Look) */}
            {step === 0 && (
              <>
                <div className="text-center mb-1 sm:mb-2">
                   <h3 className="text-sm sm:text-base md:text-xl font-bold text-gray-800">Discovery & Architecture</h3>
                   <p className="text-[9px] sm:text-[10px] md:text-xs text-gray-500">Mapping out the blueprint for success</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 h-full min-h-0">
                   {/* Column 1 */}
                   <div className="bg-gray-100/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 flex flex-col gap-1.5 sm:gap-3 min-w-0">
                      <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-between">
                         Backlog <span className="bg-gray-200 px-1 sm:px-1.5 rounded text-gray-600">3</span>
                      </div>
                      <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-[10px] sm:text-xs font-medium text-gray-700 truncate">User Authentication Flow</div>
                      <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-[10px] sm:text-xs font-medium text-gray-700 truncate">Payment Gateway Integration</div>
                   </div>
                   
                   {/* Column 2 */}
                   <div className="bg-orange-50/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-orange-100 flex flex-col gap-1.5 sm:gap-3 min-w-0">
                      <div className="text-[8px] sm:text-[10px] font-bold text-orange-400 uppercase tracking-widest flex justify-between">
                         In Progress <span className="bg-orange-100 px-1 sm:px-1.5 rounded text-orange-600">2</span>
                      </div>
                      <div className="bg-white p-2 sm:p-3 rounded-lg border border-orange-200 shadow-sm text-[10px] sm:text-xs font-medium text-gray-800 border-l-2 sm:border-l-4 border-l-orange-500">
                         <div className="flex justify-between mb-1 sm:mb-2"><span className="text-[8px] sm:text-[9px] bg-blue-50 text-blue-600 px-1 rounded">Backend</span></div>
                         <span className="truncate block">Database Schema Design</span>
                      </div>
                      <div className="bg-white p-2 sm:p-3 rounded-lg border border-orange-200 shadow-sm text-[10px] sm:text-xs font-medium text-gray-800 border-l-2 sm:border-l-4 border-l-orange-500 truncate">
                         UI Wireframing
                      </div>
                   </div>

                   {/* Column 3 */}
                   <div className="bg-gray-100/50 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 flex flex-col gap-1.5 sm:gap-3 opacity-60 min-w-0">
                      <div className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Done</div>
                      <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200 text-[10px] sm:text-xs text-gray-400 line-through truncate">
                         Requirement Gathering
                      </div>
                   </div>
                </div>
              </>
            )}

            {/* STEP 2: BUILD (Code Editor Look) */}
            {step === 1 && (
              <div className="h-full flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-stretch sm:items-center min-w-0">
                 {/* Visual Stats */}
                 <div className="w-full sm:w-1/3 space-y-2 sm:space-y-4 flex-shrink-0">
                    <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                       <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <div className="p-1.5 sm:p-2 bg-blue-50 rounded text-blue-500"><FiLayout className="w-3 h-3 sm:w-4 sm:h-4" /></div>
                          <div className="min-w-0">
                             <div className="text-[10px] sm:text-xs font-bold text-gray-800">Frontend</div>
                             <div className="text-[8px] sm:text-[10px] text-gray-400">React + Next.js</div>
                          </div>
                       </div>
                       <div className="h-1 sm:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[90%]" />
                       </div>
                    </div>
                    
                    <div className="bg-white p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border border-gray-100 shadow-sm">
                       <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                          <div className="p-1.5 sm:p-2 bg-green-50 rounded text-green-500"><FiServer className="w-3 h-3 sm:w-4 sm:h-4" /></div>
                          <div className="min-w-0">
                             <div className="text-[10px] sm:text-xs font-bold text-gray-800">Backend API</div>
                             <div className="text-[8px] sm:text-[10px] text-gray-400">Node.js + GraphQL</div>
                          </div>
                       </div>
                       <div className="h-1 sm:h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-[80%]" />
                       </div>
                    </div>
                 </div>

                 {/* Mock Editor */}
                 <div className="flex-1 bg-[#1E1E1E] rounded-lg sm:rounded-xl shadow-lg border border-gray-700 p-2 sm:p-3 md:p-4 font-mono text-[9px] sm:text-[10px] md:text-xs text-gray-300 relative overflow-hidden group min-w-0">
                    <div className="flex gap-1 sm:gap-1.5 mb-2 sm:mb-4 opacity-50">
                       <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500"/>
                       <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500"/>
                       <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500"/>
                    </div>
                    <div className="space-y-0.5 sm:space-y-1 overflow-x-auto">
                       <p className="whitespace-nowrap"><span className="text-purple-400">const</span> <span className="text-blue-400">initCustomModule</span> = <span className="text-yellow-300">async</span> () ={">"} {"{"}</p>
                       <p className="pl-2 sm:pl-4 whitespace-nowrap"><span className="text-gray-500">// Custom logic tailored to business needs</span></p>
                       <p className="pl-2 sm:pl-4 whitespace-nowrap"><span className="text-purple-400">await</span> <span className="text-blue-300">database</span>.<span className="text-yellow-300">connect</span>();</p>
                       <p className="pl-2 sm:pl-4 whitespace-nowrap"><span className="text-purple-400">return</span> <span className="text-green-400">"Module Ready"</span>;</p>
                       <p className="whitespace-nowrap">{"}"};</p>
                    </div>
                    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-green-900/30 text-green-400 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[8px] sm:text-[10px] border border-green-800">
                       Compiling...
                    </div>
                 </div>
              </div>
            )}

            {/* STEP 3: INTEGRATIONS (Node Graph Look) */}
            {step === 2 && (
              <div className="h-full flex flex-col items-center justify-center relative py-2 overflow-hidden">
                 <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
                 
                 <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-4 md:gap-8 flex-wrap">
                    {/* External Nodes */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-4 md:gap-8">
                       <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm flex items-center gap-1.5 sm:gap-2 w-24 sm:w-28 md:w-32 animate-pulse flex-shrink-0">
                          <FaStripe className="text-[#635BFF] w-4 h-4 sm:w-5 sm:h-5" /> <span className="text-[10px] sm:text-xs font-bold text-gray-600">Payment</span>
                       </div>
                       <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm flex items-center gap-1.5 sm:gap-2 w-24 sm:w-28 md:w-32 animate-pulse delay-100 flex-shrink-0">
                          <FaAws className="text-[#FF9900] w-4 h-4 sm:w-5 sm:h-5" /> <span className="text-[10px] sm:text-xs font-bold text-gray-600">Storage</span>
                       </div>
                    </div>

                    {/* Connection Lines - hidden on very small */}
                    <div className="hidden sm:block h-16 sm:h-24 md:h-32 w-8 md:w-16 border-l-2 border-t-2 border-b-2 border-gray-300 rounded-l-xl opacity-50 flex-shrink-0" />

                    {/* Central Core */}
                    <div className="bg-white p-3 sm:p-4 md:p-6 rounded-full border-2 sm:border-4 border-orange-100 shadow-xl z-20 flex-shrink-0">
                       <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs sm:text-sm md:text-base font-bold shadow-lg">
                          API
                       </div>
                    </div>

                    <div className="hidden sm:block h-16 sm:h-24 md:h-32 w-8 md:w-16 border-r-2 border-t-2 border-b-2 border-gray-300 rounded-r-xl opacity-50 flex-shrink-0" />

                    {/* External Nodes */}
                    <div className="flex flex-row sm:flex-col gap-2 sm:gap-4 md:gap-8">
                       <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm flex items-center gap-1.5 sm:gap-2 w-24 sm:w-28 md:w-32 animate-pulse delay-200 flex-shrink-0">
                          <FiDatabase className="text-blue-500 w-4 h-4 sm:w-5 sm:h-5" /> <span className="text-[10px] sm:text-xs font-bold text-gray-600">CRM Data</span>
                       </div>
                       <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl border border-gray-200 shadow-sm flex items-center gap-1.5 sm:gap-2 w-24 sm:w-28 md:w-32 animate-pulse delay-300 flex-shrink-0">
                          <FaDocker className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5" /> <span className="text-[10px] sm:text-xs font-bold text-gray-600">Container</span>
                       </div>
                    </div>
                 </div>
                 
                 <div className="mt-3 sm:mt-6 md:mt-8 text-center bg-white/80 backdrop-blur px-2 sm:px-4 py-1 rounded-full border border-gray-100 shadow-sm z-10">
                    <span className="text-[9px] sm:text-[10px] md:text-xs text-green-600 font-medium flex items-center gap-1.5 sm:gap-2">
                       <FiCheckCircle className="w-3 h-3 flex-shrink-0" /> All systems connected securely
                    </span>
                 </div>
              </div>
            )}

            {/* STEP 4: DELIVERY (Success State) */}
            {step === 3 && (
              <div className="h-full flex flex-col items-center justify-center text-center py-2">
                 <div className="h-14 w-14 sm:h-16 sm:w-16 md:h-24 md:w-24 bg-green-50 rounded-full flex items-center justify-center mb-3 sm:mb-6 relative">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-30" />
                    <FiBox className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-green-600 relative z-10" />
                    <div className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 bg-white p-1 sm:p-1.5 rounded-full shadow-md">
                       <FiCheckCircle className="text-green-500 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                 </div>

                 <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">Ready for Launch</h3>
                 <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 max-w-sm mb-3 sm:mb-6 px-2">
                    Your custom solution has passed all QA checks and is deployed to the production environment.
                 </p>

                 <div className="flex gap-2 sm:gap-3">
                    <div className="flex flex-col items-center p-2 sm:p-3 bg-white border border-gray-100 rounded-lg shadow-sm w-16 sm:w-20 md:w-24">
                       <span className="text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Speed</span>
                       <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800">98/100</span>
                    </div>
                    <div className="flex flex-col items-center p-2 sm:p-3 bg-white border border-gray-100 rounded-lg shadow-sm w-16 sm:w-20 md:w-24">
                       <span className="text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">SEO</span>
                       <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800">100/100</span>
                    </div>
                    <div className="flex flex-col items-center p-2 sm:p-3 bg-white border border-gray-100 rounded-lg shadow-sm w-16 sm:w-20 md:w-24">
                       <span className="text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider font-bold">Secure</span>
                       <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800">A+</span>
                    </div>
                 </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}