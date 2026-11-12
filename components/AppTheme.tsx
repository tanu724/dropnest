
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AppTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const isLandingPage = pathname === "/";
    document.body.classList.toggle("dropnest-app-page", !isLandingPage);

    return () => {
      document.body.classList.remove("dropnest-app-page");
    };
  }, [pathname]);

  return null;
}
