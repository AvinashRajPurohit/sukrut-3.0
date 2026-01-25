'use client';

import menuData from "@/components/data/menu.json";
import MenuAction from "./MenuAction";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

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
        
        <div className="relative mx-auto max-w-[1450px] px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          
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
                  className="relative z-10 select-none w-[92px] h-auto sm:w-[110px] md:w-[130px]"
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
          <div className="flex items-center gap-3 sm:gap-4">
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

            {/* Workplace Login - Desktop, final nav link */}
            <Link
              href="/app/login"
              prefetch={true}
              className="hidden sm:flex text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Workplace Login
            </Link>

            {/* Mobile CTA - same label as desktop */}
            <Link
              href="/contact"
              prefetch={true}
              className="sm:hidden px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/25 active:scale-95"
              style={{ fontFamily: 'var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif' }}
            >
              Book a demo
            </Link>

            {/* Mobile Menu Button - Animated hamburger, 44px tap target */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl text-gray-700 hover:bg-gray-100/80 active:bg-gray-200/60 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 active:scale-[0.96]"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <div className="relative w-6 h-5 flex items-center justify-center" aria-hidden="true">
                <span className={`absolute left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-out ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'}`} />
                <span className={`h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-out ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
                <span className={`absolute left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-current transition-all duration-300 ease-out ${isMobileMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full-height slide, CTA, safe-area */}
      <div
        className={`lg:hidden fixed inset-0 top-16 sm:top-20 z-40 bg-white/98 backdrop-blur-xl transition-all duration-300 ease-out ${
          isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.9),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(0,0,0) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        <nav className="relative h-full overflow-y-auto px-5 sm:px-8 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom))]" role="navigation" aria-label="Mobile navigation" onClick={(e) => e.stopPropagation()}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-5 px-1">Menu</p>
          <div className="space-y-1.5">
            {menuData.items.map((item, index) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    group relative flex items-center min-h-[48px] px-5 py-3.5
                    text-[15px] font-semibold rounded-xl
                    transition-all duration-300 ease-out
                    ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'}
                    ${isActive
                      ? 'text-gray-900 bg-gray-100/90 border border-gray-200/60'
                      : 'text-gray-700 active:bg-gray-50 border border-transparent'}
                  `}
                  style={{ fontFamily: 'var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif', letterSpacing: '0.02em', transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : '0ms' }}
                >
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gray-900 rounded-r-full" aria-hidden="true" />}
                  <span className="relative">{item.title}</span>
                </Link>
              );
            })}
            {/* Workplace Login - last/final nav link in mobile menu */}
            <Link
              href="/app/login"
              prefetch={true}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`
                group relative flex items-center min-h-[48px] px-5 py-3.5
                text-[15px] font-semibold rounded-xl
                transition-all duration-300 ease-out
                ${isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'}
                text-gray-700 active:bg-gray-50 border border-transparent
              `}
              style={{ fontFamily: 'var(--font-plus-jakarta-sans), ui-sans-serif, system-ui, sans-serif', letterSpacing: '0.02em', transitionDelay: isMobileMenuOpen ? `${menuData.items.length * 50}ms` : '0ms' }}
            >
              <span className="relative">Workplace Login</span>
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
