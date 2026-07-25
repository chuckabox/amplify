"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { PhotoAnalysis } from "@/components/photo-analysis";
import { Reveal } from "@/components/motion";

type SampleId = "truckA" | "truckB";

const SAMPLE_META = {
  truckA: {
    label: "Fuso flatbed",
    evidence: "2 photos",
    entity: "Truck 14 · 763KLT",
    entityDetail: "2019 Fuso Fighter · existing vehicle",
    entityConfidence: "92% match",
    facts: [
      { label: "Vehicle identity", value: "Fuso rigid flatbed", state: "proved" },
      { label: "Steer tyre tread", value: "~7.4 mm · healthy", state: "proved" },
      { label: "Load restraint", value: "One corner unclear", state: "partial" },
      { label: "Registration plate", value: "Not in frame", state: "missing" },
    ],
    control: "Vehicles leave with loads correctly restrained",
    coverage: 71,
  },
  truckB: {
    label: "Isuzu pantech",
    evidence: "1 photo · 1 video",
    entity: "Truck 28 · ABC123",
    entityDetail: "2021 Isuzu FYJ · existing vehicle",
    entityConfidence: "96% match",
    facts: [
      { label: "Vehicle identity", value: "Isuzu rigid pantech", state: "proved" },
      { label: "Registration plate", value: "XB·25JG read", state: "proved" },
      { label: "Photo/video consistency", value: "Confirmed", state: "proved" },
      { label: "Steer tyre condition", value: "Closer image needed", state: "partial" },
    ],
    control: "Vehicle condition is checked before operation",
    coverage: 84,
  },
} as const;

export default function VisualEvidencePage() {
  const [sampleId, setSampleId] = useState<SampleId>("truckB");
  const [attached, setAttached] = useState(false);
  const sample = SAMPLE_META[sampleId];

  function selectSample(id: SampleId) {
    setSampleId(id);
    setAttached(false);
  }

  return (
    <main
      id="main"
      className="mx-auto w-full max-w-[1240px] flex-1 px-6 py-10 md:py-14"
    >
      {attached && (
        <div className="mb-6 flex flex-col gap-3 rounded-[4px] border border-tier-1-ink bg-tier-1-wash px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="font-mono text-sm font-bold text-tier-1-ink">
              ✓
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">
                Visual findings attached to {sample.entity}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                The source media remains linked to the vehicle and its control
                evidence.
              </p>
            </div>
          </div>
          <Link
            href="/passport"
            className="self-start text-xs font-semibold text-accent-deep underline decoration-rule-strong underline-offset-4 hover:decoration-accent-deep sm:self-auto"
          >
            Open Risk Passport
          </Link>
        </div>
      )}

      <Reveal>
        <header className="grid gap-7 border-b border-rule pb-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <p className="field-label">Risk Passport · visual evidence</p>
            <h1 className="mt-4 max-w-[15ch] text-[clamp(2.6rem,6vw,4.75rem)] font-semibold leading-[0.96] text-ink">
              Read what the camera can prove.
            </h1>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-[48ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
              Photo and video analysis stays alongside document extraction.
              Visual facts resolve to the same vehicle and strengthen, or
              challenge, the same risk controls.
            </p>
            <Link
              href="/audit"
              className="mt-4 inline-flex text-sm font-semibold text-accent-deep underline decoration-rule-strong underline-offset-4 hover:decoration-accent-deep"
            >
              Upload business records instead
            </Link>
          </div>
        </header>
      </Reveal>

      <Reveal delay={0.08}>
        <section
          aria-labelledby="sample-heading"
          className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="field-label">Hackathon evidence set</p>
            <h2 id="sample-heading" className="mt-2 text-2xl font-semibold text-ink">
              Choose a vehicle capture
            </h2>
          </div>
          <div className="flex items-center gap-1 self-start rounded-[3px] border border-rule-strong bg-paper-raised p-1 sm:self-auto">
            {(
              [
                ["truckA", "Fuso · photos"],
                ["truckB", "Isuzu · photo + video"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => selectSample(id)}
                className={`rounded-[2px] px-3 py-2 text-xs font-semibold transition-colors ${
                  sampleId === id
                    ? "bg-ink text-paper"
                    : "text-ink-muted hover:bg-paper-sunk hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
      </Reveal>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_0.65fr]">
        <Reveal delay={0.12}>
          <section className="overflow-hidden rounded-[4px] border border-rule bg-paper-raised">
            <div className="flex flex-col gap-3 border-b border-rule bg-paper-sunk/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="field-label">AI vision analysis</p>
                <p className="mt-1 text-xs text-ink-muted">
                  Object detection, plate reading, condition and media
                  consistency.
                </p>
              </div>
              <span className="self-start font-mono text-[10px] uppercase tracking-wider text-ink-faint sm:self-auto">
                {sample.evidence}
              </span>
            </div>
            <div className="p-5">
              <PhotoAnalysis analysisId={sampleId} />
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.16}>
          <aside className="space-y-5">
            <section className="overflow-hidden rounded-[4px] border border-rule bg-paper-raised">
              <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5">
                <p className="field-label">Entity resolution</p>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-ink">
                      {sample.entity}
                    </h2>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {sample.entityDetail}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] font-semibold text-tier-1-ink">
                    {sample.entityConfidence}
                  </span>
                </div>
                <dl className="mt-5 divide-y divide-rule border-y border-rule">
                  {sample.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-start justify-between gap-4 py-3"
                    >
                      <dt className="flex items-start gap-2 text-xs text-ink-muted">
                        <EvidenceMark state={fact.state} />
                        {fact.label}
                      </dt>
                      <dd className="max-w-[48%] text-right font-mono text-[10px] font-semibold text-ink">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section className="overflow-hidden rounded-[4px] border border-rule bg-paper-raised">
              <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5">
                <p className="field-label">Evidence-to-control link</p>
              </div>
              <div className="p-5">
                <h2 className="text-sm font-semibold leading-relaxed text-ink">
                  {sample.control}
                </h2>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <span className="font-display text-5xl font-bold leading-none text-ink">
                      {sample.coverage}
                    </span>
                    <span className="ml-1 font-mono text-xs text-ink-faint">
                      %
                    </span>
                  </div>
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-tier-2-ink">
                    Partial evidence
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-[1px] bg-paper-sunk">
                  <div
                    className="h-full bg-accent"
                    style={{ width: `${sample.coverage}%` }}
                  />
                </div>
                <p className="mt-4 text-xs leading-relaxed text-ink-muted">
                  The visual result is one proof layer. Policies, training,
                  operating records and defect close-out remain independently
                  visible in the passport.
                </p>
              </div>
            </section>

            <Button
              variant="accent"
              className="w-full"
              onClick={() => setAttached(true)}
            >
              Attach findings to passport
              <ButtonIconWell>
                <Arrow />
              </ButtonIconWell>
            </Button>
          </aside>
        </Reveal>
      </div>
    </main>
  );
}

function EvidenceMark({
  state,
}: {
  state: "proved" | "partial" | "missing";
}) {
  return (
    <span
      className={`mt-px font-mono text-[10px] font-bold ${
        state === "proved"
          ? "text-tier-1-ink"
          : state === "partial"
            ? "text-tier-2-ink"
            : "text-tier-3-ink"
      }`}
      aria-label={state}
    >
      {state === "proved" ? "✓" : state === "partial" ? "△" : "×"}
    </span>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
