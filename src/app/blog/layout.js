'use client';

import { useEffect } from 'react';

export default function BlogLayout({ children }) {
  useEffect(() => {
    // Force light mode by removing dark class from html
    const html = document.documentElement;
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
    
    // Prevent dark mode from being applied
    const observer = new MutationObserver(() => {
      if (html.classList.contains('dark')) {
        html.classList.remove('dark');
      }
    });
    
    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="blog-light-mode" suppressHydrationWarning>
      {children}
    </div>
  );
}
