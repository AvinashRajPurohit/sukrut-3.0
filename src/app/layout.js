import "./globals.css";
import ConditionalHeader from "@/components/shared/ConditionalHeader";
import ContactFooterSection from "@/layout/Contact&FooterSection";
import { Plus_Jakarta_Sans } from 'next/font/google';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata = {
  title: "Sukrut Associates",
  description: "Engineering scalable digital systems",
  icons: {
    icon: "/sukrut_dark_mode_without_text_logo.png",
    apple: "/sukrut_dark_mode_without_text_logo.png",
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('attendance-theme');
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const initialTheme = theme || systemTheme;
                  const html = document.documentElement;
                  
                  // CRITICAL: Set dark class before any styles load
                  if (initialTheme === 'dark') {
                    html.classList.add('dark');
                  } else {
                    html.classList.remove('dark');
                  }
                  html.setAttribute('data-theme', initialTheme);
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={plusJakartaSans.className}>
        <ConditionalHeader />
        {children}
        <ContactFooterSection />
      </body>
    </html>
  );
}
