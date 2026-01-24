'use client';

import Image from 'next/image';
import { Globe } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const highlights = [
  {
    id: 1,
    text: 'Recognized for excellence in software engineering, delivering scalable solutions that power business growth and digital transformation.'
  },
  {
    id: 2,
    text: 'Trusted by businesses worldwide to build robust systems, APIs, and integrations that seamlessly fit into existing workflows and scale with growth.'
  },
  {
    id: 3,
    text: 'Experienced team combining expertise from leading tech companies with a passion for solving real-world challenges through elegant engineering.'
  }
];

export default function WhoWeAreSection() {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [imageRef, imageVisible] = useScrollAnimation({ threshold: 0.1 });
  const [highlightsRef, highlightsVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="relative w-full bg-black text-white py-16 lg:py-32"
      aria-labelledby="who-we-are-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className={`text-center mb-10 lg:mb-16 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            id="who-we-are-heading"
            className={`text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold text-[#E39A2E] mb-4 sm:mb-6 transition-all duration-700 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Who We Are
          </h2>
          <p 
            className={`text-base sm:text-lg lg:text-xl xl:text-2xl text-white max-w-4xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Built by a diverse team of engineers, designers, and strategists, Sukrut specializes in engineering software solutions for real-world scale, helping businesses transform their operations through technology that delivers lasting value.
          </p>
        </div>

        {/* Team Photo - Improved Layout */}
        <div 
          ref={imageRef}
          className={`mb-12 lg:mb-20 transition-all duration-700 ease-out ${
            imageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {/* Premium container with enhanced styling */}
          <div className="relative group">
            {/* Outer decorative border frame */}
            <div className="absolute -inset-1 border border-[#333333]/50 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Main container */}
            <div className="relative border border-[#333333] p-2 lg:p-3 bg-black/50 backdrop-blur-sm">
              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E39A2E]/30 z-10" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#E39A2E]/30 z-10" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#E39A2E]/30 z-10" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E39A2E]/30 z-10" />
              
              {/* Image container - shows full image without cropping */}
              <div className="relative w-full overflow-hidden border border-[#333333] bg-gray-900 flex items-center justify-center min-h-[280px] sm:min-h-[400px] lg:min-h-[500px]">
                <div className="relative w-full h-full">
                  <Image
                    src="/about/who-we-are/Who_We_Are.jpeg"
                    alt="Sukrut team members working together"
                    width={1400}
                    height={800}
                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1400px"
                    quality={90}
                  />
                  
                  {/* Subtle gradient overlay for better image integration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-[1] pointer-events-none" />
                  
                  {/* Subtle vignette effect */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)] z-[1] pointer-events-none" />
                </div>
              </div>
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#E39A2E]/50 to-transparent mt-2 z-10" />
            </div>
            
            {/* Floating shadow effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-[#E39A2E]/5 via-transparent to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
          </div>
        </div>

        {/* Highlights Section - Three Columns */}
        <div 
          ref={highlightsRef}
          className={`relative border border-[#333333] p-6 sm:p-8 lg:p-12 transition-all duration-700 ease-out ${
            highlightsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {/* Decorative lines on border */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#333333]" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333333]" />
          <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-[#333333]" />
          <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-[#333333]" />
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#E39A2E]/20" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#E39A2E]/20" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#E39A2E]/20" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#E39A2E]/20" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12">
            {highlights.map((highlight, index) => (
              <div
                key={highlight.id}
                className={`relative text-center transition-all duration-700 ease-out ${
                  highlightsVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                {/* Vertical divider - only show between items */}
                {index < highlights.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-[#333333]" />
                )}

                {/* Globe Icon */}
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E39A2E]/10 flex items-center justify-center group/icon hover:bg-[#E39A2E]/20 transition-colors duration-300">
                    <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-[#E39A2E] transition-transform duration-300 group-hover/icon:rotate-12" />
                  </div>
                </div>

                {/* Text */}
                <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
                  {highlight.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
