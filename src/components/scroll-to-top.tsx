"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    function scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }

    scrollToTop();
    const timer = setTimeout(scrollToTop, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
