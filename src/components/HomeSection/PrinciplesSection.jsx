'use client';

import { User, Heart, CheckCircle } from 'lucide-react';
import aboutData from '@/components/data/about.json';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const iconMap = {
  User: User,
  Heart: Heart,
  CheckCircle: CheckCircle,
};

export default function PrinciplesSection() {
  const { principles } = aboutData;
  const [headerRef, headerVisible] = useScrollAnimation();
  const [cardsRef, cardsVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="relative w-full bg-white py-20 lg:py-32"
      aria-labelledby="principles-heading"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-20 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left Side - Title */}
          <div className={`transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
          }`}
          style={{ transitionDelay: '150ms' }}
          >
            <h2
              id="principles-heading"
              className="text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 leading-tight"
            >
              {principles.title.split('\n').map((line, i) => (
                <span 
                  key={i} 
                  className={`block transition-all duration-600 ease-out ${
                    headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${200 + i * 80}ms` }}
                >
                  {line}
                </span>
              ))}
            </h2>
          </div>

          {/* Right Side - Description */}
          <div className={`flex items-center transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
          }`}
          style={{ transitionDelay: '250ms' }}
          >
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
              {principles.description}
            </p>
          </div>
        </div>

        {/* Principles Cards */}
        <div 
          ref={cardsRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 transition-all duration-700 ease-out ${
            cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {principles.items.map((principle, index) => {
            const IconComponent = iconMap[principle.icon] || User;
            return (
              <div
                key={principle.id}
                className={`bg-white border border-gray-200 rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-md transition-all duration-500 ease-out hover:-translate-y-1 ${
                  cardsVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className={`w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center mb-6 transition-all duration-600 ease-out ${
                  cardsVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100 + 150}ms` }}
                >
                  <IconComponent className="w-8 h-8 text-gray-300" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {principle.title}
                </h3>

                {/* Description */}
                <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
