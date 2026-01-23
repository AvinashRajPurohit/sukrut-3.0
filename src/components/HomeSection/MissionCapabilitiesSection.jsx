'use client';

import { Brain, Database, Zap } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const capabilities = [
  {
    id: 1,
    icon: Brain,
    title: 'Custom Software Development',
    description: 'Build scalable applications tailored to your business needs using modern frameworks and best practices.'
  },
  {
    id: 2,
    icon: Database,
    title: 'System Architecture',
    description: 'Design robust, high-performance systems that handle growth and complexity with elegant solutions.'
  },
  {
    id: 3,
    icon: Zap,
    title: 'Seamless Integration',
    description: 'Connect your existing systems and workflows with APIs and integrations that work seamlessly together.'
  }
];

export default function MissionCapabilitiesSection() {
  const [missionRef, missionVisible] = useScrollAnimation();
  const [capabilitiesRef, capabilitiesVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="relative w-full bg-gray-50 py-20 lg:py-32"
      aria-labelledby="mission-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Mission Section */}
        <div 
          ref={missionRef}
          className={`text-center mb-16 lg:mb-20 transition-all duration-700 ease-out ${
            missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2
            id="mission-heading"
            className={`text-3xl lg:text-4xl font-semibold text-[#E39A2E] mb-8 transition-all duration-700 ease-out ${
              missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Our Mission
          </h2>
          <p 
            className={`text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 max-w-5xl mx-auto leading-tight transition-all duration-700 ease-out ${
              missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            Provide the technical foundation upon which businesses can build, scale, and innovate to solve real-world challenges with software that delivers lasting value.
          </p>
        </div>

        {/* Capabilities Section */}
        <div 
          ref={capabilitiesRef}
          className={`bg-white border border-gray-200 rounded-lg p-8 lg:p-12 mb-12 transition-all duration-700 ease-out ${
            capabilitiesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h3 
            className={`text-2xl lg:text-3xl font-semibold text-gray-900 text-center mb-12 transition-all duration-700 ease-out ${
              capabilitiesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            Our core capabilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {capabilities.map((capability, index) => {
              const IconComponent = capability.icon;
              return (
                <div
                  key={capability.id}
                  className={`text-center transition-all duration-700 ease-out ${
                    capabilitiesVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${200 + index * 100}ms` }}
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 flex items-center justify-center">
                      <IconComponent className="w-12 h-12 text-[#E39A2E]" />
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    {capability.title}
                  </h4>

                  {/* Description */}
                  <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                    {capability.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empowerment Statement */}
        <div 
          className={`text-center transition-all duration-700 ease-out ${
            capabilitiesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <p className="text-xl lg:text-2xl font-medium text-gray-900 max-w-4xl mx-auto">
            By making technology accessible and actionable, we empower businesses to solve real-world challenges at scale.
          </p>
        </div>
      </div>
    </section>
  );
}
