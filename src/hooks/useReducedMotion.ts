"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns true when the user has requested reduced motion.
 * Uses useSyncExternalStore so SSR gets a stable `false` snapshot
 * and the client subscribes to live media-query changes — no setState
 * called inside effects, no hydration mismatch.
 */

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
