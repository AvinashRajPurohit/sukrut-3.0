"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import heroData from "@/components/data/hero.json";
import HeroMockup from "../Mockups/HeroMockup";
import { FiArrowUpRight } from "react-icons/fi";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentRef, contentVisible] = useScrollAnimation({ threshold: 0.1 });
  const [mockupRef, mockupVisible] = useScrollAnimation({ threshold: 0.1 });

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navMapping = {
    "Home": "hero",
    "Focus": "focus",
    "Impact": "impact",
    "Capabilities": "capabilities",
    "Clients": "clients",
    "Workflow": "workflow",
    "Process": "process",
    "Contact": "contact" 
  };

  const totalItems = heroData.sideNav.length;
  // Calculate percentage based on index
  const progressPercentage = (activeIndex / (totalItems - 1)) * 100;

  return (
    <section
      className="relative w-full bg-white py-10 overflow-hidden pt-20 lg:pt-24"
      aria-labelledby="hero-heading"
    >
      {/* Visual Decor: Subtle background glow (Grid Removed) */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-b from-blue-50/50 to-white -z-10 blur-3xl opacity-60" />

      <div className="mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* LEFT SIDE */}
        <div 
          ref={contentRef}
          className={`flex gap-16 pl-6 transition-all duration-700 ease-out ${
            contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}
        >

        
          <div 
            className="relative hidden lg:flex flex-col h-[300px]"
            onMouseLeave={() => setActiveIndex(0)} 
          >
            
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-100 rounded-full" />

            {/* 2. THE ACTIVE SNAKE LINE (Orange) */}
            <div 
              className="absolute left-0 top-0 w-[2px] bg-[#E39A2E] rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_#E39A2E]"
              style={{ height: `${progressPercentage}%` }} // Grows from 0% to 100%
            />

            {/* 3. THE GLOWING SPHERE (Centered on Tip) */}
            <div 
              className="absolute left-[1px] z-20 flex items-center justify-center transition-all duration-500 ease-out"
              style={{ 
                top: `${progressPercentage}%`, 
                transform: 'translate(-50%, -50%)', 
                width: '24px',  
                height: '24px' 
              }} 
            >
                {/* Outer Ripple Animation */}
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-40 animate-ping"></span>
                
                {/* White Border Ring */}
                <span className="relative inline-flex rounded-full h-4 w-4 border-[2px] border-[#E39A2E] bg-white shadow-md"></span>
                
                {/* Inner Solid Core */}
                <span className="absolute inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
            </div>

            {/* 4. NAV ITEMS */}
            <nav className="flex flex-col justify-between h-full relative z-10"> 
              {heroData.sideNav.map((item, index) => {
                const targetId = navMapping[item] || "hero";
                const isActive = index === activeIndex;

                return (
                  <div 
                    key={item}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => scrollToSection(targetId)}
                    className="group relative flex items-center cursor-pointer pl-10"
                  >
                    {/* Hit Area for better UX */}
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-full h-10" />

                    <span 
                      className={`
                        writing-vertical-rl text-[11px] font-bold tracking-widest uppercase select-none
                        transition-all duration-300 transform origin-left
                        ${isActive ? 'text-[#E39A2E] scale-110' : 'text-gray-300 group-hover:text-gray-400'}
                      `}
                    >
                      {item}
                    </span>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Main content (Clean UI - Grid Removed) */}
          <div className="px-4 space-y-6">
            
            {/* Styled Badge */}
            <div className={`inline-flex items-center px-3 py-1 rounded-full bg-orange-50 border border-orange-100 mb-16 shadow-sm shadow-orange-100/50 transition-all duration-700 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
            style={{ transitionDelay: '100ms' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E39A2E] mr-2 animate-pulse" />
              <span className="block text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
                {heroData.badge}
              </span>
            </div>

            <h1
              id="hero-heading"
              className={`text-4xl lg:text-[58px] font-bold leading-[1.1] text-gray-900 tracking-tight transition-all duration-700 ease-out ${
                contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              {heroData.title.split("\n").map((line, i) => (
                <span 
                  key={i} 
                  className={`block transition-all duration-600 ease-out ${
                    contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  {line}
                </span>
              ))}
            </h1>

            <div className={`pl-0 transition-all duration-700 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '500ms' }}
            >
                <p className="max-w-xl text-gray-500 text-lg leading-relaxed font-medium">
                {heroData.description}
                </p>
            </div>

            {/* Button */}
            <div className={`mt-8 transition-all duration-700 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '600ms' }}
            >
              <Link
                href={heroData.cta.href}
                className="
                  inline-flex items-center justify-center 
                  rounded-xl bg-[#E39A2E] text-white 
                  px-8 py-4 text-md font-semibold 
                  shadow-lg shadow-orange-200 
                  transition-all duration-300 
                  hover:bg-[#d68b1d] hover:shadow-orange-300 hover:-translate-y-0.5
                "
              >
                {heroData.cta.label}
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div 
          ref={mockupRef}
          className={`relative flex justify-center items-center transition-all duration-700 ease-out ${
            mockupVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-8 scale-95'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 
                          bg-gradient-to-t from-white to-transparent z-20" />
          <div className="absolute w-[300px] h-[300px] bg-blue-100 rounded-full blur-[80px] -z-10" />
          <HeroMockup />
        </div>
       
      </div>

    </section>
  );
}