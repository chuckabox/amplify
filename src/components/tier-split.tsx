"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/*
  The routing diagram, drawn by hand as an engineering figure rather than
  handed to a charting library — no dependency, and it speaks the same printed
  language as the rest of the product.

  Every submission enters at the top rule, fans out through the sorter, and
  lands in one of three lanes sized to its real share of the portfolio.
*/

export interface Lane {
  share: number; // 0..1
  tier: 1 | 2 | 3;
  count: string;
  name: string;
  detail: string;
}

const INK = {
  1: "var(--tier-1)",
  2: "var(--tier-2)",
  3: "var(--tier-3)",
} as const;

const W = 1000;
const PAD = 20;
const GAP = 8;
const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

export function TierSplit({
  lanes,
  intake,
  className,
}: {
  lanes: Lane[];
  intake: string;
  className?: string;
}) {
  const reduced = useReducedMotion();

  const track = W - PAD * 2 - GAP * (lanes.length - 1);
  const geometry = lanes.map((lane, index) => {
    const width = track * lane.share;
    const previousWidths = lanes
      .slice(0, index)
      .reduce((sum, prevLane) => sum + track * prevLane.share + GAP, 0);
    const x = PAD + previousWidths;
    return { ...lane, x, width, mid: x + width / 2 };
  });

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${W} 250`}
        className="w-full"
        role="img"
        aria-label={`Of ${intake}, ${lanes
          .map((l) => `${Math.round(l.share * 100)}% ${l.name}`)
          .join(", ")}.`}
      >
        {/* intake rule with measure ticks */}
        <line
          x1={PAD}
          y1={26}
          x2={W - PAD}
          y2={26}
          stroke="var(--ink)"
          strokeWidth={2}
        />
        {Array.from({ length: 21 }).map((_, i) => {
          const x = PAD + ((W - PAD * 2) / 20) * i;
          return (
            <line
              key={i}
              x1={x}
              y1={26}
              x2={x}
              y2={i % 5 === 0 ? 17 : 21}
              stroke="var(--rule-strong)"
              strokeWidth={1}
            />
          );
        })}

        {/* the sorter: everything funnels through one decision point */}
        {geometry.map((lane, i) => (
          <motion.path
            key={`leader-${i}`}
            d={`M ${W / 2} 32 C ${W / 2} 70, ${lane.mid} 62, ${lane.mid} 98`}
            fill="none"
            stroke="var(--rule-strong)"
            strokeWidth={1}
            strokeDasharray="3 3"
            initial={reduced ? undefined : { pathLength: 0, opacity: 0 }}
            whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: EASE }}
          />
        ))}
        <circle cx={W / 2} cy={32} r={4} fill="var(--ink)" />

        {/* lanes */}
        {geometry.map((lane, i) => (
          <g key={lane.tier}>
            <motion.rect
              x={lane.x}
              y={102}
              width={lane.width}
              height={22}
              fill={INK[lane.tier]}
              style={{ transformBox: "fill-box", transformOrigin: "left" }}
              initial={reduced ? undefined : { scaleX: 0 }}
              whileInView={reduced ? undefined : { scaleX: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.35 + i * 0.12, ease: EASE }}
            />
            <text
              x={lane.x}
              y={162}
              fill="var(--ink)"
              className="font-mono text-[34px] tracking-[-0.03em]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {Math.round(lane.share * 100)}%
            </text>
            <text
              x={lane.x}
              y={188}
              fill="var(--ink)"
              className="text-[15px] font-semibold"
            >
              {lane.name}
            </text>
            <text
              x={lane.x}
              y={210}
              fill="var(--ink-muted)"
              className="text-[13px]"
            >
              {lane.detail}
            </text>
            <text
              x={lane.x}
              y={234}
              fill="var(--ink-muted)"
              className="font-mono text-[12px]"
            >
              {lane.count}
            </text>
          </g>
        ))}

        <text
          x={PAD}
          y={10}
          fill="var(--ink-muted)"
          className="text-[11px] font-semibold tracking-[0.14em] uppercase"
        >
          {intake}
        </text>
      </svg>
    </figure>
  );
}
