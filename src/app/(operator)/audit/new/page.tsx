"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { useStore } from "@/lib/operator-store";
import { QUESTIONNAIRE } from "@/lib/data/questionnaire";
import { Reveal } from "@/components/motion";
import {
  fleetBasePremium,
  mileageLoading,
  computePremium,
  formatCurrency,
  PILLAR_LABEL,
  FORCED_TIER,
  type Audit,
  type AuditStatus,
  type Finding,
} from "@/lib/data/operators";

// Per-tier outcome the demo forces. Keeps the three tiers always demonstrable.
const TIER_OUTCOME: Record<
  1 | 2 | 3,
  { score: number; mult: number; status: AuditStatus; reason: string }
> = {
  1: {
    score: 1.7,
    mult: 0.9,
    status: "triaged",
    reason:
      "All four areas passed against NTI safety rules with genuine evidence. Cleared automatically — an engineer may spot-check.",
  },
  2: {
    score: 2.9,
    mult: 1.12,
    status: "video_requested",
    reason:
      "Almost there — one area needs a closer look. Please send a short video of the flagged item so an engineer can confirm.",
  },
  3: {
    score: 4.2,
    mult: 1.4,
    status: "escalated",
    reason:
      "A few things need checking in person. An NTI engineer will visit your site to finish this check.",
  },
};

const ANALYSIS_STAGES = [
  "Uploading your photos",
  "Checking your photos with AI",
  "Comparing your answers to NTI safety rules",
  "Working out your risk score",
  "Making sure the photos are genuine",
  "Deciding what happens next",
];

type Preview = { name: string; url: string };

export default function GuidedAuditPage() {
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

  // Findings react to the tier: at Tier 2/3 the worst area becomes a real
  // "needs fixing" item; at Tier 1 everything reads good or minor.
  function buildFindings(tier: 1 | 2 | 3): Finding[] {
    return QUESTIONNAIRE.map((section, idx) => {
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
      // The first section carries the tier's headline issue.
      const flagged = tier >= 2 && idx === 0;
      const advisory = tier >= 2 && idx === 1;
      const topic = worst.prompt.toLowerCase().replace(/\?$/, "");

      if (flagged) {
        return {
          pillar: section.pillar,
          observation: `${section.title}: the photo of “${topic}” wasn't clear enough to pass on its own.`,
          severity: tier === 3 ? 4 : 3,
          recommendation:
            tier === 3
              ? "An engineer will check this in person during the visit."
              : "Send a short, clear video of this item so an engineer can confirm.",
          status: "action",
        } as Finding;
      }
      return {
        pillar: section.pillar,
        observation: advisory
          ? `${section.title} is mostly fine, with one thing to keep an eye on.`
          : `${section.title} meets NTI safety rules based on your photos and answers.`,
        severity: advisory ? 2 : 1,
        recommendation: advisory
          ? "Keep an eye on this before your next check."
          : "No action needed.",
        status: advisory ? "advisory" : "clear",
      } as Finding;
    });
  }

  function finalize() {
    if (submitted.current) return;
    submitted.current = true;

    const tier = FORCED_TIER[current!.id] ?? 1;
    const outcome = TIER_OUTCOME[tier];

    const base = fleetBasePremium(current!.vehicles);
    const loading = mileageLoading(current!.vehicles);
    const premiumBefore = computePremium(current!);
    const premiumAfter =
      Math.round((base * outcome.mult + loading) / 10) * 10;

    const now = new Date();
    const audit: Audit = {
      id: `AUD-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: now.toISOString().slice(0, 10),
      tier,
      score: outcome.score,
      status: outcome.status,
      reason: outcome.reason,
      findings: buildFindings(tier),
      premiumBefore,
      premiumAfter,
    };
    completeAudit(audit);
    setResult(audit);
    setStep(7);
  }

  // Drive the analysis animation when we reach the analyzing step.
  useEffect(() => {
    if (step !== 6) return;
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

  // ---------- Intro ----------
  if (step === 0) {
    return (
      <main className="mx-auto w-full max-w-[640px] px-6 py-12 flex-1">
        <Reveal>
          <p className="field-label">POLICY SAFETY AUDIT</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink">
            Guided safety check
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            You are completing this audit as part of your NTI policy rules. We will walk you through the four risk pillars, ask you to capture a few photos as evidence, and then price your premium based on the results — usually without requiring a site visit.
          </p>

          <div className="mt-8 border border-rule bg-paper-raised rounded-[4px] overflow-hidden">
            <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5">
              <span className="field-label">Audit Pillars</span>
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
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={() => setStep(1)} variant="accent">
              Begin audit
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
          <p className="field-label">Pillar {step} of {pillarCount}</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">
            {section.title}
          </h1>

          <div className="mt-4 border border-rule-strong bg-paper-sunk/30 p-4 rounded-[3px] text-xs leading-relaxed text-ink-muted">
            <span className="font-semibold text-ink uppercase tracking-wider text-[10px] block mb-1">
              Why NTI asks:
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
    return (
      <main className="mx-auto w-full max-w-[640px] px-6 py-12 flex-1">
        <Reveal>
          <ProgressBar current={progressStep} total={totalSegments} />
        </Reveal>

        <Reveal delay={0.08} className="mt-8">
          <p className="field-label">Final compliance step</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">
            Upload safety evidence
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Snap a photo for each registry category below. Photos record GPS, device orientation, and timestamps. This confirms they are taken live on-site and helps expedite NTI compliance triage.
          </p>

          <div className="mt-8 space-y-6">
            {QUESTIONNAIRE.map((s) => {
              const ev = s.evidence;
              const files = evidence[ev.id] ?? [];
              return (
                <div
                  key={ev.id}
                  className="rounded-[4px] border border-rule bg-paper-raised p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-ink">
                        {ev.label}
                      </h4>
                      <p className="text-xs text-ink-muted">
                        {ev.hint}
                      </p>
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
                      <span className="inline-flex items-center gap-1.5 rounded-[3px] border border-rule-strong bg-paper px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-ink">
                        <svg className="size-3.5 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                        {files.length ? "Add" : "Capture"}
                      </span>
                    </label>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {files.map((f, i) => (
                        <div
                          key={i}
                          className="group relative h-16 w-16 overflow-hidden rounded-[3px] border border-rule p-[2px] bg-paper"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={f.url}
                            alt={f.name}
                            className="h-full w-full object-cover rounded-[1px]"
                          />
                          <button
                            type="button"
                            onClick={() => removeEvidence(ev.id, i)}
                            className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-[2px] bg-ink/75 text-paper opacity-0 transition-opacity group-hover:opacity-100 cursor-pointer"
                          >
                            <span className="font-mono text-[9px]">✕</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-[3px] bg-paper-sunk/35 border border-rule p-3 text-xs leading-relaxed text-ink-muted">
            <svg className="size-4 shrink-0 text-ink-muted mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
            <p>
              <span className="font-semibold text-ink">Demo reference: </span>
              Evidence uploads are simulated for this demonstration. You can click submit with or without actual photos.
            </p>
          </div>

          <div className="mt-8 border-t border-rule pt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep(4)}
            >
              <span className="font-mono mr-1.5">←</span>
              Back
            </Button>
            <Button onClick={() => { setStageIdx(0); setStep(6); }} variant="accent">
              Submit for analysis
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
            Analyzing submission
          </h1>
          <p className="mt-2 text-sm text-ink-muted max-w-[36ch] mx-auto">
            The Tonnage triage engine is evaluating compliance answers and photo metadata.
          </p>

          <div className="mt-10 border border-rule bg-paper-raised rounded-[4px] overflow-hidden text-left">
            <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5">
              <span className="field-label">Triage Process Logs</span>
            </div>
            <div className="divide-y divide-rule px-5">
              {ANALYSIS_STAGES.map((label, i) => {
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
    const diff = result.premiumAfter - result.premiumBefore;
    const saved = -diff;
    const t = result.tier;

    const head =
      t === 1
        ? {
            title: "Cleared on evidence",
            badge: "Passed · cleared automatically",
          }
        : t === 2
          ? {
              title: "Held for remote verification",
              badge: "Video verification needed",
            }
          : {
              title: "Escalated for a site visit",
              badge: "In-person visit required",
            };

    const actionItems = result.findings.filter((f) => f.status === "action");

    return (
      <main className="mx-auto w-full max-w-[640px] px-6 py-12 flex-1 text-center">
        <Reveal>
          <span className="field-label">AUDIT COMPLETE</span>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink">
            {head.title}
          </h1>

          <div className="mt-4 flex items-center justify-center gap-3">
            <TierBadge tier={t} label={head.badge} />
            <span className="font-mono text-xs text-ink-muted">
              SCORE {result.score.toFixed(1)}/5
            </span>
          </div>

          <p className="mt-5 max-w-[52ch] mx-auto text-sm leading-relaxed text-ink-muted">
            {result.reason}
          </p>

          <div className="mt-8 border-t-[3px] border-double border-rule-strong pt-8" />
        </Reveal>

        {/* Action items for Tier 2/3 */}
        {t >= 2 && actionItems.length > 0 && (
          <Reveal delay={0.08} className="mt-6 text-left">
            <div className="rounded-[4px] border border-rule bg-paper-raised overflow-hidden">
              <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5">
                <span className="field-label">
                  {t === 2 ? "Required Video Evidence Tasks" : "Site Inspection Checklist"}
                </span>
              </div>
              <ul className="divide-y divide-rule">
                {actionItems.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 px-5 py-4 text-sm leading-relaxed">
                    <span className="mt-1 font-mono text-xs text-ink-faint">
                      0{i + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-ink">
                        {PILLAR_LABEL[f.pillar]}:
                      </span>{" "}
                      <span className="text-ink-muted">{f.recommendation}</span>
                    </div>
                  </li>
                ))}
              </ul>
              {t === 2 && (
                <div className="p-5 border-t border-rule bg-paper-sunk/20">
                  <Button className="w-full" disabled variant="outline">
                    <span className="inline-flex items-center gap-1.5">
                      <svg className="size-3.5 text-ink-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                      Record verification video (demo)
                    </span>
                  </Button>
                </div>
              )}
            </div>
          </Reveal>
        )}

        {/* Premium result with plate pattern */}
        <Reveal delay={0.12} className="mt-6 text-left">
          <div className="plate">
            <div className="plate-core p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-rule pb-3.5">
                <div>
                  <h4 className="text-sm font-semibold text-ink">
                    Premium Calculation
                  </h4>
                  <p className="text-xs text-ink-muted mt-0.5">
                    Adjusted automatically for fleet audits
                  </p>
                </div>
                <span className="font-mono text-xs text-ink-faint">
                  POLICY {current.policy.number}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Previous yearly price</span>
                <span className="font-mono tabular-nums text-ink-muted">
                  {formatCurrency(result.premiumBefore)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-rule pt-4">
                <span className="text-sm font-semibold text-ink">
                  {t === 1 ? "New yearly price" : "Simulated interim price"}
                </span>
                <span className="font-mono text-2xl font-bold text-ink tabular-nums tracking-tight">
                  {formatCurrency(result.premiumAfter)}
                </span>
              </div>

              {saved > 0 ? (
                <div className="mt-4 rounded-[3px] bg-tier-1-wash border border-tier-1/30 px-3 py-2 text-center text-xs font-semibold text-tier-1-ink">
                  ✓ ANNUAL PREMIUM REDUCED BY {formatCurrency(saved)}
                </div>
              ) : (
                <div className="mt-4 rounded-[3px] bg-paper-sunk/50 border border-rule px-3 py-2 text-center text-xs text-ink-muted leading-relaxed">
                  {t === 2
                    ? "Premium reductions will activate once video verification clears the flagged items."
                    : "Premium updates will activate after site verification items are cleared by risk engineers."}
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.16} className="mt-10 flex justify-center items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
          <Link href={`/audits/${result.id}`}>
            <Button variant="default">
              See full audit record
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
        <span>{pct}% COMPLETE</span>
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
