'use client';

import Image from 'next/image';
import aboutData from '@/components/data/about.json';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function GrowthSection() {
  const { growth } = aboutData;
  const [contentRef, contentVisible] = useScrollAnimation();

  return (
    <section
      className="relative w-full py-20 lg:py-32 overflow-hidden"
      aria-labelledby="growth-heading"
    >
      {/* Light amber/orange gradient background using primary color */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, rgba(227, 154, 46, 0.08), rgba(227, 154, 46, 0.04), rgba(255, 255, 255, 1))'
        }}
      />
      
      <div className="relative mx-auto max-w-7xl px-6">
        <div 
          ref={contentRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center transition-all duration-700 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left Side - Image */}
          <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl transition-all duration-700 ease-out ${
            contentVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '150ms' }}
          >
            <Image
              src={growth.image.src}
              alt={growth.image.alt}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Right Side - Text Content */}
          <div className={`space-y-8 lg:space-y-10 transition-all duration-700 ease-out ${
            contentVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '250ms' }}
          >
            {/* Main Heading */}
            <h2
              id="growth-heading"
              className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 leading-tight"
            >
              {growth.title.split('\n').map((line, i) => (
                <span key={i} className="block">
                  {line}
                </span>
              ))}
            </h2>

            {/* Quote */}
            <div className="space-y-8">
              <blockquote className="relative text-lg lg:text-xl xl:text-2xl text-gray-700 leading-relaxed font-light italic">
                <span className="absolute -left-4 -top-2 text-5xl lg:text-6xl text-gray-300 leading-none font-serif">"</span>
                <span className="relative z-10 pl-6">{growth.quote}</span>
                <span className="text-5xl lg:text-6xl text-gray-300 leading-none font-serif align-top ml-2">"</span>
              </blockquote>

              {/* Attribution */}
              <div className="pt-6 border-t border-gray-200/60">
                <p className="text-xl lg:text-2xl font-semibold text-gray-900 tracking-tight">
                  {growth.author.name}
                </p>
                <p className="text-base lg:text-lg text-gray-600 mt-2 font-medium">
                  {growth.author.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
