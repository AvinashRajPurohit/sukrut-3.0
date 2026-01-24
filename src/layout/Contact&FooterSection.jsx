"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { FiArrowUpRight } from "react-icons/fi";

export default function ContactFooterSection() {
  return (
    <section className="relative pb-4 text-white overflow-hidden">
      
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

      <div className="relative z-10 mx-auto max-w-[90%] grid grid-cols-1 lg:grid-cols-2 gap-24 pt-10">
        
        {/* LEFT CONTENT */}
        <div>
          {/* PREMIUM BADGE (Dark Mode Version) */}
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 mb-8 cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E39A2E] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E39A2E]"></span>
            </span>
            <span className="text-xs font-bold tracking-widest text-[#E39A2E] uppercase">
              Contact Us
            </span>
          </div>

          <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">
            Let's Engineer <br />
            <span className="text-[#E39A2E]">Your Vision.</span>
          </h2>

          <p className="text-gray-400 max-w-sm mb-12 leading-relaxed text-lg">
            Does your project need our expertise?
            <br />
            Fill out the form to initialize the process.
          </p>

          <div className="space-y-8 text-sm">
            <div className="group flex items-center gap-4 text-gray-300">
              <div className="h-12 w-12 border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#E39A2E] group-hover:text-[#E39A2E] transition-colors">
                <HiOutlineMail className="text-xl" />
              </div>
              <span className="font-mono tracking-wide">SukrutAssociates@gmail.com</span>
            </div>

            <div className="group flex items-center gap-4 text-gray-300">
              <div className="h-12 w-12 border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-[#E39A2E] group-hover:text-[#E39A2E] transition-colors">
                <HiOutlinePhone className="text-xl" />
              </div>
              <span className="font-mono tracking-wide">+91 12345 67890</span>
            </div>
          </div>
        </div>

        {/* RIGHT FORM (Technical Box) */}
        <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 lg:p-10">
          
          {/* Technical Notches */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#E39A2E]/50" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#E39A2E]/50" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#E39A2E]/50" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#E39A2E]/50" />

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Name</label>
              <input
                type="text"
                className="w-full rounded-none bg-black/20 border-b border-white/20 px-4 py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                <input
                  type="email"
                  className="w-full rounded-none bg-black/20 border-b border-white/20 px-4 py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600"
                  placeholder="name@company.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Phone</label>
                <input
                  type="text"
                  className="w-full rounded-none bg-black/20 border-b border-white/20 px-4 py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600"
                  placeholder="+91"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Brief</label>
              <textarea
                rows={4}
                className="w-full rounded-none bg-black/20 border-b border-white/20 px-4 py-4 text-sm text-white outline-none focus:border-[#E39A2E] transition-colors placeholder:text-gray-600 resize-none"
                placeholder="Describe your project requirements..."
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer group">
              <input type="checkbox" className="accent-[#E39A2E] h-4 w-4 rounded-none cursor-pointer" />
              <span className="group-hover:text-white transition-colors">I accept the terms & conditions</span>
            </label>

            <button
              type="submit"
              className="group relative w-full inline-flex items-center justify-center gap-2 bg-[#E39A2E] px-8 py-4 text-sm font-bold text-black uppercase tracking-wider transition-all hover:bg-white cursor-pointer"
            >
              Initialize Request
              <FiArrowUpRight className="text-lg transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative mt-24 border-t border-white/10 pt-12 text-center z-10">
        <div className="flex justify-center items-center gap-3 mb-8">
          <Image
            src="/sukrut_dark_mode_logo.png" 
            alt="Sukrut Logo"
            width={180}
            height={45}
            className="opacity-90"
          />
        </div>

        <div className="flex justify-center gap-8 md:gap-16 text-sm font-medium text-gray-400 uppercase tracking-widest">
          {[
            { label: "About Us", href: "/about" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
            { label: "FAQ", href: "/faq" }
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

        <p className="mt-8 text-xs text-gray-600 font-mono">
          © {new Date().getFullYear()} Sukrut Associates. All systems operational.
        </p>
      </div>
    </section>
  );
}