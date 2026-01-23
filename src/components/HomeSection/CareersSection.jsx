'use client';

import { useState, useEffect, useCallback } from 'react'; // 1. Hooks add kiye
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import aboutData from '@/components/data/about.json';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CareersSection() {
  const { careers } = aboutData;
  const careerImages = careers?.images || [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [headerRef, headerVisible] = useScrollAnimation();
  const [carouselRef, carouselVisible] = useScrollAnimation({ threshold: 0.1 });

  // 2. nextSlide ko useCallback mein wrap kiya taaki interval sahi se chale
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
      className="relative w-full bg-white py-20 lg:py-32 overflow-x-hidden overflow-y-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      aria-labelledby="careers-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6 overflow-x-hidden overflow-y-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Header Section - Two Column Layout */}
        <div 
          ref={headerRef}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16 transition-all duration-700 ease-out ${
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
              className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900"
            >
              {careers?.title || 'Careers'}
            </h2>
          </div>

          {/* Right Side - Paragraphs */}
          <div className={`space-y-4 lg:space-y-6 transition-all duration-700 ease-out ${
            headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
          }`}
          style={{ transitionDelay: '200ms' }}
          >
            {careers?.description && Array.isArray(careers.description) ? (
              careers.description.map((paragraph, index) => (
                <p key={index} className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))
            ) : (
              <>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
                  At Sukrut, we believe that making a difference is a team effort that spans across our customers, colleagues, and communities.
                </p>
                <p className="text-base lg:text-lg text-gray-700 leading-relaxed">
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
          <div className="relative overflow-hidden -ml-6 mr-0" style={{ width: 'calc(100vw - 48px)', maxWidth: '100vw' }}>
            {/* Images Container - Show multiple images side by side */}
            <div 
              className="flex gap-4 lg:gap-6 transition-transform duration-500 ease-in-out"
              style={{ 
                transform: `translateX(calc(24px - ${currentSlide * (360 / careerImages.length)}vw - ${currentSlide * 1.5}rem))`
              }}
            >
              {careerImages.map((image, index) => {
                const imageWidth = `${360 / careerImages.length}vw`;
                
                return (
                  <div
                    key={image.id}
                    className="flex-shrink-0 relative aspect-[16/10]"
                    style={{ width: imageWidth }}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="120vw"
                    />
                  </div>
                );
              })}
            </div>

          </div>

          {/* Pagination Dots and Navigation Arrows - Same row */}
          <div className="flex justify-between items-center mt-6 lg:mt-8">
            {/* Pagination Dots - Left side */}
            <div className="flex items-center gap-2">
              {careerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    index === currentSlide
                      ? 'w-3 h-3 bg-[#E39A2E]'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows - Right side */}
            <div className="flex items-center gap-3">
              <button
                onClick={prevSlide}
                className="text-gray-800 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="text-gray-800 hover:text-gray-900 transition-colors duration-200 cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}