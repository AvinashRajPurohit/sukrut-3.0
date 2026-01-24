"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import heroData from "@/components/data/hero.json";
import HeroMockup from "../Mockups/HeroMockup";
import { FiArrowUpRight, FiCheck, FiTrendingUp, FiUsers, FiAward, FiZap } from "react-icons/fi";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import ActivityMockup from "../Mockups/ActivityMockup";

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentRef, contentVisible] = useScrollAnimation({ threshold: 0.1, triggerOnce: true });
  const [mockupRef, mockupVisible] = useScrollAnimation({ threshold: 0.1, triggerOnce: true });

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
      className="relative w-full bg-white py-6 md:py-10 overflow-hidden pt-24 lg:pt-28"
      aria-labelledby="hero-heading"
    >
      {/* Visual Decor: Subtle background glow (Grid Removed) */}
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-b from-blue-50/50 to-white -z-10 blur-3xl opacity-60" />

      <div className="mx-auto px-4 sm:px-6 pb-12 md:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">

        {/* LEFT SIDE */}
        <div 
          ref={contentRef}
          className={`flex gap-8 md:gap-16 pl-0 md:pl-6 transition-all duration-500 ease-out ${
            contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
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

          {/* Main content - Premium Redesign */}
          <div className="px-0 sm:px-4 space-y-5 md:space-y-8">
            
            {/* Premium Badge with Gradient */}
            <div className={`group inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#E39A2E]/10 via-[#E39A2E]/5 to-transparent border border-[#E39A2E]/20 backdrop-blur-sm transition-all duration-500 ease-out hover:border-[#E39A2E]/40 hover:shadow-lg hover:shadow-[#E39A2E]/10 ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
            style={{ transitionDelay: '50ms' }}
            >
              {/* Premium Glow Indicator */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-3 h-3 rounded-full bg-[#E39A2E] opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative w-2 h-2 rounded-full bg-gradient-to-br from-[#E39A2E] to-[#d68b1d] shadow-sm shadow-[#E39A2E]/50" />
              </div>
              <span className="text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
                {heroData.badge}
              </span>
            </div>

            {/* Premium Heading with Gradient Text */}
            <h1
              id="hero-heading"
              className={`text-3xl sm:text-4xl lg:text-[64px] font-extrabold leading-[1.3] tracking-tight transition-all duration-500 ease-out max-w-4xl ${
                contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                {heroData.title}
              </span>
            </h1>

            {/* Premium Description */}
            <div className={`transition-all duration-500 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: '250ms' }}
            >
              <p className="max-w-xl text-gray-600 text-base md:text-lg leading-relaxed font-medium">
                {heroData.description}
              </p>
            </div>

            {/* Premium Stats Grid */}
            {/* <div className={`grid grid-cols-3 gap-4 transition-all duration-500 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '350ms' }}
            > */}
              {/* Stat 1 */}
              {/* <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100/80 backdrop-blur-sm hover:border-[#E39A2E]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#E39A2E]/5">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#E39A2E]/0 via-[#E39A2E]/0 to-[#E39A2E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <FiTrendingUp className="w-4 h-4 text-[#E39A2E]" />
                    <span className="text-2xl font-bold text-gray-900">500+</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Projects</p>
                </div>
              </div> */}

              {/* Stat 2 */}
              {/* <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100/80 backdrop-blur-sm hover:border-[#E39A2E]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#E39A2E]/5">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#E39A2E]/0 via-[#E39A2E]/0 to-[#E39A2E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <FiUsers className="w-4 h-4 text-[#E39A2E]" />
                    <span className="text-2xl font-bold text-gray-900">200+</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Clients</p>
                </div>
              </div> */}

              {/* Stat 3 */}
              {/* <div className="group relative p-4 rounded-2xl bg-gradient-to-br from-white to-gray-50/50 border border-gray-100/80 backdrop-blur-sm hover:border-[#E39A2E]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#E39A2E]/5">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#E39A2E]/0 via-[#E39A2E]/0 to-[#E39A2E]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <FiAward className="w-4 h-4 text-[#E39A2E]" />
                    <span className="text-2xl font-bold text-gray-900">15+</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">Years</p>
                </div>
              </div>
            </div> */}

            {/* Premium Feature Highlights */}
            <div className={`flex flex-wrap gap-2 md:gap-3 transition-all duration-500 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '400ms' }}
            >
              {[
                { icon: FiZap, text: "Scalable Systems" },
                { icon: FiCheck, text: "Enterprise Ready" },
                { icon: FiTrendingUp, text: "Cloud Native" }
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={i}
                    className="group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/60 hover:border-[#E39A2E]/40 hover:bg-gradient-to-r hover:from-[#E39A2E]/5 hover:to-transparent transition-all duration-300"
                  >
                    <Icon className="w-4 h-4 text-[#E39A2E] group-hover:scale-110 transition-transform" />
                    <span className="text-xs md:text-sm font-semibold text-gray-700">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Premium CTA Button */}
            <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 transition-all duration-500 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ transitionDelay: '450ms' }}
            >
              <Link
                href={heroData.cta.href}
                className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E39A2E] to-[#d68b1d] text-white px-6 py-3 md:px-8 md:py-4 text-sm md:text-base font-semibold shadow-lg shadow-[#E39A2E]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#E39A2E]/40 hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span className="relative z-10">{heroData.cta.label}</span>
                <FiArrowUpRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
              
              {/* Trust Badge */}
              <div className="flex items-center justify-center sm:justify-start gap-2 px-3 py-2 md:px-4 rounded-lg bg-gray-50/80 border border-gray-200/60">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-[#E39A2E] to-[#d68b1d] border-2 border-white" />
                  ))}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-600">Trusted by 200+ companies</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div 
          ref={mockupRef}
          className={`relative flex justify-center items-center transition-all duration-500 ease-out ${
            mockupVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <div className="pointer-events-none absolute bottom-0 left-0 w-full h-40 
                          bg-gradient-to-t from-white to-transparent z-20" />
          <HeroMockup />
        </div>
       <ActivityMockup />
      </div>

    </section>
  );
}