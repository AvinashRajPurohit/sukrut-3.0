'use client';

import React from 'react';
import Image from 'next/image';
import aboutData from '@/components/data/about.json';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function AboutTeamSection() {
  const { team } = aboutData;
  const [headerRef, headerVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation({ threshold: 0.05 });
  
  // Fallback: ensure images are visible after component mounts
  const [imagesVisible, setImagesVisible] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setImagesVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const shouldShowImages = gridVisible || imagesVisible;

  return (
    <section
      className="relative w-full bg-gradient-to-b from-white via-gray-50/50 to-white py-20 lg:py-32 overflow-hidden"
      aria-labelledby="team-heading"
    >
      {/* Premium background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-200/30 via-amber-100/20 to-transparent rounded-full blur-3xl animate-float-slow"
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-amber-200/30 via-amber-100/20 to-transparent rounded-full blur-3xl animate-float-slow"
          style={{ animationDuration: '10s', animationDelay: '2s' }}
        />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 lg:mb-20 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2
            id="team-heading"
            className={`text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 mb-4 transition-all duration-700 ease-out ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ 
              transitionDelay: '150ms',
              lineHeight: '1.1',
              paddingBottom: '0.25rem'
            }}
          >
            {team.title}
          </h2>
          <p className={`text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '300ms' }}
          >
            {team.subtitle}
          </p>
        </div>

        {/* Team Members Grid - Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div 
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mx-auto transition-all duration-700 ease-out ${
            shouldShowImages ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {team.members.map((member, index) => {
            const floatDelay = index * 0.15;
            const floatDuration = 6 + (index % 2) * 0.5;
            
            return (
              <div
                key={member.id}
                className={`flex flex-col items-center group transition-all duration-500 ease-out hover:-translate-y-1 ${
                  gridVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: `${index * 60}ms`,
                  animation: gridVisible ? `float-delayed ${floatDuration}s ease-in-out infinite` : 'none',
                  animationDelay: `${floatDelay}s`
                }}
              >
                {/* Profile Image Container with Premium Effects */}
                <div className="relative mb-6 w-full flex justify-center">
                  {/* Subtle glow effect */}
                  {shouldShowImages && (
                    <div 
                      className="absolute inset-0 rounded-2xl blur-2xl pointer-events-none opacity-60"
                      style={{
                        background: `radial-gradient(circle, rgba(227, 154, 46, 0.15) 0%, transparent 70%)`,
                        animation: `glow-pulse ${4 + index * 0.2}s ease-in-out infinite`,
                        animationDelay: `${floatDelay + 0.3}s`,
                        zIndex: 0,
                        width: '260px',
                        height: '260px',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-130px',
                        marginTop: '-130px',
                      }}
                    />
                  )}
                  
                  {/* Profile Image */}
                  <div 
                    className="relative w-[260px] h-[260px] rounded-2xl overflow-hidden bg-gray-200 border-2 border-white/50 shadow-lg group-hover:shadow-xl transition-all duration-500"
                    style={{ 
                      zIndex: 1,
                      opacity: shouldShowImages ? 1 : 0,
                      transform: shouldShowImages ? 'scale(1)' : 'scale(0.95)',
                      transition: 'all 600ms ease-out',
                    }}
                  >
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      width={260}
                      height={260}
                      className="object-cover transition-transform duration-500 group-hover:scale-105 w-full h-full"
                      priority={index < 4}
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className={`text-xl lg:text-2xl font-semibold text-gray-900 text-center mb-2 transition-all duration-500 ease-out group-hover:text-gray-800 ${
                  shouldShowImages ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 60 + 200}ms` }}
                >
                  {member.name}
                </h3>

                {/* Role */}
                <p className={`text-base lg:text-lg text-gray-600 text-center transition-all duration-500 ease-out ${
                  shouldShowImages ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 60 + 250}ms` }}
                >
                  {member.role}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
