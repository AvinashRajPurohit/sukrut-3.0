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

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className={`text-center mb-16 lg:mb-20 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerVisible ? 'opacity-100 translate-y-0 scale-100 blur-0' : 'opacity-0 -translate-y-12 scale-105 blur-md'
          }`}
        >
          <h2
            id="team-heading"
            className={`text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4 transition-all duration-800 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
              headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              transitionDelay: '200ms',
              backgroundSize: '200% auto',
              animation: headerVisible ? 'gradient-shift 3s ease infinite' : 'none'
            }}
          >
            {team.title}
          </h2>
          <p className={`text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto transition-all duration-800 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
          >
            {team.subtitle}
          </p>
        </div>

        {/* Team Members Grid - Responsive: 1 col mobile, 2 cols tablet, 4 cols desktop */}
        <div 
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-7xl mx-auto transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            shouldShowImages ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {team.members.map((member, index) => {
            const positions = [
              { x: '-translate-x-12', y: '-translate-y-8', rotate: '-rotate-6' },
              { x: 'translate-x-12', y: '-translate-y-8', rotate: 'rotate-6' },
              { x: '-translate-x-12', y: 'translate-y-8', rotate: '-rotate-6' },
              { x: 'translate-x-12', y: 'translate-y-8', rotate: 'rotate-6' },
            ];
            const pos = positions[index % 4];
            const floatDelay = index * 0.2;
            const floatDuration = 4 + (index % 2) * 0.5;
            
            return (
              <div
                key={member.id}
                className={`flex flex-col items-center group transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-3 ${
                  gridVisible 
                    ? 'opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0' 
                    : `opacity-0 ${pos.x} ${pos.y} ${pos.rotate} scale-75`
                }`}
                style={{ 
                  transitionDelay: `${index * 80}ms`,
                  animation: gridVisible ? `float ${floatDuration}s ease-in-out infinite` : 'none',
                  animationDelay: `${floatDelay}s`
                }}
              >
                {/* Profile Image Container with Premium Effects */}
                <div className="relative mb-6 w-full flex justify-center">
                  {/* Glow effect - behind the image */}
                  {shouldShowImages && (
                    <div 
                      className="absolute inset-0 rounded-2xl blur-xl pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, rgba(227, 154, 46, 0.3), rgba(227, 154, 46, 0.1))`,
                        animation: `glow-pulse ${3 + index * 0.3}s ease-in-out infinite`,
                        animationDelay: `${floatDelay + 0.5}s`,
                        transform: 'scale(1.1)',
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
                  
                  {/* Profile Image - Perfect Square with rounded corners */}
                  <div 
                    className="relative w-[260px] h-[260px] rounded-2xl overflow-hidden bg-gray-200 border-2 border-white/50 shadow-xl group-hover:shadow-2xl group-hover:border-amber-200/50"
                    style={{ 
                      zIndex: 1,
                      animation: shouldShowImages ? `float-delayed ${floatDuration + 0.3}s ease-in-out infinite` : 'none',
                      animationDelay: `${floatDelay + 0.2}s`,
                    }}
                  >
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      width={260}
                      height={260}
                      className="object-cover transition-transform duration-700 group-hover:scale-110 w-full h-full"
                      priority={index < 4}
                    />
                    {/* Shimmer overlay - on top but transparent until hover */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s infinite',
                        zIndex: 2,
                      }}
                    />
                  </div>
                </div>

                {/* Name */}
                <h3 className={`text-xl lg:text-2xl font-bold text-gray-900 text-center mb-2 transition-all duration-600 ease-out group-hover:text-amber-600 ${
                  shouldShowImages ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 80 + 300}ms` }}
                >
                  {member.name}
                </h3>

                {/* Role */}
                <p className={`text-base lg:text-lg text-gray-600 text-center font-medium transition-all duration-600 ease-out group-hover:text-gray-800 ${
                  shouldShowImages ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 80 + 400}ms` }}
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
