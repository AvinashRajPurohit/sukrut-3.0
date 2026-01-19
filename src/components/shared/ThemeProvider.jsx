'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read theme from DOM (set by blocking script) or localStorage
    const html = document.documentElement;
    const hasDarkClass = html.classList.contains('dark');
    const savedTheme = localStorage.getItem('attendance-theme');
    
    // Determine initial theme
    let initialTheme = 'light';
    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (hasDarkClass) {
      initialTheme = 'dark';
    } else {
      // Fallback to system preference
      initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Ensure DOM is in sync
    html.setAttribute('data-theme', initialTheme);
    if (initialTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    setTheme(initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    
    // Update DOM immediately - this is critical for Tailwind dark mode
    if (newTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    html.setAttribute('data-theme', newTheme);
    
    // Update state and localStorage
    setTheme(newTheme);
    localStorage.setItem('attendance-theme', newTheme);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
