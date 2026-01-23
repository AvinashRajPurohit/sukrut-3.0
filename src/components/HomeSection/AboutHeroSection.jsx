'use client';

import Image from 'next/image';
import { Users } from 'lucide-react';
import aboutData from '@/components/data/about.json';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const iconMap = {
  Users: Users,
};

export default function AboutHeroSection() {
  const { hero } = aboutData;
  const IconComponent = iconMap[hero?.featuredBox?.icon] || Users;
  const [headerRef, headerVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="relative w-full bg-white py-20 lg:py-32"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 lg:mb-24 transition-all duration-700 ease-out ${
            headerVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h1
            id="about-heading"
            className={`text-4xl lg:text-6xl font-semibold text-gray-900 mb-6 transition-all duration-700 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            {hero.title}
          </h1>
          <p className={`text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '300ms' }}
          >
            {hero.description}
          </p>
        </div>

        {/* Grid Layout - Centered featured card spanning 2 rows */}
        <div 
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 auto-rows-fr transition-all duration-700 ease-out ${
            gridVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Top Left Image */}
          <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 transition-all duration-700 ease-out ${
            gridVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '100ms' }}
          >
            <Image
              src={hero.images[0].src}
              alt={hero.images[0].alt}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
            />
          </div>

          {/* Featured Card - Centered, spans 2 rows */}
          <div className={`relative md:row-span-2 rounded-2xl overflow-hidden flex flex-col justify-center p-8 lg:p-12 min-h-[400px] md:min-h-0 transition-all duration-700 ease-out ${
            gridVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
          >
            {/* Premium background with grid pattern */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              }}
            />
            
            {/* Grid pattern overlay */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px, 40px 40px, 8px 8px, 8px 8px',
              }}
            />
            
            {/* Subtle diagonal lines */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 20px,
                    rgba(255, 255, 255, 0.03) 20px,
                    rgba(255, 255, 255, 0.03) 40px
                  )
                `,
              }}
            />

            {/* Content */}
            <div className={`relative z-10 transition-all duration-700 ease-out ${
              gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '300ms' }}
            >
              <div className="mb-6 text-white transition-all duration-600 ease-out">
                <IconComponent className="w-10 h-10 lg:w-12 lg:h-12" />
              </div>
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-white mb-6 leading-tight">
                {hero.featuredBox.title}
              </h2>
              <p className="text-base lg:text-lg text-gray-200 leading-relaxed">
                {hero.featuredBox.description}
              </p>
            </div>
          </div>

          {/* Top Right Image */}
          <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 transition-all duration-700 ease-out ${
            gridVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '150ms' }}
          >
            <Image
              src={hero.images[1].src}
              alt={hero.images[1].alt}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Bottom Left Image */}
          <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 transition-all duration-700 ease-out ${
            gridVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '250ms' }}
          >
            <Image
              src={hero.images[2].src}
              alt={hero.images[2].alt}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          {/* Bottom Right Image */}
          <div className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 transition-all duration-700 ease-out ${
            gridVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
          >
            <Image
              src={hero.images[3].src}
              alt={hero.images[3].alt}
              fill
              className="object-cover transition-transform duration-700 hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
