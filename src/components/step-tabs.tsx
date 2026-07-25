"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PhotoPlate } from "@/components/photo-plate";
import { cn } from "@/lib/utils";

export interface Step {
  n: string;
  title: string;
  body: string;
  seed: string;
  alt: string;
}

export function StepTabs({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <div className="flex flex-col gap-10">
      {/* Tab bar */}
      <div className="grid grid-cols-3 gap-3">
        {steps.map((s, i) => (
          <button
            key={s.n}
            onClick={() => setActive(i)}
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
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-baseline gap-2">
              <span className="font-mono text-xs text-ink-faint">{s.n}</span>
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
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="grid items-center gap-8 p-6 md:grid-cols-2 md:p-10"
          >
            <div>
              <span className="font-mono text-xs text-ink-faint">
                Step {step.n}
              </span>
              <h3 className="mt-2 text-2xl leading-tight">{step.title}</h3>
              <p className="mt-4 max-w-[42ch] leading-[1.7] text-ink-muted">
                {step.body}
              </p>
            </div>
            <PhotoPlate
              seed={step.seed}
              alt={step.alt}
              width={800}
              height={560}
              imageClassName="aspect-[10/7]"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
