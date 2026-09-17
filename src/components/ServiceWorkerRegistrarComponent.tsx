"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistrarComponent() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Offline caching is a progressive enhancement; ignore registration failures.
    });
  }, []);

  return null;
}
