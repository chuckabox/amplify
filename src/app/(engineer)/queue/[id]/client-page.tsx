"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  X,
  ImageIcon,
  ShieldCheck,
  PenLine,
  Info,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TierBadge } from "@/components/tier-badge";
import { Hint } from "@/components/hint";
import { useStore } from "@/lib/operator-store";
import {
  findAuditContext,
  trustSignals,
  trustScore,
} from "@/lib/data/engineer";
import {
  PILLAR_LABEL,
  FINDING_STATUS_LABEL,
  TIER_MEANING,
  formatDate,
  type FindingStatus,
} from "@/lib/data/operators";

const statusStyles: Record<FindingStatus, string> = {
  clear: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  advisory: "bg-amber-50 text-amber-700 ring-amber-600/15",
  action: "bg-rose-50 text-rose-700 ring-rose-600/15",
};

export default function EngineerReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { operators, signOffAudit } = useStore();
  const [justSigned, setJustSigned] = useState(false);
  const [mode, setMode] = useState<"agreed" | "noted">("agreed");
  const [notes, setNotes] = useState("");

  const ctx = findAuditContext(operators, id);

  if (!ctx) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">Audit not found.</p>
        <Link
          href="/queue"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to the queue
        </Link>
      </main>
    );
  }

  const { operator, audit } = ctx;
  const signals = trustSignals(audit);
  const trust = Math.round(trustScore(audit) * 100);
  const signed = audit.status === "signed" || justSigned;
  const aiApproved = audit.tier === 1 && audit.status === "triaged";

  function sign() {
    signOffAudit(operator.id, audit.id, {
      decision: mode,
      notes: mode === "noted" ? notes.trim() : undefined,
    });
    setJustSigned(true);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/queue"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Queue
      </Link>

      {/* Header */}
      <div className="mt-4 flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-semibold text-foreground">
              {operator.name}
            </h1>
            <TierBadge tier={audit.tier} />
            <Hint text={TIER_MEANING[audit.tier]} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {operator.industry} · {operator.region} · {operator.vehicles.length}{" "}
            vehicles · check on {formatDate(audit.date)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Risk score
          </div>
          <div className="text-3xl font-semibold text-foreground">
            {audit.score.toFixed(1)}
            <span className="text-sm text-muted-foreground">/5</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left: evidence + findings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Evidence */}
          <div>
            <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              Evidence
              <Hint text="The photos the operator sent. In the demo these are placeholders; live, each pillar has a real photo." />
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(
                [
                  "asset_management",
                  "emergency_incident",
                  "site_safety_security",
                  "people_capability",
                ] as const
              ).map((pillar) => (
                <div
                  key={pillar}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <div className="flex aspect-square items-center justify-center bg-muted/60 text-muted-foreground/50">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div className="p-2 text-center text-[11px] leading-tight text-muted-foreground">
                    {PILLAR_LABEL[pillar]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Findings */}
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">
              What the check found
            </h2>
            <div className="space-y-3">
              {audit.findings.map((f, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border bg-card p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {PILLAR_LABEL[f.pillar]}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[f.status]}`}
                    >
                      {FINDING_STATUS_LABEL[f.status]}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {f.observation}
                  </p>
                  <div className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-sm text-foreground">
                    <span className="font-medium">Suggested fix: </span>
                    {f.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: trust + sign off */}
        <div className="space-y-6">
          {/* Trust signals */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                Genuineness checks
                <Hint text="Automatic checks that the evidence is real and not faked or reused. This is how we stop people gaming a self-report." />
              </h2>
              <span className="text-xs font-medium text-muted-foreground">
                {trust}%
              </span>
            </div>
            <ul className="mt-4 space-y-2.5">
              {signals.map((s) => (
                <li key={s.key} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                      s.ok
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-rose-100 text-rose-600"
                    }`}
                  >
                    {s.ok ? (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    ) : (
                      <X className="h-3 w-3" strokeWidth={3} />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                      {s.label}
                      <Hint text={s.hint} />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sign off */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Your decision
              </h2>
            </div>

            {aiApproved && !signed && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-sky-50 p-3 text-xs text-sky-700">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <p>
                  The AI already approved this one. You don&apos;t have to do
                  anything — but you can still check it and sign off if you want.
                </p>
              </div>
            )}

            <div className="mt-3 flex items-start gap-2 rounded-lg bg-accent/40 p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p>
                Nothing goes to the customer until you sign. The AI never
                approves or rejects cover on its own — a person always decides.
              </p>
            </div>

            {signed ? (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  Signed off by you
                  {audit.engineerDecision === "noted"
                    ? " · with your notes"
                    : " · agreed with AI"}
                </div>
                {audit.engineerNotes && (
                  <p className="rounded-lg bg-muted/60 px-3 py-2 text-sm text-foreground">
                    &ldquo;{audit.engineerNotes}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              <>
                {/* Choose: agree with AI, or add own notes */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMode("agreed")}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      mode === "agreed"
                        ? "border-primary bg-accent text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <span className="block font-medium">Agree with AI</span>
                    <span className="block text-xs text-muted-foreground">
                      Accept the result as-is
                    </span>
                  </button>
                  <button
                    onClick={() => setMode("noted")}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                      mode === "noted"
                        ? "border-primary bg-accent text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <span className="block font-medium">Add my notes</span>
                    <span className="block text-xs text-muted-foreground">
                      Record your own feedback
                    </span>
                  </button>
                </div>

                {mode === "noted" && (
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Your notes for this fleet — what you checked, what to watch, any conditions…"
                    className="mt-3 min-h-24"
                  />
                )}

                <Button
                  onClick={sign}
                  disabled={mode === "noted" && !notes.trim()}
                  className="mt-4 w-full gap-1.5"
                >
                  <PenLine className="h-4 w-4" />
                  {aiApproved ? "Sign off (spot-check)" : "Sign off this result"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
