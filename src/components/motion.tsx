"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Variants,
} from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

// Heavy, decelerating curve. Everything in the product eases on this.
const DOCKET_EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

/**
 * A single element that fades and lifts into place as it enters the viewport.
 * Uses IntersectionObserver under the hood (never a scroll listener) and
 * animates transform/opacity/filter only.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.85, delay, ease: DOCKET_EASE }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  shown: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: DOCKET_EASE },
  },
};

/** Cascades its `StaggerItem` children in rather than mounting them at once. */
export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

/** Counts a figure up to its value the first time it scrolls into view. */
export function Ticker({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const text = useTransform(count, (v) =>
    v.toLocaleString("en-AU", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }),
  );

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      count.set(to);
      return;
    }
    const controls = animate(count, to, { duration: 1.3, ease: DOCKET_EASE });
    return () => controls.stop();
  }, [inView, reduced, to, count]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{text}</motion.span>
      {suffix}
    </span>
  );
}
