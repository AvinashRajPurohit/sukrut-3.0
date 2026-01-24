"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ContactFooterSection from "@/layout/Contact&FooterSection";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const isAppRoute = pathname?.startsWith("/app");

  useEffect(() => {
    setMounted(true);
    // Add/remove class on body and html to help with CSS targeting
    if (isAppRoute) {
      document.body.classList.add("app-route");
      document.documentElement.classList.add("app-route");
    } else {
      document.body.classList.remove("app-route");
      document.documentElement.classList.remove("app-route");
    }
    return () => {
      document.body.classList.remove("app-route");
      document.documentElement.classList.remove("app-route");
    };
  }, [isAppRoute]);

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  // Don't render footer on /app routes
  if (isAppRoute) {
    return null;
  }

  return <ContactFooterSection />;
}
