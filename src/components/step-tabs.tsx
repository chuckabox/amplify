"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { asset } from "@/lib/asset";

export interface Step {
  n: string;
  title: string;
  body: string;
  bullets?: string[];
  subtext?: string;
  seed: string;
  alt: string;
}

export function StepTabs({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const dirRef = useRef(1);
  const step = steps[active];

  function go(i: number) {
    dirRef.current = i > active ? 1 : -1;
    setActive(i);
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Tab bar */}
      <div className="grid grid-cols-3 gap-3">
        {steps.map((s, i) => (
          <button
            key={s.n}
            onClick={() => go(i)}
            className={cn(
              "relative rounded-[4px] border px-5 py-4 text-left transition-colors",
              i === active
                ? "border-accent bg-accent/8"
                : "border-rule bg-paper-raised hover:border-rule-strong",
            )}
          >
            {i === active && (
              <motion.span
                layoutId="step-indicator"
                className="absolute inset-0 rounded-[4px] border-2 border-accent"
                transition={{ duration: 0.2, ease: "easeInOut" }}
              />
            )}
            <span className="relative flex items-baseline gap-2">
              <span className="font-display text-sm font-bold text-ink-faint">{s.n}</span>
              <span className="text-sm font-semibold">{s.title}</span>
            </span>
            <p className="relative mt-1 text-xs leading-relaxed text-ink-muted line-clamp-2">
              {s.body}
            </p>
          </button>
        ))}
      </div>

      {/* Content panel */}
      <div className="overflow-hidden rounded-[6px] border border-rule bg-paper-raised">
        <AnimatePresence mode="wait" custom={dirRef.current}>
          <motion.div
            key={active}
            custom={dirRef.current}
            initial={(d: number) => ({ opacity: 0, x: d * 60 })}
            animate={{ opacity: 1, x: 0 }}
            exit={(d: number) => ({ opacity: 0, x: d * -60 })}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="grid items-center gap-8 p-6 md:grid-cols-2 md:p-10"
          >
            <div>
              <span className="font-display text-lg font-bold text-ink-faint">
                Step {step.n}
              </span>
              <h3 className="mt-2 text-2xl leading-tight">{step.title}</h3>
              <p className="mt-4 max-w-[42ch] leading-[1.7] text-ink-muted">
                {step.body}
              </p>
              {step.bullets && (
                <ul className="mt-4 space-y-2 max-w-[42ch]">
                  {step.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-ink-muted">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {step.subtext && (
                <p className="mt-4 max-w-[42ch] text-[13px] leading-[1.6] text-ink-muted font-medium border-t border-rule pt-3">
                  {step.subtext}
                </p>
              )}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={asset(step.seed)}
              alt={step.alt}
              width={800}
              height={560}
              className="aspect-[10/7] w-full object-cover rounded-[3px]"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
