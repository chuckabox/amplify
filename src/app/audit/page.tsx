"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { QUESTIONNAIRE } from "@/lib/data/questionnaire";
import { PILLAR_LABEL, FINDING_STATUS_LABEL } from "@/lib/data/audit";
import { scoreAudit, OUTCOME_LABEL, type ScoreResult } from "@/lib/score";
import { Reveal } from "@/components/motion";
import { PhotoAnalysis } from "@/components/photo-analysis";

function analysisStages(hasFiles: boolean): string[] {
  const stages = [
    "Checking answers against safety rules",
    "Calculating risk score",
    "Verifying photo authenticity",
    "Determining outcome",
  ];
  if (hasFiles) {
    return ["Uploading photos", ...stages];
  }
  return stages;
}

type Preview = { name: string; url: string; isVideo: boolean };

export default function AuditPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evidence, setEvidence] = useState<Preview[]>([]);
  const [stageIdx, setStageIdx] = useState(0);
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [sampleTruck, setSampleTruck] = useState<"truckA" | "truckB">("truckA");
  const submitted = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const pillarCount = QUESTIONNAIRE.length;
  const totalSegments = pillarCount + 1;
  const progressStep = Math.min(Math.max(step, 0), totalSegments);

  function finalize() {
    if (submitted.current) return;
    submitted.current = true;
    const scored = scoreAudit(answers, QUESTIONNAIRE);
    setResult(scored);
    setStep(7);
  }

  const stages = analysisStages(evidence.length > 0);
  useEffect(() => {
    if (step !== 6) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    stages.forEach((_, i) => {
      timers.push(setTimeout(() => setStageIdx(i + 1), (i + 1) * 750));
    });
    timers.push(
      setTimeout(() => finalize(), (stages.length + 1) * 750),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function setAnswer(qid: string, value: string) {
    setAnswers((a) => ({ ...a, [qid]: value }));
  }

  function addFiles(files: FileList | null) {
    if (!files) return;
    const previews: Preview[] = Array.from(files).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
      isVideo: f.type.startsWith("video/"),
    }));
    setEvidence((e) => [...e, ...previews]);
  }

  function removeEvidence(idx: number) {
    setEvidence((e) => e.filter((_, i) => i !== idx));
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.add("border-accent", "bg-accent/5");
    }
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove("border-accent", "bg-accent/5");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (dropzoneRef.current) {
      dropzoneRef.current.classList.remove("border-accent", "bg-accent/5");
    }
    addFiles(e.dataTransfer.files);
  }

  // ---------- Intro ----------
  if (step === 0) {
    return (
      <main className="mx-auto w-full max-w-[640px] px-6 py-12 flex-1">
        <Reveal>
          <p className="field-label">SAFETY AUDIT</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink">
            Safety check
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            Four topics, a few questions each, then upload photos. We score
            it and tell you what happens next.
          </p>

          <div className="mt-8 border border-rule bg-paper-raised rounded-[4px] overflow-hidden">
            <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5">
              <span className="field-label">Topics</span>
            </div>
            <div className="divide-y divide-rule">
              {QUESTIONNAIRE.map((s, i) => (
                <div
                  key={s.pillar}
                  className="flex items-center justify-between px-5 py-3.5 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-ink-faint">
                      0{i + 1}
                    </span>
                    <span className="font-sans font-medium text-ink">
                      {s.title}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                    PENDING
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-start gap-4">
            <Link href="/">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={() => setStep(1)} variant="accent">
              Start
              <ButtonIconWell>
                <span className="font-mono text-xs">→</span>
              </ButtonIconWell>
            </Button>
          </div>
        </Reveal>
      </main>
    );
  }

  // ---------- Pillar question steps ----------
  if (step >= 1 && step <= pillarCount) {
    const section = QUESTIONNAIRE[step - 1];
    const allAnswered = section.questions.every((q) => answers[q.id]);

    return (
      <main className="mx-auto w-full max-w-[640px] px-6 py-12 flex-1">
        <Reveal>
          <ProgressBar current={progressStep} total={totalSegments} />
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <p className="field-label">Topic {step} of {pillarCount}</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">
            {section.title}
          </h1>

          <div className="mt-4 border border-rule-strong bg-paper-sunk/30 p-4 rounded-[3px] text-xs leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink uppercase tracking-wider text-[10px] block mb-1">
              Why this matters:
            </span>
            {section.why}
          </div>

          <div className="mt-8 space-y-8">
            {section.questions.map((q) => (
              <div key={q.id} className="space-y-3">
                <h3 className="text-sm font-semibold text-ink">
                  {q.prompt}
                </h3>
                {q.help && (
                  <p className="text-xs leading-relaxed text-ink-muted">
                    {q.help}
                  </p>
                )}
                <div className="grid gap-3 sm:grid-cols-2">
                  {q.options.map((o) => {
                    const active = answers[q.id] === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setAnswer(q.id, o.value)}
                        className={`flex items-center gap-3 rounded-[3px] border px-4 py-3 text-left text-sm transition-all cursor-pointer ${
                          active
                            ? "border-ink bg-paper-sunk text-ink font-medium shadow-press"
                            : "border-rule-strong bg-paper-raised text-ink-muted hover:border-ink hover:text-ink"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border ${
                            active
                              ? "border-ink bg-paper-raised text-ink"
                              : "border-rule-strong bg-paper"
                          }`}
                        >
                          {active && (
                            <span className="h-2 w-2 bg-accent rounded-[1px]" />
                          )}
                        </span>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-rule pt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
            >
              <span className="font-mono mr-1.5">←</span>
              Back
            </Button>
            <Button
              disabled={!allAnswered}
              onClick={() => setStep(step + 1)}
              variant="default"
            >
              Continue
              <ButtonIconWell>
                <span className="font-mono text-xs">→</span>
              </ButtonIconWell>
            </Button>
          </div>
        </Reveal>
      </main>
    );
  }

  // ---------- Evidence step ----------
  if (step === 5) {
    const evidenceHints = QUESTIONNAIRE.map((s) => s.evidence);

    return (
      <main className="mx-auto w-full max-w-[640px] px-6 py-12 flex-1">
        <Reveal>
          <ProgressBar current={progressStep} total={totalSegments} />
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <p className="field-label">Last step</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">
            Upload photos
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Drop photos and videos into the box below. GPS and timestamps
            are checked automatically.
          </p>

          <div className="mt-6 space-y-1.5">
            <span className="field-label text-[10px]">What to capture:</span>
            {evidenceHints.map((ev) => (
              <div key={ev.id} className="flex items-start gap-2 text-xs text-ink-muted">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                <span><span className="font-semibold text-ink">{ev.label}</span>: {ev.hint}</span>
              </div>
            ))}
          </div>

          <div
            ref={dropzoneRef}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className="mt-6 flex min-h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[4px] border-2 border-dashed border-rule-strong bg-paper-sunk/30 p-8 transition-colors hover:border-ink/40"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
            <svg className="size-8 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
            <p className="text-sm text-ink-muted">
              <span className="font-semibold text-ink">Drop files here</span> or click to browse
            </p>
            <p className="text-xs text-ink-faint">Photos and videos</p>
          </div>

          {evidence.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {evidence.map((f, i) => (
                <div
                  key={i}
                  className="group relative h-16 w-16 overflow-hidden rounded-[3px] border border-rule p-[2px] bg-paper"
                >
                  {f.isVideo ? (
                    <video
                      src={f.url}
                      className="h-full w-full object-cover rounded-[1px]"
                      muted
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={f.url}
                      alt={f.name}
                      className="h-full w-full object-cover rounded-[1px]"
                    />
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEvidence(i);
                    }}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-[2px] bg-ink/75 text-paper opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                  >
                    <span className="font-mono text-[9px]">✕</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 border-t border-rule pt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(4)}
            >
              <span className="font-mono mr-1.5">←</span>
              Back
            </Button>
            <Button onClick={() => { setStageIdx(0); submitted.current = false; setStep(6); }} variant="accent">
              Submit
              <ButtonIconWell>
                <span className="font-mono text-xs">→</span>
              </ButtonIconWell>
            </Button>
          </div>
        </Reveal>
      </main>
    );
  }

  // ---------- Analyzing step ----------
  if (step === 6) {
    return (
      <main className="mx-auto w-full max-w-[540px] px-6 py-20 flex-1 text-center">
        <Reveal>
          <div className="inline-flex size-14 items-center justify-center rounded-[4px] bg-accent text-ink">
            <span className="animate-spin text-xl font-semibold font-mono">/</span>
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-ink">
            Analyzing
          </h1>
          <p className="mt-2 text-sm text-ink-muted max-w-[36ch] mx-auto">
            Scoring your answers and checking photo metadata.
          </p>

          <div className="mt-10 border border-rule bg-paper-raised rounded-[4px] overflow-hidden text-left">
            <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5">
              <span className="field-label">Progress</span>
            </div>
            <div className="divide-y divide-rule px-5">
              {stages.map((label, i) => {
                const done = i < stageIdx;
                const active = i === stageIdx;
                return (
                  <div
                    key={label}
                    className={`flex items-center justify-between py-3.5 text-sm ${
                      done ? "text-ink" : active ? "text-accent-deep font-semibold" : "text-ink-faint"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs">
                        0{i + 1}
                      </span>
                      <span>{label}</span>
                    </div>
                    <div className="font-mono text-xs">
                      {done ? (
                        <span className="text-tier-1-ink font-semibold">✓ DONE</span>
                      ) : active ? (
                        <span className="animate-pulse text-accent-deep">● RUNNING</span>
                      ) : (
                        <span className="text-ink-faint">PENDING</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </main>
    );
  }

  // ---------- Result step ----------
  if (step === 7 && result) {
    const actionItems = result.findings.filter((f) => f.status === "action");
    const photoCount = evidence.length;

    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-12 flex-1">
       <div className="mx-auto max-w-[640px] text-center">
        <Reveal>
          <span className="field-label">DONE</span>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink">
            {OUTCOME_LABEL[result.outcome]}
          </h1>

          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-[3px] border border-rule-strong bg-paper-raised px-3 py-1.5 text-xs font-semibold text-ink">
              <span className={`h-2 w-2 rounded-full ${
                result.outcome === "cleared"
                  ? "bg-tier-1"
                  : result.outcome === "remote_video"
                    ? "bg-tier-2"
                    : "bg-tier-3"
              }`} />
              {OUTCOME_LABEL[result.outcome]}
            </span>
            <span className="font-mono text-xs text-ink-muted">
              {result.score.toFixed(1)} / 5
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="mt-8 text-left">
          <div className="rounded-[4px] border border-rule bg-paper-raised overflow-hidden">
            <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5 flex items-center justify-between">
              <span className="field-label">Findings</span>
              {photoCount > 0 && (
                <span className="font-mono text-[10px] text-ink-faint">
                  {photoCount} PHOTO{photoCount !== 1 ? "S" : ""}
                </span>
              )}
            </div>
            <div className="divide-y divide-rule">
              {result.findings.map((f, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 text-sm leading-relaxed">
                  <span className="mt-1 font-mono text-xs text-ink-faint">
                    0{i + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-ink">
                        {PILLAR_LABEL[f.pillar]}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-[2px] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        f.status === "action"
                          ? "bg-tier-3-wash text-tier-3-ink"
                          : f.status === "advisory"
                            ? "bg-tier-2-wash text-tier-2-ink"
                            : "bg-tier-1-wash text-tier-1-ink"
                      }`}>
                        {FINDING_STATUS_LABEL[f.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-ink-muted">{f.observation}</p>
                    {f.status !== "clear" && (
                      <p className="mt-1 text-xs text-ink-faint">{f.recommendation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {actionItems.length > 0 && (
          <Reveal delay={0.12} className="mt-4 text-left">
            <div className="rounded-[3px] bg-paper-sunk/50 border border-rule px-5 py-3.5 text-xs text-ink-muted leading-relaxed">
              {result.outcome === "remote_video"
                ? "Send a short video for each flagged item so an engineer can verify."
                : result.outcome === "site_visit"
                  ? "An engineer will visit your site to check the flagged items."
                  : null}
            </div>
          </Reveal>
        )}

       </div>

        {/* AI vision analysis on real fleet photos */}
        <Reveal delay={0.14} className="mt-12">
          <div className="rounded-[4px] border border-rule bg-paper-raised overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-rule bg-paper-sunk/40 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="field-label">AI vision analysis</span>
                <p className="mt-1 text-xs text-ink-muted">
                  What our model reads from a fleet&apos;s photos and video:
                  boxes, plate, tyre tread and vehicle type.
                </p>
              </div>
              <div className="flex items-center gap-1 self-start rounded-[3px] border border-rule-strong bg-paper p-1">
                {(
                  [
                    ["truckA", "Fuso flatbed"],
                    ["truckB", "Isuzu pantech"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => setSampleTruck(id)}
                    className={`rounded-[2px] px-2.5 py-1 text-xs font-semibold transition-colors ${
                      sampleTruck === id
                        ? "bg-ink text-paper"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5">
              <PhotoAnalysis analysisId={sampleTruck} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16} className="mt-10 flex justify-center items-center gap-4">
          <Button variant="outline" onClick={() => {
            setStep(0);
            setAnswers({});
            setEvidence([]);
            setResult(null);
            submitted.current = false;
          }}>
            Start another
          </Button>
          <Link href="/">
            <Button variant="default">
              Back home
              <ButtonIconWell>
                <span className="font-mono text-xs">→</span>
              </ButtonIconWell>
            </Button>
          </Link>
        </Reveal>
      </main>
    );
  }

  return null;
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
