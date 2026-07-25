"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TierBadge, StatusStamp } from "@/components/tier-badge";
import { Figure } from "@/components/figure";
import { Reveal } from "@/components/motion";
import { useStore } from "@/lib/operator-store";
import {
  formatCurrency,
  formatDate,
  PILLAR_LABEL,
} from "@/lib/data/operators";

const SEVERITY_LABEL: Record<number, string> = {
  1: "Negligible",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Critical",
};

export default function AuditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { current } = useStore();
  if (!current) return null;

  const audit = current.audits.find((a) => a.id === id);

  if (!audit) {
    return (
      <main id="main" className="mx-auto w-full max-w-[760px] flex-1 px-6 py-16">
        <EmptyState
          title="No audit with that reference"
          body={`We couldn't find ${id} on this policy. It may belong to a different fleet, or the link may be out of date.`}
          action={
            <Link href="/audits">
              <Button variant="outline">Back to audit history</Button>
            </Link>
          }
        />
      </main>
    );
  }

  const delta = audit.premiumAfter - audit.premiumBefore;
  const down = delta < 0;

  return (
    <main id="main" className="mx-auto w-full max-w-[820px] flex-1 px-6 py-12">
      <Reveal>
        <Link
          href="/audits"
          className="inline-flex items-center gap-2 text-[13px] text-ink-muted transition-colors hover:text-ink"
        >
          <span className="font-mono" aria-hidden>
            ←
          </span>
          Audit history
        </Link>

        {/* Certificate head */}
        <div className="mt-6 border-t-[3px] border-double border-rule-strong pt-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <TierBadge tier={audit.tier} />
            <span className="font-mono text-[11px] tracking-[0.08em] text-ink-muted">
              {audit.id} · {formatDate(audit.date)}
            </span>
          </div>

          <h1 className="mt-6 max-w-[24ch] text-[clamp(1.75rem,3.4vw,2.375rem)] leading-[1.08]">
            {audit.tier === 1
              ? "Cleared on the evidence supplied"
              : audit.tier === 2
                ? "Held for remote verification"
                : "Escalated for a site visit"}
          </h1>

          <p className="mt-5 max-w-[62ch] leading-[1.7] text-ink-muted">
            {audit.reason}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-10 grid grid-cols-3 gap-px border border-rule bg-rule">
          <div className="bg-paper-raised p-6">
            <Figure
              label="Risk score"
              value={audit.score.toFixed(1)}
              unit="/ 5"
              tone={
                audit.tier === 1
                  ? "tier-1"
                  : audit.tier === 2
                    ? "tier-2"
                    : "tier-3"
              }
            />
          </div>
          <div className="bg-paper-raised p-6">
            <Figure label="Findings" value={String(audit.findings.length)} />
          </div>
          <div className="bg-paper-raised p-6">
            <Figure
              label="Premium effect"
              value={`${down ? "−" : "+"}${formatCurrency(Math.abs(delta))}`}
              tone={down ? "tier-1" : "tier-3"}
              note={`${formatCurrency(audit.premiumBefore)} → ${formatCurrency(audit.premiumAfter)}`}
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.12}>
        <h2 className="field-label mt-14">Findings register</h2>
        <div className="mt-4 divide-y divide-rule border-y border-rule">
          {audit.findings.map((f, i) => (
            <article key={i} className="py-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[11px] text-ink-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-base font-semibold">
                    {PILLAR_LABEL[f.pillar]}
                  </h3>
                </div>
                <StatusStamp status={f.status} />
              </div>

              <p className="mt-4 max-w-[62ch] text-sm leading-relaxed text-ink-muted">
                {f.observation}
              </p>

              {/* Severity as a stepped gauge, ruled like a measure */}
              <div className="mt-5 flex items-center gap-3">
                <span className="field-label">Severity</span>
                <span className="flex gap-1" aria-hidden>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={`h-2.5 w-7 ${
                        n <= f.severity
                          ? f.severity >= 4
                            ? "bg-tier-3"
                            : f.severity === 3
                              ? "bg-tier-2"
                              : "bg-tier-1"
                          : "bg-paper-sunk"
                      }`}
                    />
                  ))}
                </span>
                <span className="text-xs text-ink-muted">
                  {SEVERITY_LABEL[f.severity]} ({f.severity}/5)
                </span>
              </div>

              <div className="mt-5 border-l-2 border-accent bg-accent-wash/35 px-4 py-3">
                <span className="field-label">What to do</span>
                <p className="mt-1.5 text-sm leading-relaxed text-ink">
                  {f.recommendation}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t-[3px] border-double border-rule-strong pt-6">
          <p className="max-w-[46ch] text-xs leading-relaxed text-ink-muted">
            Signed off by an NTI risk engineer. Routing is automated; the
            outcome on this record is not.
          </p>
          <Link href="/audits">
            <Button variant="outline" size="sm">
              Back to history
            </Button>
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
