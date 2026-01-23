'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Linkedin } from 'lucide-react';
import aboutData from '@/components/data/about.json';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function MeetTheTeamSection() {
  const { team } = aboutData;
  const teamMembers = team.members || [];
  const [headerRef, headerVisible] = useScrollAnimation();
  const [gridRef, gridVisible] = useScrollAnimation({ threshold: 0.1 });
  const [openBioId, setOpenBioId] = useState(null);
  const cardRefs = useRef({});
  const sectionRef = useRef(null);

  const toggleBio = (memberId) => {
    setOpenBioId(openBioId === memberId ? null : memberId);
  };

  // Close bio when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openBioId !== null) {
        const cardElement = cardRefs.current[openBioId];
        if (cardElement && !cardElement.contains(event.target)) {
          setOpenBioId(null);
        }
      }
    };

    if (openBioId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openBioId]);

  // Close bio when scrolling to next section
  useEffect(() => {
    const handleScroll = () => {
      if (openBioId !== null && sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        // Check if section is out of viewport (scrolled past)
        const isOutOfView = rect.bottom < 0 || rect.top > window.innerHeight;
        
        if (isOutOfView) {
          setOpenBioId(null);
        }
      }
    };

    if (openBioId !== null) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('wheel', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
    };
  }, [openBioId]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-gray-100 py-20 lg:py-32"
      aria-labelledby="meet-team-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header Section */}
        <div 
          ref={headerRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:mb-20 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left Side - Heading */}
          <div className={`transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
          }`}
          style={{ transitionDelay: '100ms' }}
          >
            <h3 className="text-lg lg:text-xl font-medium text-[#E39A2E] mb-4 uppercase tracking-wide">
              Meet the team
            </h3>
                  <h2
                    id="meet-team-heading"
                    className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
                  >
                    Built by a diverse, mission-driven team
                  </h2>
          </div>

          {/* Right Side - Description */}
          <div className={`flex items-center transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
          }`}
          style={{ transitionDelay: '200ms' }}
          >
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              {team.subtitle || 'Our experts in software engineering, system architecture, and digital solutions are dedicated to building scalable technology infrastructure that powers business growth.'}
            </p>
          </div>
        </div>

        {/* Team Members Grid */}
        <div 
          ref={gridRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 transition-all duration-700 ease-out ${
            gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              ref={(el) => (cardRefs.current[member.id] = el)}
              className={`group flex flex-col bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-out relative ${
                gridVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Profile Image - Shorter Portrait Ratio */}
              <div className="relative w-full aspect-[7/8] overflow-hidden bg-gray-200">
                <Image
                  src={member.image}
                  alt={`${member.name} - ${member.role}`}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>

              {/* White Info Section */}
              <div className="bg-white p-5 lg:p-6 relative">
                {/* Name and LinkedIn Icon - Justify Between */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                    {member.name}
                  </h3>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#E39A2E] transition-colors flex-shrink-0"
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>
                
                {/* Role */}
                <p className="text-sm lg:text-base text-gray-600">
                  {member.role}
                </p>

                {/* Toggle Bio Button - Transforms from Show to Hide */}
                <button
                  onClick={() => toggleBio(member.id)}
                  className={`absolute bottom-5 right-5 lg:bottom-6 lg:right-6 bg-black text-white text-xs lg:text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 ease-out hover:bg-gray-800 cursor-pointer z-20 ${
                    openBioId === member.id
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0'
                  }`}
                  aria-label={openBioId === member.id ? `Hide bio for ${member.name}` : `Show bio for ${member.name}`}
                >
                  <span className="relative inline-block min-w-[90px] text-center">
                    <span 
                      className={`absolute inset-0 flex items-center justify-center gap-1 transition-opacity duration-300 ease-out ${
                        openBioId === member.id ? 'opacity-0' : 'opacity-100'
                      }`}
                    >
                      <span>+</span>
                      <span>Show Bio</span>
                    </span>
                    <span 
                      className={`flex items-center justify-center gap-1 transition-opacity duration-300 ease-out ${
                        openBioId === member.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <span>×</span>
                      <span>Hide Bio</span>
                    </span>
                  </span>
                </button>
              </div>

              {/* Bio Overlay - Covers about 70% from bottom */}
              <div 
                className={`absolute bottom-0 left-0 right-0 h-[70%] bg-white p-5 lg:p-6 overflow-hidden flex flex-col z-10 group/bio transition-all duration-300 ease-out ${
                  openBioId === member.id 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-full pointer-events-none'
                }`}
              >
                  {/* Name and LinkedIn Icon - Justify Between */}
                  <div className="flex items-start justify-between gap-2 mb-2 flex-shrink-0">
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                      {member.name}
                    </h3>
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-[#E39A2E] transition-colors flex-shrink-0"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                  
                  {/* Role */}
                  <p className="text-sm lg:text-base text-gray-600 mb-4 flex-shrink-0">
                    {member.role}
                  </p>

                  {/* Scrollable Bio Container - No Scrollbar */}
                  <div 
                    className="relative flex-1 overflow-y-auto pr-2 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  >
                    <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                      {member.bio}
                    </p>
                    {/* Fade-out gradient at bottom */}
                    <div className="sticky bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                  </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
