"use client";

import { useEffect } from "react";

export function ApplyTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>("[data-track]");
      if (!target) return;
      const eventType = target.getAttribute("data-track");
      const jobId = target.getAttribute("data-job-id");
      if (!eventType || !jobId) return;

      const payload = JSON.stringify({ jobId, eventType });
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/track", blob);
      } else {
        fetch("/api/track", { method: "POST", body: payload, keepalive: true });
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
