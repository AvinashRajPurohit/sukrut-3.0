'use client';

import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true, // true = animate in only, no exit updates → less scroll lag
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let mounted = true;
    let hasAnimated = false;

    const triggerAnimation = () => {
      if (hasAnimated || !mounted) return;
      hasAnimated = true;
      setIsVisible(true);
      if (triggerOnce && element) observer.unobserve(element);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) triggerAnimation();
        // Skip animate-out when triggerOnce: avoids setState on every scroll exit → less lag
        else if (!triggerOnce) {
          setIsVisible(false);
          hasAnimated = false;
        }
      },
      { threshold, rootMargin }
    );

    requestAnimationFrame(() => {
      if (!element || !mounted) return;
      const rect = element.getBoundingClientRect();
      const inView = rect.top < (window.innerHeight || document.documentElement.clientHeight)
        && rect.bottom > 0 && rect.left < (window.innerWidth || document.documentElement.clientWidth) && rect.right > 0;
      if (inView) triggerAnimation();
      // If triggerOnce and already triggered, skip observe to reduce work
      if (!triggerOnce || !hasAnimated) observer.observe(element);
    });

    return () => {
      mounted = false;
      if (element) observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}
