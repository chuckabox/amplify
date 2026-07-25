"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { PhotoAnalysis } from "@/components/photo-analysis";
import { Reveal } from "@/components/motion";
import { SiteFooter } from "@/app/(marketing)/page";

type SampleId = "truckA" | "truckB";
type Phase = "upload" | "extracting" | "review";

interface QueuedFile {
  name: string;
  size: string;
  isVideo: boolean;
}

const EXTRACTION_STAGES = [
  "Uploading media assets",
  "Checking photo reuse and image metadata",
  "Extracting license plates and registration",
  "Running tyre tread depth estimation",
  "Verifying evidence against safety controls",
] as const;

const SAMPLE_FILES: Record<SampleId, QueuedFile[]> = {
  truckA: [
    { name: "Mitsubishi_Fuso_SideProfile.jpg", size: "590 KB", isVideo: false },
    { name: "Steer_Tyre_Tread_Inspection.jpg", size: "406 KB", isVideo: false },
  ],
  truckB: [
    { name: "Isuzu_FRR_Windscreen.jpg", size: "693 KB", isVideo: false },
    { name: "Walk-around_Front_Inspected.mp4", size: "2.1 MB", isVideo: true },
  ],
};

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

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function VisualEvidenceClient() {
  const [phase, setPhase] = useState<Phase>("upload");
  const [sampleId, setSampleId] = useState<SampleId>("truckB");
  const [attached, setAttached] = useState(false);
  const [evidence, setEvidence] = useState<QueuedFile[]>([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sample = SAMPLE_META[sampleId];

  useEffect(() => {
    if (phase !== "extracting") return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    EXTRACTION_STAGES.forEach((_, index) => {
      timers.push(
        setTimeout(() => setStageIndex(index + 1), (index + 1) * 600),
      );
    });
    timers.push(
      setTimeout(
        () => setPhase("review"),
        (EXTRACTION_STAGES.length + 1) * 600,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).map((file) => ({
      name: file.name,
      size: formatBytes(file.size),
      isVideo: file.type.startsWith("video/"),
    }));
    setEvidence((current) => [...current, ...next]);
  }

  function addSampleSet(id: SampleId) {
    setSampleId(id);
    setEvidence(SAMPLE_FILES[id]);
  }

  function removeFile(index: number) {
    setEvidence((current) => current.filter((_, idx) => idx !== index));
  }

  function runVisionAnalysis() {
    setStageIndex(0);
    setPhase("extracting");
  }

  function selectSample(id: SampleId) {
    setSampleId(id);
    setAttached(false);
  }

  // ---------- Phase 1: Upload Dropzone ----------
  if (phase === "upload") {
    return (
      <div className="flex min-h-screen flex-col">
        <main id="main" className="flex-1">
          {/* Hero */}
          <section className="border-b border-rule bg-paper-raised">
            <div className="mx-auto max-w-[1240px] px-6 pt-20 pb-24 md:pt-28 md:pb-32">
              <Reveal>
                <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
                  <div>
                    <h1 className="max-w-[15ch] text-[clamp(2.6rem,6vw,4.75rem)] font-display font-bold leading-[0.96] text-ink">
                      Analyse photo and video evidence.
                    </h1>
                  </div>
                  <div className="lg:pb-1">
                    <p className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                      Upload photos or videos from site. We check metadata, flag reuse, and match what we see to your controls.
                    </p>
                    <Link
                      href="/audit"
                      className="mt-4 inline-flex text-sm font-semibold text-accent-deep underline decoration-rule-strong underline-offset-4 hover:decoration-accent-deep"
                    >
                      Upload business records instead
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Upload area */}
          <section className="border-b border-rule bg-paper">
            <div className="mx-auto max-w-[1240px] px-6 py-20 md:py-28">
              <div className="grid gap-8 lg:grid-cols-[1.22fr_0.78fr]">
                <Reveal delay={0.08}>
                  <section aria-labelledby="upload-media-title">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 id="upload-media-title" className="text-2xl font-semibold text-ink">
                          Drop photo or video files
                        </h2>
                      </div>
                      <span className="text-xs text-ink-faint">
                        Accepts mp4, webm, heic, jpg, png
                      </span>
                    </div>

                    {/* Dropzone — plate/plate-core nested */}
                    <div className="plate mt-5">
                      <div
                        onDragOver={(event) => {
                          event.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={(event) => {
                          event.preventDefault();
                          setDragging(false);
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          setDragging(false);
                          addFiles(event.dataTransfer.files);
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`plate-core flex min-h-[245px] cursor-pointer flex-col items-center justify-center gap-4 border-2 border-dashed p-8 text-center transition-all ${
                          dragging
                            ? "border-accent-deep bg-accent-wash/50"
                            : "border-rule-strong bg-paper-raised hover:border-accent-deep"
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          className="hidden"
                          onChange={(event) => addFiles(event.target.files)}
                        />
                        <DocumentStackIcon />
                        <div>
                          <p className="text-base font-semibold text-ink">
                            Drop media files here
                          </p>
                          <p className="mt-1 text-sm text-ink-muted">
                            or click to browse from your computer
                          </p>
                        </div>
                        <p className="max-w-[42ch] text-xs leading-relaxed text-ink-faint">
                          Select raw photos or videos captured on-site. Bounding boxes and
                          AI detections are generated automatically.
                        </p>
                      </div>
                    </div>

                    {evidence.length > 0 && (
                      <div className="plate mt-5">
                        <div className="plate-core overflow-hidden">
                          <div className="flex items-center justify-between border-b border-rule bg-paper-sunk/40 px-4 py-3">
                            <span className="field-label">Ready to process</span>
                            <span className="font-mono text-[10px] text-ink-muted">
                              {evidence.length} FILE{evidence.length === 1 ? "" : "S"}
                            </span>
                          </div>
                          <div className="divide-y divide-rule">
                            {evidence.map((file, index) => (
                              <div
                                key={`${file.name}-${index}`}
                                className="flex items-center gap-3 px-4 py-3"
                              >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-[2px] bg-paper-sunk font-mono text-[9px] font-semibold text-accent-deep">
                                  {file.isVideo ? "VIDEO" : "PHOTO"}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-ink">
                                    {file.name}
                                  </p>
                                  <p className="mt-0.5 text-xs text-ink-faint">
                                    {file.size}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="rounded-[2px] px-2 py-1 font-mono text-xs text-ink-faint transition-colors hover:bg-paper-sunk hover:text-ink"
                                  aria-label={`Remove ${file.name}`}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="field-label">For the hackathon demo</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => addSampleSet("truckA")}
                            className="rounded-[3px] border border-rule-strong bg-paper-raised px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:border-ink hover:text-ink"
                          >
                            + Truck A (Fuso flatbed)
                          </button>
                          <button
                            type="button"
                            onClick={() => addSampleSet("truckB")}
                            className="rounded-[3px] border border-rule-strong bg-paper-raised px-3 py-2 text-xs font-semibold text-ink-muted transition-colors hover:border-ink hover:text-ink"
                          >
                            + Truck B (Isuzu pantech)
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Link href="/">
                          <Button variant="outline">Cancel</Button>
                        </Link>
                        <Button
                          variant="accent"
                          disabled={evidence.length === 0}
                          onClick={runVisionAnalysis}
                        >
                          Analyse media
                          <ButtonIconWell>
                            <Arrow />
                          </ButtonIconWell>
                        </Button>
                      </div>
                    </div>
                  </section>
                </Reveal>

              </div>
            </div>
          </section>

          {/* How it works — full width below upload */}
          <section className="border-b border-rule bg-paper-sunk/35">
            <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-20">
              <Reveal delay={0.16}>
                <div className="grid gap-10 lg:grid-cols-[0.4fr_1fr] lg:items-start">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      How it works
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      Our model reviews photos and video to extract evidence. It checks:
                    </p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="plate">
                      <div className="plate-core p-5">
                        <h4 className="text-sm font-semibold text-ink">Plate matching</h4>
                        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                          Cross-references plates with registration documents.
                        </p>
                      </div>
                    </div>
                    <div className="plate">
                      <div className="plate-core p-5">
                        <h4 className="text-sm font-semibold text-ink">Tread checks</h4>
                        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                          Estimates tread depth from steer tyre photographs.
                        </p>
                      </div>
                    </div>
                    <div className="plate">
                      <div className="plate-core p-5">
                        <h4 className="text-sm font-semibold text-ink">Genuineness</h4>
                        <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                          Flags photo reuse and metadata mismatches.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ---------- Phase 2: Processing Loader ----------
  if (phase === "extracting") {
    const total = EXTRACTION_STAGES.length;
    const progress = Math.min(stageIndex, total);
    return (
      <div className="flex min-h-screen flex-col">
        <main id="main" className="flex-1">
          <section className="border-b border-rule bg-paper-sunk/35">
            <div className="mx-auto flex w-full max-w-[540px] flex-col justify-center px-6 py-28 md:py-36">
              <Reveal>
                <div>
                  <p className="field-label text-center">AI VISION ENGINE</p>
                  <h1 className="mt-4 text-center text-[clamp(1.75rem,4vw,2.25rem)] font-display font-bold leading-tight text-ink">
                    Running vision analysis
                  </h1>
                  <p className="mt-3 text-center text-sm text-ink-muted">
                    Detecting vehicles, estimating tyre tread and checking metadata.
                  </p>
                </div>

                <div className="plate mt-12">
                  <div className="plate-core p-6">
                    <ProgressBar current={progress} total={total} />

                    <div className="mt-8 space-y-4">
                      {EXTRACTION_STAGES.map((label, idx) => {
                        const pending = idx > progress - 1;
                        const active = idx === progress - 1;
                        return (
                          <div
                            key={label}
                            className={`flex items-center justify-between text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                              active
                                ? "text-accent-deep"
                                : pending
                                  ? "text-ink-faint opacity-40"
                                  : "text-ink-muted"
                            }`}
                          >
                            <span>{label}</span>
                            <span className="font-mono">
                              {pending ? "PENDING" : active ? "RUNNING" : "DONE"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ---------- Phase 3: Results / Review ----------
  return (
    <div className="flex min-h-screen flex-col">
      <main id="main" className="flex-1">
        {/* Notification banner */}
        {attached && (
          <section className="border-b border-rule bg-tier-1-wash">
            <div className="mx-auto max-w-[1240px] px-6">
              <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
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
                  Open Passport
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Hero header */}
        <section className="border-b border-rule bg-paper-raised">
          <div className="mx-auto max-w-[1240px] px-6 pt-20 pb-24 md:pt-24 md:pb-28">
            <Reveal>
              <div className="grid gap-7 lg:grid-cols-[1fr_0.55fr] lg:items-end">
                <div>
                  <h1 className="max-w-[15ch] text-[clamp(2.6rem,6vw,4.75rem)] font-display font-bold leading-[0.96] text-ink">
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
              </div>
            </Reveal>
          </div>
        </section>

        {/* Sample selector + analysis results */}
        <section className="border-b border-rule bg-paper">
          <div className="mx-auto max-w-[1240px] px-6 py-20 md:py-24">
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="field-label">Hackathon evidence set</p>
                  <h2 className="mt-2 text-2xl font-semibold text-ink">
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
              </div>
            </Reveal>

            <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_0.65fr]">
              <Reveal delay={0.12}>
                <div className="plate">
                  <div className="plate-core overflow-hidden">
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
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.16}>
                <aside className="space-y-5">
                  {/* Entity resolution */}
                  <div className="plate">
                    <div className="plate-core overflow-hidden">
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
                    </div>
                  </div>

                  {/* Evidence-to-control link */}
                  <div className="plate">
                    <div className="plate-core overflow-hidden">
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
                    </div>
                  </div>

                  <div className="space-y-3">
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
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setPhase("upload");
                        setAttached(false);
                        setEvidence([]);
                      }}
                    >
                      Analyse another batch
                    </Button>
                  </div>
                </aside>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function EvidenceMark({
  state,
}: {
  state: "proved" | "partial" | "missing" | string;
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

function DocumentStackIcon() {
  return (
    <span className="relative block h-14 w-12" aria-hidden>
      <span className="absolute left-0 top-2 h-11 w-9 -rotate-6 rounded-[2px] border border-rule-strong bg-paper-sunk" />
      <span className="absolute right-0 top-1 h-11 w-9 rotate-3 rounded-[2px] border border-rule-strong bg-paper" />
      <span className="absolute left-1.5 top-0 flex h-11 w-9 flex-col gap-1.5 rounded-[2px] border border-ink bg-paper-raised p-2">
        <span className="h-1 w-full bg-accent" />
        <span className="h-px w-full bg-rule-strong" />
        <span className="h-px w-3/4 bg-rule-strong" />
        <span className="h-px w-5/6 bg-rule-strong" />
      </span>
    </span>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-ink-muted font-mono">
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {Array.from({ length: total }).map((_, idx) => {
          const active = idx < current;
          return (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-[1px] transition-colors duration-300 ${
                active ? "bg-accent" : "bg-paper-sunk"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
