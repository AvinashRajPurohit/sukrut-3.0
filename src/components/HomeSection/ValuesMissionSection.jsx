'use client';

import { Target, Eye, Lightbulb, Award, Shield, Users } from 'lucide-react';
import aboutData from '@/components/data/about.json';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const iconMap = {
  'Technical Mastery': Lightbulb,
  'Quality Obsession': Award,
  'Transparent Communication': Shield,
  'Results-Driven Approach': Users,
};

export default function ValuesMissionSection() {
  const { valuesMission } = aboutData;
  const [missionVisionRef, missionVisionVisible] = useScrollAnimation();
  const [valuesHeaderRef, valuesHeaderVisible] = useScrollAnimation();
  const [valuesGridRef, valuesGridVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <section
      className="relative w-full bg-white py-20 lg:py-32"
      aria-labelledby="values-mission-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Mission & Vision */}
        <div 
          ref={missionVisionRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-20 transition-all duration-700 ease-out ${
            missionVisionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Mission */}
          <div className={`bg-white border border-gray-200 rounded-2xl p-8 lg:p-10 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-md ${
            missionVisionVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '150ms' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                <Target className="w-6 h-6 text-gray-100" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                {valuesMission.mission.title}
              </h3>
            </div>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              {valuesMission.mission.description}
            </p>
          </div>

          {/* Vision */}
          <div className={`bg-white border border-gray-200 rounded-2xl p-8 lg:p-10 transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-md ${
            missionVisionVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                <Eye className="w-6 h-6 text-gray-100" />
              </div>
              <h3 className="text-2xl lg:text-3xl font-semibold text-gray-900">
                {valuesMission.vision.title}
              </h3>
            </div>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              {valuesMission.vision.description}
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div>
          <h2
            ref={valuesHeaderRef}
            id="values-mission-heading"
            className={`text-3xl lg:text-4xl font-semibold text-gray-900 text-center mb-12 transition-all duration-700 ease-out ${
              valuesHeaderVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Our Core Values
          </h2>
          <div 
            ref={valuesGridRef}
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 transition-all duration-700 ease-out ${
              valuesGridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {valuesMission.values.map((value, index) => {
              const IconComponent = iconMap[value.title] || Lightbulb;
              return (
                <div
                  key={value.id}
                  className={`bg-white border border-gray-200 rounded-xl p-6 lg:p-8 hover:shadow-md transition-all duration-500 ease-out hover:-translate-y-1 ${
                    valuesGridVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 80}ms` }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center mb-4 transition-all duration-600 ease-out ${
                    valuesGridVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 80 + 100}ms` }}
                  >
                    <IconComponent className="w-6 h-6 text-gray-100" />
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h4>

                  {/* Description */}
                  <p className="text-base text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
