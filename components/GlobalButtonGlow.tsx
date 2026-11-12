
"use client";

import { useEffect } from "react";

export default function GlobalButtonGlow() {
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const button = target.closest<HTMLElement>(
        [
          "button",
          '[role="button"]',
          'input[type="button"]',
          'input[type="submit"]',
          'input[type="reset"]',
          "a.premium-button",
          'a[class*="btn"]',
          'a[class*="button"]',
        ].join(",")
      );

      if (!button || button.hasAttribute("disabled")) return;

      const rect = button.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const glow = document.createElement("span");
      glow.className = "dropnest-click-glow";

      const radius = window.getComputedStyle(button).borderRadius;

      glow.style.left = `${rect.left}px`;
      glow.style.top = `${rect.top}px`;
      glow.style.width = `${rect.width}px`;
      glow.style.height = `${rect.height}px`;
      glow.style.borderRadius = radius;

      glow.style.setProperty(
        "--glow-x",
        `${Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100))}%`
      );

      glow.style.setProperty(
        "--glow-y",
        `${Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100))}%`
      );

      document.body.appendChild(glow);

      glow.addEventListener("animationend", () => {
        glow.remove();
      }, { once: true });
    };

    document.addEventListener("click", handleGlobalClick, true);

    return () => {
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, []);

  return null;
}
