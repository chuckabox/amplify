"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface Lane {
  share: number;
  tier: 1 | 2 | 3;
  name: string;
  detail: string;
}

const BG = {
  1: "var(--tier-1)",
  2: "var(--tier-2)",
  3: "var(--tier-3)",
} as const;

const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

export function TierSplit({
  lanes,
  className,
}: {
  lanes: Lane[];
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      {/* Stacked bar */}
      <div
        className="flex h-14 w-full overflow-hidden rounded-[4px]"
        role="img"
        aria-label={lanes
          .map((l) => `${Math.round(l.share * 100)}% ${l.name}`)
          .join(", ")}
        onMouseLeave={() => setHovered(null)}
      >
        {lanes.map((lane, i) => (
          <motion.div
            key={lane.tier}
            className="flex items-center justify-center text-sm font-semibold text-white cursor-default transition-opacity duration-200"
            style={{
              backgroundColor: BG[lane.tier],
              opacity: hovered === null ? 1 : hovered === i ? 1 : 0.35,
            }}
            onMouseEnter={() => setHovered(i)}
            initial={reduced ? { width: `${lane.share * 100}%` } : { width: 0 }}
            whileInView={{ width: `${lane.share * 100}%` }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
          >
            {Math.round(lane.share * 100)}%
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="grid gap-6 sm:grid-cols-3"
        onMouseLeave={() => setHovered(null)}
      >
        {lanes.map((lane, i) => (
          <motion.div
            key={lane.tier}
            className="flex gap-3 cursor-default"
            onMouseEnter={() => setHovered(i)}
            style={{
              opacity: hovered === null ? 1 : hovered === i ? 1 : 0.35,
              transition: "opacity 200ms",
            }}
            initial={reduced ? undefined : { y: 12 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: EASE }}
          >
            <span
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-[1px]"
              style={{ background: BG[lane.tier] }}
              aria-hidden
            />
            <div>
              <p className="text-[0.9375rem] font-semibold">{lane.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                {lane.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
