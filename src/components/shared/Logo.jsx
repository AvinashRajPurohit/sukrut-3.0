'use client';

import Image from 'next/image';
import { useTheme } from './ThemeProvider';

export default function Logo({ className = '', width = 140, height = 40, showText = true }) {
  const { theme } = useTheme();
  
  const logoSrc = theme === 'dark' 
    ? (showText ? '/sukrut_dark_mode_logo.png' : '/sukrut_dark_mode_without_text_logo.png')
    : (showText ? '/sukrut_light_mode_logo.png' : '/sukrut_light_mode_without_text_logo.png');

  return (
    <Image
      src={logoSrc}
      alt="Sukrut logo"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}
