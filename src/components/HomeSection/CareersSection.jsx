'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import aboutData from '@/components/data/about.json';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CareersSection() {
  const { careers } = aboutData;
  const careerImages = careers?.images || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.01 });
  const [carouselRef, carouselVisible] = useScrollAnimation({ threshold: 0.01 });

  // Mobile: 1 large image (~80vw). Desktop: several smaller (36vw each).
  const [carouselLayout, setCarouselLayout] = useState({ vw: 360 / (careerImages.length || 1), gapRem: 1.25 });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => {
      setCarouselLayout(mq.matches
        ? { vw: 80, gapRem: 0.5 }
        : { vw: 360 / (careerImages.length || 1), gapRem: 1.25 }
      );
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [careerImages.length]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % careerImages.length);
  }, [careerImages.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + careerImages.length) % careerImages.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 3. Auto-play logic: Har 3 second mein slide change hogi
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(timer); // Cleanup: Component unmount hone par timer stop
  }, [nextSlide]);

  return (
    <section
      className="relative w-full bg-white py-12 sm:py-16 lg:py-32 overflow-x-hidden"
      aria-labelledby="careers-heading"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        {/* Header Section - Two Column Layout */}
        <div 
          ref={headerRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-10 lg:mb-16 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Left Side - Title */}
          <div className={`transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
          }`}
          style={{ transitionDelay: '100ms' }}
          >
            <h2
              id="careers-heading"
              className="text-xl sm:text-2xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight"
            >
              {careers?.title || 'Life at Sukrut'}
            </h2>
          </div>

          {/* Right Side - Paragraphs */}
          <div className={`space-y-3 sm:space-y-4 lg:space-y-6 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
          }`}
          style={{ transitionDelay: '200ms' }}
          >
            {careers?.description && Array.isArray(careers.description) ? (
              careers.description.map((paragraph, index) => (
                <p key={index} className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  At Sukrut, we believe that making a difference is a team effort that spans across our customers, colleagues, and communities.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                  As a dynamic, fast-growing software engineering company, we are always looking to expand and complement our team with amazing talent from across the globe.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Carousel Section - Full width from left edge to right edge */}
        <div 
          ref={carouselRef}
          className={`relative transition-all duration-700 ease-out ${
            carouselVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Carousel Container - Breaks out to full viewport width */}
          <div className="relative overflow-hidden -ml-4 sm:-ml-6 mr-0 w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] max-w-[100vw]">
            {/* Images Container - 1 large image on mobile, multiple on desktop */}
            <div 
              className="flex gap-3 sm:gap-4 lg:gap-6 transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(calc(16px - ${currentSlide * carouselLayout.vw}vw - ${currentSlide * carouselLayout.gapRem}rem))`
              }}
            >
              {careerImages.map((image) => (
                  <div
                    key={image.id}
                    className="flex-shrink-0 relative aspect-[16/10]"
                    style={{ width: `${carouselLayout.vw}vw` }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 639px) 85vw, 40vw"
                    />
                  </div>
              ))}
            </div>

          </div>

          {/* Pagination Dots and Navigation Arrows - Same row */}
          <div className="flex justify-between items-center gap-3 mt-4 sm:mt-6 lg:mt-8">
            {/* Pagination Dots - Left side, scroll on mobile if needed */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {careerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 transition-all duration-300 rounded-full cursor-pointer ${
                    index === currentSlide
                      ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#E39A2E]'
                      : 'w-2 h-2 sm:w-2 sm:h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows - Right side, larger touch targets on mobile */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              <button
                onClick={prevSlide}
                className="p-2 sm:p-0 -m-2 sm:m-0 text-gray-800 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 sm:p-0 -m-2 sm:m-0 text-gray-800 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}