"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Extra delay in seconds before the animation starts */
  delay?: number;
  /** Vertical offset to animate from (px) */
  y?: number;
  /** Duration in seconds */
  duration?: number;
  /** ScrollTrigger start position, e.g. "top 88%" */
  start?: string;
}

/**
 * Wraps children in a div that fades + slides up when scrolled into view.
 * Passes className straight through so it can replace a layout div.
 * Respects prefers-reduced-motion — skips all GSAP when true.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.65,
  start = "top 88%",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 0, y });
      gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [reduced, delay, y, duration, start]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
