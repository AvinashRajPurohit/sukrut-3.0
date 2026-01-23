'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = false, // Changed to false to allow exit animations
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationTimeout;
    let hasAnimated = false;

    const triggerAnimation = () => {
      if (!hasAnimated) {
        hasAnimated = true;
        // Delay to ensure smooth animation on page load (allows CSS transitions to work)
        animationTimeout = setTimeout(() => {
          setIsVisible(true);
        }, 150);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          triggerAnimation();
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else {
          // Animate out when leaving viewport (only if not triggerOnce)
          if (!triggerOnce) {
            setIsVisible(false);
            hasAnimated = false; // Reset so it can animate in again
          }
        }
      },
      { threshold, rootMargin }
    );

    // Check if element is initially visible and trigger animation smoothly
    requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      
      const isInViewport = 
        rect.top < windowHeight &&
        rect.bottom > 0 &&
        rect.left < windowWidth &&
        rect.right > 0;
      
      if (isInViewport) {
        // Element is in viewport, but still trigger animation smoothly with delay
        triggerAnimation();
      }
      
      // Always observe for scroll events
      observer.observe(element);
    });

    return () => {
      clearTimeout(animationTimeout);
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}
