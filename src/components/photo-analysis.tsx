"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScanLine, Play, Video as VideoIcon, Sparkles } from "lucide-react";
import {
  getAnalysis,
  type Detection,
  type DetectionKind,
} from "@/lib/data/analysis";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/utils";

// Detection colour by kind — pulled from the design tokens.
const KIND_COLOR: Record<DetectionKind, string> = {
  vehicle: "var(--ink)",
  component: "var(--accent-deep)",
  tyre: "var(--tier-2-ink)",
  plate: "var(--tier-1-ink)",
  load: "var(--tier-1-ink)",
  hazard: "var(--tier-3-ink)",
};

const SCAN_MS = 1700;

const SCAN_STEPS = [
  "Detecting objects…",
  "Classifying vehicle…",
  "Reading plate…",
  "Measuring tread…",
];

const toneDot: Record<string, string> = {
  ok: "bg-tier-1-ink",
  watch: "bg-tier-2-ink",
  flag: "bg-tier-3-ink",
};

function BoxOverlay({ det, index }: { det: Detection; index: number }) {
  const color = KIND_COLOR[det.kind];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.32, 0.72, 0, 1] }}
      className="pointer-events-none absolute"
      style={{
        left: `${det.box.x * 100}%`,
        top: `${det.box.y * 100}%`,
        width: `${det.box.w * 100}%`,
        height: `${det.box.h * 100}%`,
        border: `2px solid ${color}`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.35), inset 0 0 12px ${color}22`,
        borderRadius: 2,
      }}
    >
      {/* corner ticks */}
      <span className="absolute -left-[3px] -top-[3px] h-2 w-2 border-l-2 border-t-2" style={{ borderColor: color }} />
      <span className="absolute -right-[3px] -top-[3px] h-2 w-2 border-r-2 border-t-2" style={{ borderColor: color }} />
      <span className="absolute -bottom-[3px] -left-[3px] h-2 w-2 border-b-2 border-l-2" style={{ borderColor: color }} />
      <span className="absolute -bottom-[3px] -right-[3px] h-2 w-2 border-b-2 border-r-2" style={{ borderColor: color }} />
      {/* label */}
      <span
        className="absolute -top-[1px] left-0 -translate-y-full whitespace-nowrap px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-white"
        style={{ background: color }}
      >
        {det.label}
        <span className="opacity-70"> · {(det.confidence * 100).toFixed(0)}%</span>
      </span>
    </motion.div>
  );
}

export function PhotoAnalysis({ analysisId }: { analysisId: string }) {
  const analysis = getAnalysis(analysisId);
  const hasVideo = !!analysis?.video;

  // active view: 0..n-1 = image index, -1 = video
  const [active, setActive] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState<Set<number>>(new Set());
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  function runScan(idx: number) {
    clearTimers();
    setScanning(true);
    setStep(0);
    SCAN_STEPS.forEach((_, i) =>
      timers.current.push(
        setTimeout(() => setStep(i), (SCAN_MS / SCAN_STEPS.length) * i),
      ),
    );
    timers.current.push(
      setTimeout(() => {
        setScanned((prev) => new Set(prev).add(idx));
        setScanning(false);
      }, SCAN_MS),
    );
  }

  // Auto-scan an image the first time it's viewed.
  useEffect(() => {
    if (active >= 0 && !scanned.has(active) && !scanning) {
      const t = setTimeout(() => runScan(active), 250);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => () => clearTimers(), []);

  if (!analysis) return null;

  const img = active >= 0 ? analysis.images[active] : null;
  const showBoxes = img != null && scanned.has(active) && !scanning;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      {/* ---------- Viewer ---------- */}
      <div>
        <div className="relative overflow-hidden rounded-xl border border-border bg-black">
          {img ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(img.src)}
                alt={img.caption}
                className="block max-h-[460px] w-full object-contain"
              />

              {/* scan sweep */}
              <AnimatePresence>
                {scanning && (
                  <motion.div
                    key="scan"
                    initial={{ top: "-12%" }}
                    animate={{ top: "108%" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: SCAN_MS / 1000, ease: "linear" }}
                    className="pointer-events-none absolute inset-x-0 h-24"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent, var(--accent)33 60%, var(--accent))",
                    }}
                  >
                    <div
                      className="absolute bottom-0 h-[2px] w-full"
                      style={{ background: "var(--accent)", boxShadow: "0 0 12px var(--accent)" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* boxes */}
              {showBoxes &&
                img.detections.map((d, i) => (
                  <BoxOverlay key={d.id} det={d} index={i} />
                ))}

              {/* scanning status chip */}
              <AnimatePresence>
                {scanning && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-2 left-2 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 font-mono text-[11px] text-white backdrop-blur"
                  >
                    <ScanLine className="h-3.5 w-3.5 animate-pulse" />
                    {SCAN_STEPS[step]}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* detected count chip */}
              {showBoxes && (
                <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur">
                  {img.detections.length} objects
                </div>
              )}
            </div>
          ) : (
            // video view
            analysis.video && (
              <div className="relative">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={asset(analysis.video.src)}
                  poster={asset(analysis.video.poster)}
                  controls
                  playsInline
                  className="block max-h-[460px] w-full bg-black object-contain"
                />
                <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-tier-1-ink/90 px-2.5 py-1 font-mono text-[11px] text-white">
                  <Sparkles className="h-3.5 w-3.5" />
                  Plate read: XB·25JG
                </div>
              </div>
            )
          )}
        </div>

        {/* thumbnail strip + rescan */}
        <div className="mt-3 flex items-center gap-2">
          {analysis.images.map((im, i) => (
            <button
              key={im.src}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-12 w-16 overflow-hidden rounded-md border-2 transition-colors",
                active === i ? "border-accent-deep" : "border-border hover:border-rule-strong",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(im.src)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          {hasVideo && (
            <button
              onClick={() => setActive(-1)}
              className={cn(
                "flex h-12 w-16 items-center justify-center rounded-md border-2 transition-colors",
                active === -1 ? "border-accent-deep text-accent-deep" : "border-border text-ink-muted hover:border-rule-strong",
              )}
            >
              <VideoIcon className="h-5 w-5" />
            </button>
          )}

          {active >= 0 && (
            <button
              onClick={() => runScan(active)}
              disabled={scanning}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-accent-deep disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5" />
              {scanning ? "Analysing…" : "Analyse again"}
            </button>
          )}
        </div>
        <p className="mt-2 font-mono text-[11px] text-ink-faint">
          {img ? img.caption : analysis.video?.caption}
        </p>
      </div>

      {/* ---------- Read-out ---------- */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 border-b border-rule pb-3">
          <Sparkles className="h-4 w-4 text-accent-deep" />
          <h3 className="text-sm font-semibold text-ink">What the AI saw</h3>
        </div>

        {/* what truck is this */}
        <div className="mt-4">
          <span className="field-label">Identified as</span>
          <p className="mt-1 font-display text-lg font-semibold leading-tight text-ink">
            {analysis.vehicleLabel}
          </p>
          <p className="mt-0.5 flex items-center gap-2 text-sm text-ink-muted">
            <span
              className="inline-block h-3 w-3 rounded-full border border-rule-strong"
              style={{ background: analysis.colourHex }}
            />
            {analysis.make}
          </p>
        </div>

        {/* attributes */}
        <dl className="mt-4 divide-y divide-rule">
          {analysis.attributes.map((a) => (
            <div key={a.label} className="flex items-start justify-between gap-3 py-2">
              <dt className="flex items-center gap-1.5 text-xs text-ink-muted">
                {a.tone && (
                  <span className={cn("h-1.5 w-1.5 rounded-full", toneDot[a.tone])} />
                )}
                {a.label}
              </dt>
              <dd className="text-right">
                <span className="text-sm font-medium text-ink">{a.value}</span>
                {a.confidence != null && (
                  <span className="ml-1.5 font-mono text-[10px] text-ink-faint">
                    {(a.confidence * 100).toFixed(0)}%
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 border-t border-rule pt-3 text-[11px] leading-relaxed text-ink-faint">
          {analysis.modelNote}
        </p>
      </div>
    </div>
  );
}
