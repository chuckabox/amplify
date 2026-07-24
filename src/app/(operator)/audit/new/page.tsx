"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Camera,
  Upload,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { useStore } from "@/lib/operator-store";
import { QUESTIONNAIRE } from "@/lib/data/questionnaire";
import {
  fleetBasePremium,
  mileageLoading,
  computePremium,
  formatCurrency,
  PILLAR_LABEL,
  type Audit,
  type Finding,
} from "@/lib/data/operators";

const ANALYSIS_STAGES = [
  "Uploading evidence securely",
  "Running AI vision on photos",
  "Benchmarking answers against NTI standards",
  "Computing pillar risk scores",
  "Applying trust & anti-gaming signals",
  "Routing to a tier",
];

type Preview = { name: string; url: string };

export default function GuidedAuditPage() {
  const router = useRouter();
  const { current, completeAudit } = useStore();

  // step: 0 = intro, 1..4 = pillars, 5 = evidence, 6 = analyzing, 7 = result
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evidence, setEvidence] = useState<Record<string, Preview[]>>({});
  const [stageIdx, setStageIdx] = useState(0);
  const [result, setResult] = useState<Audit | null>(null);
  const submitted = useRef(false);

  const pillarCount = QUESTIONNAIRE.length;
  const totalSegments = pillarCount + 1; // pillars + evidence
  const progressStep = Math.min(Math.max(step, 0), totalSegments);

  // Drive the analysis animation when we reach the analyzing step.
  useEffect(() => {
    if (step !== 6) return;
    setStageIdx(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_STAGES.forEach((_, i) => {
      timers.push(setTimeout(() => setStageIdx(i + 1), (i + 1) * 750));
    });
    timers.push(
      setTimeout(() => finalize(), (ANALYSIS_STAGES.length + 1) * 750),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (!current) return null;

  function setAnswer(qid: string, value: string) {
    setAnswers((a) => ({ ...a, [qid]: value }));
  }

  function onFiles(evId: string, files: FileList | null) {
    if (!files) return;
    const previews = Array.from(files).map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setEvidence((e) => ({ ...e, [evId]: [...(e[evId] ?? []), ...previews] }));
  }

  function removeEvidence(evId: string, idx: number) {
    setEvidence((e) => ({
      ...e,
      [evId]: (e[evId] ?? []).filter((_, i) => i !== idx),
    }));
  }

  function buildFindings(): Finding[] {
    return QUESTIONNAIRE.map((section) => {
      let worst = section.questions[0];
      let worstWeight = 0;
      for (const q of section.questions) {
        const val = answers[q.id];
        const opt = q.options.find((o) => o.value === val);
        if (opt && opt.riskWeight > worstWeight) {
          worstWeight = opt.riskWeight;
          worst = q;
        }
      }
      const advisory = worstWeight >= 4;
      return {
        pillar: section.pillar,
        observation: advisory
          ? `${section.title} controls acceptable, with one area to watch (${worst.prompt.toLowerCase().replace(/\?$/, "")}).`
          : `${section.title} controls meet NTI standards based on evidence and responses.`,
        severity: advisory ? 2 : 1,
        recommendation: advisory
          ? "Advisory only — tighten before your next renewal to protect your rating."
          : "No action required.",
        status: advisory ? "advisory" : "clear",
      } as Finding;
    });
  }

  function finalize() {
    if (submitted.current) return;
    submitted.current = true;

    // Premium: this always-clears to Tier 1, which applies the 0.90x discount.
    const base = fleetBasePremium(current!.vehicles);
    const loading = mileageLoading(current!.vehicles);
    const premiumBefore = computePremium(current!);
    const premiumAfter = Math.round((base * 0.9 + loading) / 10) * 10;

    const now = new Date();
    const audit: Audit = {
      id: `AUD-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: now.toISOString().slice(0, 10),
      tier: 1,
      score: 1.7,
      status: "signed",
      reason:
        "All four pillars cleared against NTI standards with strong trust signals. Cleared to spot-check.",
      findings: buildFindings(),
      premiumBefore,
      premiumAfter,
    };
    completeAudit(audit);
    setResult(audit);
    setStep(7);
  }

  // ---------- Intro ----------
  if (step === 0) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <ShieldCheck className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold text-foreground">
            Guided audit
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            You&apos;re completing this audit as part of your NTI policy. We&apos;ll
            walk you through the four risk pillars, ask you to snap a few photos
            as evidence, then price your premium on the result — usually with no
            site visit required.
          </p>
          <div className="mt-6 grid gap-2 text-left">
            {QUESTIONNAIRE.map((s, i) => (
              <div
                key={s.pillar}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button className="gap-2" onClick={() => setStep(1)}>
              Begin audit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  // ---------- Pillar question steps ----------
  if (step >= 1 && step <= pillarCount) {
    const section = QUESTIONNAIRE[step - 1];
    const allAnswered = section.questions.every((q) => answers[q.id]);

    return (
      <Shell>
        <ProgressBar current={progressStep} total={totalSegments} />
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-wide text-primary">
            Pillar {step} of {pillarCount}
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            {section.title}
          </h1>
          <div className="mt-3 rounded-xl border border-border bg-accent/40 p-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Why we ask: </span>
            {section.why}
          </div>

          <div className="mt-6 space-y-6">
            {section.questions.map((q) => (
              <div key={q.id}>
                <div className="text-sm font-medium text-foreground">
                  {q.prompt}
                </div>
                {q.help && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {q.help}
                  </div>
                )}
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {q.options.map((o) => {
                    const active = answers[q.id] === o.value;
                    return (
                      <button
                        key={o.value}
                        onClick={() => setAnswer(q.id, o.value)}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                          active
                            ? "border-primary bg-accent text-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {active && <Check className="h-3 w-3" strokeWidth={3} />}
                        </span>
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              className="gap-1.5"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              className="gap-1.5"
              disabled={!allAnswered}
              onClick={() => setStep(step + 1)}
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  // ---------- Evidence step ----------
  if (step === 5) {
    return (
      <Shell>
        <ProgressBar current={progressStep} total={totalSegments} />
        <div className="mx-auto mt-6 max-w-2xl">
          <div className="text-xs font-medium uppercase tracking-wide text-primary">
            Final step
          </div>
          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Upload evidence
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Snap a photo for each item below. Photos carry GPS and timestamp
            metadata that our trust checks use — take them on site, now.
          </p>

          <div className="mt-6 space-y-3">
            {QUESTIONNAIRE.map((s) => {
              const ev = s.evidence;
              const files = evidence[ev.id] ?? [];
              return (
                <div
                  key={ev.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {ev.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {ev.hint}
                      </div>
                    </div>
                    <label className="shrink-0 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        capture="environment"
                        multiple
                        className="hidden"
                        onChange={(e) => onFiles(ev.id, e.target.files)}
                      />
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40">
                        <Camera className="h-4 w-4" />
                        {files.length ? "Add" : "Capture"}
                      </span>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="group relative h-16 w-16 overflow-hidden rounded-lg border border-border"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={f.url}
                            alt={f.name}
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={() => removeEvidence(ev.id, i)}
                            className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            <Upload className="h-3.5 w-3.5" />
            Evidence is optional for this demo — you can submit without every
            photo.
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              className="gap-1.5"
              onClick={() => setStep(4)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button className="gap-1.5" onClick={() => setStep(6)}>
              Submit for analysis
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  // ---------- Analyzing step ----------
  if (step === 6) {
    return (
      <Shell>
        <div className="mx-auto max-w-md py-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <Sparkles className="h-7 w-7 animate-pulse" />
          </span>
          <h1 className="mt-5 text-xl font-semibold text-foreground">
            Analysing your submission
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Our triage engine is scoring your evidence against NTI standards.
          </p>

          <div className="mt-8 space-y-2.5 text-left">
            {ANALYSIS_STAGES.map((label, i) => {
              const done = i < stageIdx;
              const active = i === stageIdx;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                    done
                      ? "border-border bg-card"
                      : active
                        ? "border-primary/40 bg-accent/40"
                        : "border-border bg-card opacity-50"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                    {done ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    ) : active ? (
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    )}
                  </span>
                  <span
                    className={`text-sm ${done || active ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Shell>
    );
  }

  // ---------- Result step ----------
  if (step === 7 && result) {
    const saved = result.premiumBefore - result.premiumAfter;
    return (
      <Shell>
        <div className="mx-auto max-w-lg py-6 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </span>
          <h1 className="mt-5 text-2xl font-semibold text-foreground">
            Audit cleared
          </h1>
          <div className="mt-3 flex items-center justify-center gap-2">
            <TierBadge tier={1} label="Tier 1 · Auto-cleared" />
            <span className="text-sm text-muted-foreground">
              score {result.score.toFixed(1)}/5
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
            {result.reason} An NTI engineer may spot-check your evidence.
          </p>

          {/* Premium result */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Previous premium
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(result.premiumBefore)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                New annual premium
              </span>
              <span className="text-2xl font-semibold text-foreground">
                {formatCurrency(result.premiumAfter)}
              </span>
            </div>
            {saved > 0 && (
              <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-center text-sm font-medium text-emerald-700">
                You saved {formatCurrency(saved)} per year
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline">Back to dashboard</Button>
            </Link>
            <Link href={`/audits/${result.id}`}>
              <Button className="gap-1.5">
                View full audit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  return null;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-3xl px-6 py-10">{children}</div>;
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Step {current} of {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
