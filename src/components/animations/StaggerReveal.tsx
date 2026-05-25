"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Per-item stagger in seconds */
  stagger?: number;
  /** Vertical offset to animate from (px) */
  y?: number;
  /** Duration per item in seconds */
  duration?: number;
  /** ScrollTrigger start position */
  start?: string;
  /** Extra delay before the stagger starts */
  delay?: number;
}

/**
 * Wraps children in a div and staggers the reveal of every direct child
 * when the container scrolls into view.
 * Passes className straight through so it can replace a layout wrapper.
 * Respects prefers-reduced-motion — skips all GSAP when true.
 */
export default function StaggerReveal({
  children,
  className,
  stagger = 0.09,
  y = 26,
  duration = 0.6,
  start = "top 88%",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, y });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [reduced, stagger, y, duration, start, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
