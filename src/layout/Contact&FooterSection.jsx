"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { FiArrowUpRight } from "react-icons/fi";

export default function ContactFooterSection() {
  return (
    <section className="relative pb-6 sm:pb-4 text-white overflow-hidden">
      
      {/* === 📐 BACKGROUND: DARK TECHNICAL GRID === */}
      {/* Dark gradient base */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#0B0B0B_0%,#0F0E0C_45%,#1a1a1a_100%)] z-0" />
      
      {/* Faded Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[95%] sm:max-w-[90%] px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 pt-8 sm:pt-10">
        
        {/* LEFT CONTENT */}
        <div>
          {/* PREMIUM BADGE (Dark Mode Version) */}
          <div className="inline-flex items-center gap-2 sm:gap-2.5 rounded-full bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5 mb-6 sm:mb-8 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
            </span>
            <span className="text-[10px] sm:text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
              Contact Us
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 tracking-tight leading-tight">
            Let's Engineer <br />
            <span className="text-[#E39A2E]">Your Vision.</span>
          </h2>

          <p className="text-gray-400 max-w-sm mb-8 sm:mb-12 leading-relaxed text-base sm:text-lg">
            Does your project need our expertise?
            <br />
            Fill out the form to initialize the process.
          </p>

          <div className="space-y-4 sm:space-y-6 md:space-y-8 text-sm">
            <div className="group flex items-center gap-3 sm:gap-4 text-gray-300">
              <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#E39A2E] group-hover:text-[#E39A2E] transition-colors">
                <HiOutlineMail className="text-lg sm:text-xl" />
              </div>
              <span className="font-mono text-xs sm:text-sm tracking-wide break-all min-w-0">SukrutAssociates@gmail.com</span>
            </div>

            <div className="group flex items-center gap-3 sm:gap-4 text-gray-300">
              <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#E39A2E] group-hover:text-[#E39A2E] transition-colors">
                <HiOutlinePhone className="text-lg sm:text-xl" />
              </div>
              <span className="font-mono text-xs sm:text-sm tracking-wide">+91 12345 67890</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM (Technical Box) */}
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-4 sm:p-6 md:p-8 lg:p-10">
          
          {/* Technical Notches - smaller on mobile */}
          <div className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-[#E39A2E]/50" />
          <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-[#E39A2E]/50" />
          <div className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-[#E39A2E]/50" />
          <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-[#E39A2E]/50" />

          <form className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Name</label>
              <input
                type="text"
                className="w-full rounded-none bg-black/20 border-b border-white/20 px-3 sm:px-4 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-none bg-black/20 border-b border-white/20 px-3 sm:px-4 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600"
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                <input
                  type="text"
                  className="w-full rounded-none bg-black/20 border-b border-white/20 px-3 sm:px-4 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600"
                  placeholder="+91"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Brief</label>
              <textarea
                rows={4}
                className="w-full rounded-none bg-black/20 border-b border-white/20 px-3 sm:px-4 py-3 sm:py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600 resize-none min-h-[88px] sm:min-h-[100px]"
                placeholder="Describe your project requirements..."
              />
            </div>

            <label className="flex items-start sm:items-center gap-2.5 sm:gap-3 text-xs sm:text-sm text-gray-400 cursor-pointer group">
              <input type="checkbox" className="accent-[#E39A2E] h-4 w-4 mt-0.5 sm:mt-0 shrink-0 rounded-none cursor-pointer" />
              <span className="group-hover:text-white transition-colors">I accept the terms & conditions</span>
            </label>

            <button
              type="submit"
              className="group relative w-full inline-flex items-center justify-center gap-2 bg-[#E39A2E] px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold text-black uppercase tracking-wider transition-all hover:bg-white cursor-pointer"
            >
              Initialize Request
              <FiArrowUpRight className="text-base sm:text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative mt-12 sm:mt-16 lg:mt-24 border-t border-white/10 pt-8 sm:pt-10 lg:pt-12 px-4 text-center z-10">
        <div className="flex justify-center items-center mb-6 sm:mb-8">
          <Image
            src="/sukrut_dark_mode_logo.png"
            alt="Sukrut Logo"
            width={180}
            height={45}
            className="w-28 h-auto sm:w-36 md:w-44 lg:w-[180px] opacity-90"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-16 text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest">
          {[
            { label: "About Us", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
            { label: "Workplace Login", href: "/app/login" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="cursor-pointer transition hover:text-[#E39A2E]"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <p className="mt-6 sm:mt-8 text-[10px] sm:text-xs text-gray-600 font-mono px-2">
          © {new Date().getFullYear()} Sukrut Associates. All systems operational.
        </p>
      </div>
    </section>
  );
}