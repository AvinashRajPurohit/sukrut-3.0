'use client';

import menuData from "@/components/data/menu.json";
import MenuAction from "./MenuAction";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-colors duration-200 ease-out ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-[40px] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border-b border-gray-100/60'
            : 'bg-white/75 backdrop-blur-[30px] border-b border-gray-50/40'
        }`}
        role="banner"
      >
        {/* Premium multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_70%)] pointer-events-none" />
        
        {/* Subtle border glow */}
        <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent transition-opacity duration-200 ${isScrolled ? 'opacity-100' : 'opacity-50'}`} />
        
        <div className="relative mx-auto max-w-[1450px] px-6 flex items-center justify-between h-20">
          
          {/* Left Section: Premium Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              prefetch={true}
              aria-label="Go to homepage"
              className="group flex items-center transition-opacity duration-200 hover:opacity-90 active:scale-[0.97]"
            >
              <div className="relative">
                {/* Logo glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-900/0 via-gray-900/10 to-gray-900/0 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                
                <Image
                  src="/sukrut_light_mode_logo.png"   
                  alt="Sukrut logo"
                  width={130}               
                  height={32}
                  priority
                  quality={100}
                  unoptimized
                  className="relative z-10 select-none"
                />
                
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100 -z-10" />
              </div>
            </Link>
          </div>

          {/* Center Section: Desktop Menu */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-8">
            <MenuAction data={menuData} currentPath={pathname} />
          </div>

          {/* Right Section: Ultra Premium CTA */}
          <div className="flex items-center gap-4">
            {/* Desktop Ultra Premium CTA */}
            <Link
              href="/contact"
              prefetch={true}
              className="hidden sm:flex group relative items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-sm font-semibold rounded-full transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              style={{ 
                fontFamily: 'var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif',
                letterSpacing: '0.015em'
              }}
            >
              {/* Multi-layer shimmer effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Border glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm -z-10" />
              
              {/* Content */}
              <span className="relative z-10 flex items-center gap-2.5">
                <Sparkles className="w-3.5 h-3.5 opacity-90 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                <span className="relative">
                  Book a demo
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/60 group-hover:w-full transition-all duration-500" />
                </span>
              </span>
              <ArrowRight className="w-4 h-4 relative z-10 transition-all duration-500 group-hover:translate-x-1.5 group-hover:scale-110" />
            </Link>

            {/* Mobile CTA */}
            <Link
              href="/contact"
              prefetch={true}
              className="sm:hidden px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/25 active:scale-95"
              style={{ fontFamily: 'var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif' }}
            >
              Demo
            </Link>

            {/* Premium Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative p-2.5 rounded-xl text-gray-700 hover:bg-gray-50/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 active:scale-95 group"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              
              <div className="relative w-6 h-6">
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 absolute inset-0 transition-all duration-300 rotate-0 opacity-100" />
                ) : (
                  <Menu className="w-6 h-6 absolute inset-0 transition-all duration-300 rotate-0 opacity-100" />
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Ultra Premium Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-20 z-40 bg-white/98 backdrop-blur-[40px] transition-all duration-500 ease-out ${
          isMobileMenuOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible -translate-y-4'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {/* Multi-layer gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50/40 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.9),transparent_60%)] pointer-events-none" />
        
        {/* Subtle pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(0,0,0) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <nav
          className="relative flex flex-col h-full overflow-y-auto"
          role="navigation"
          aria-label="Mobile navigation"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-8 py-16 space-y-3">
            {menuData.items.map((item, index) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname?.startsWith(item.href));
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group
                    relative
                    block
                    px-6 py-4.5
                    text-base font-semibold
                    rounded-2xl
                    transition-all duration-300 ease-out
                    transform
                    ${
                      isMobileMenuOpen
                        ? 'translate-x-0 opacity-100'
                        : 'translate-x-4 opacity-0'
                    }
                    ${
                      isActive
                        ? 'text-gray-900 bg-gradient-to-r from-gray-50 via-gray-100/80 to-gray-50 shadow-md border border-gray-200/50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50/80 hover:via-gray-50/60 hover:to-gray-50/80 hover:shadow-sm hover:border hover:border-gray-100/50'
                    }
                  `}
                  style={{ 
                    fontFamily: 'var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif',
                    letterSpacing: '0.015em',
                    transitionDelay: isMobileMenuOpen ? `${index * 60}ms` : '0ms'
                  }}
                >
                  {/* Active indicator with gradient */}
                  {isActive && (
                    <span 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-r-full shadow-sm"
                      aria-hidden="true"
                    />
                  )}
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-50/0 via-white/40 to-gray-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Shimmer on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
                  
                  <span className="relative z-10 block transform transition-transform duration-300 group-active:scale-95">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
