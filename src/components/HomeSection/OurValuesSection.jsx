'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const values = [
  {
    id: 1,
    name: 'We are Collaborative',
    description: 'We build strong partnerships with our clients, working together to create solutions that truly fit their needs and grow with their vision.'
  },
  {
    id: 2,
    name: 'We are Passionate',
    description: 'We care deeply about what we build. Our success is measured by the real-world impact we create, not just the features we ship.'
  },
  {
    id: 3,
    name: 'We are Humble',
    description: 'We know there\'s always more to learn. We stay curious, adapt quickly, and approach every challenge with an open mind.'
  },
  {
    id: 4,
    name: 'We are Innovative',
    description: 'We explore cutting-edge technologies and creative approaches, building solutions that push boundaries and set new standards.'
  },
  {
    id: 5,
    name: 'We have Integrity',
    description: 'We build for the long term. Every decision we make considers not just today\'s needs, but how systems will evolve and scale over time.'
  }
];

export default function OurValuesSection() {
  const [containerRef, containerVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="relative w-full bg-black py-16 lg:py-32"
      aria-labelledby="values-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div 
          ref={containerRef}
          className={`relative bg-[#1A1A1A] border border-[#333333] p-6 sm:p-8 lg:p-12 transition-all duration-700 ease-out ${
            containerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Decorative dotted pattern background */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Decorative border lines */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#333333]" />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#333333]" />
          <div className="absolute top-0 bottom-0 left-0 w-0.5 bg-[#333333]" />
          <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-[#333333]" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Side - Title */}
            <div className={`transition-all duration-700 ease-out ${
              containerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
            }`}
            style={{ transitionDelay: '100ms' }}
            >
              <h2
                id="values-heading"
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight"
              >
                Our Values
              </h2>
            </div>

            {/* Right Side - Values List */}
            <div className={`space-y-4 sm:space-y-6 transition-all duration-700 ease-out ${
              containerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
            }`}
            style={{ transitionDelay: '200ms' }}
            >
              {values.map((value, index) => (
                <div
                  key={value.id}
                  className={`transition-all duration-700 ease-out ${
                    containerVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  {/* Value Item */}
                  <div className="flex items-start gap-4">
                    {/* Primary color asterisk/bullet */}
                    <span className="text-[#E39A2E] text-xl font-bold mt-1">*</span>
                    
                    <div className="flex-1">
                      {/* Value Name */}
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2">
                        {value.name}
                      </h3>
                      
                      {/* Value Description */}
                      <p className="text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>

                  {/* Separator line - only show between items */}
                  {index < values.length - 1 && (
                    <div className="mt-4 sm:mt-6 h-px bg-gray-700" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
