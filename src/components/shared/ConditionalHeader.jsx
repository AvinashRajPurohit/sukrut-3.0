"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/layout/Header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (pathname.startsWith("/app")) {
    return null;
  }

  return <Header />;
}
