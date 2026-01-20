'use client';

import Link from 'next/link';
import aboutData from '@/components/data/about.json';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CTASection() {
  const { cta } = aboutData;
  const [contentRef, contentVisible] = useScrollAnimation();

  return (
    <section
      className="relative w-full py-20 lg:py-32 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Light amber/orange gradient background using primary color */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(227, 154, 46, 0.08), rgba(227, 154, 46, 0.03), rgba(255, 255, 255, 1))'
        }}
      />
      
      {/* Subtle geometric pattern overlay - parquet/tiled effect with primary color */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 20px,
              rgba(227, 154, 46, 0.08) 20px,
              rgba(227, 154, 46, 0.08) 40px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 20px,
              rgba(227, 154, 46, 0.08) 20px,
              rgba(227, 154, 46, 0.08) 40px
            )
          `,
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6">
        <div 
          ref={contentRef}
          className={`text-center space-y-6 lg:space-y-8 transition-all duration-700 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Main Title */}
          <h2
            id="cta-heading"
            className={`text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 leading-tight transition-all duration-700 ease-out ${
              contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            {cta.title.split('\n').map((line, i) => (
              <span 
                key={i} 
                className={`block transition-all duration-600 ease-out ${
                  contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                {line}
              </span>
            ))}
          </h2>

          {/* Description */}
          <p className={`text-lg lg:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '400ms' }}
          >
            {cta.description}
          </p>

          {/* CTA Button */}
          <div className={`pt-4 transition-all duration-700 ease-out ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ transitionDelay: '500ms' }}
          >
            <Link
              href={cta.button.href}
              className="inline-block px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-medium rounded-lg hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {cta.button.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
