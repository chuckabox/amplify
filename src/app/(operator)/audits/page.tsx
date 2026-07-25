"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TierBadge } from "@/components/tier-badge";
import { Reveal } from "@/components/motion";
import { useStore } from "@/lib/operator-store";
import { formatCurrency, formatDate } from "@/lib/data/operators";

export default function AuditsPage() {
  const { current } = useStore();
  if (!current) return null;

  return (
    <main id="main" className="mx-auto w-full max-w-[900px] flex-1 px-6 py-12">
      <Reveal>
        <div className="flex flex-col justify-between gap-6 border-b border-rule pb-8 md:flex-row md:items-end">
          <div>
            <p className="field-label">Record of submissions</p>
            <h1 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.02]">
              Audit history
            </h1>
            <p className="mt-4 max-w-[58ch] text-sm leading-relaxed text-ink-muted">
              Every submission on this policy, where it was routed, and what it
              did to the premium.
            </p>
          </div>
          <Link href="/audit/new" className="shrink-0">
            <Button>New audit</Button>
          </Link>
        </div>
      </Reveal>

      {current.audits.length === 0 ? (
        <Reveal delay={0.08} className="mt-10">
          <EmptyState
            title="Nothing submitted yet"
            body="Once you complete a guided audit it lands here with its routing decision, its findings, and the effect it had on your premium."
            action={
              <Link href="/audit/new">
                <Button variant="accent">Start your first audit</Button>
              </Link>
            }
          />
        </Reveal>
      ) : (
        <Reveal delay={0.08}>
          <ul className="mt-10 divide-y divide-rule border-y border-rule">
            {current.audits.map((a) => {
              const delta = a.premiumAfter - a.premiumBefore;
              const down = delta < 0;
              return (
                <li key={a.id}>
                  <Link
                    href={`/audits/${a.id}`}
                    className="group flex items-start gap-6 py-7 transition-colors duration-200 ease-docket hover:bg-paper-sunk/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <TierBadge tier={a.tier} />
                        <span className="font-mono text-[11px] text-ink-muted">
                          {a.id} · {formatDate(a.date)}
                        </span>
                      </div>
                      <p className="mt-3 max-w-[62ch] text-sm leading-relaxed text-ink">
                        {a.reason}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-ink-muted">
                        {a.findings.length}{" "}
                        {a.findings.length === 1 ? "FINDING" : "FINDINGS"} ·
                        SCORE {a.score.toFixed(1)}/5
                      </p>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      <div
                        className={`font-mono text-lg tabular-nums ${
                          down ? "text-tier-1-ink" : "text-tier-3-ink"
                        }`}
                      >
                        {down ? "−" : "+"}
                        {formatCurrency(Math.abs(delta))}
                      </div>
                      <div className="mt-1 text-[11px] text-ink-muted">
                        premium {down ? "saved" : "loaded"}
                      </div>
                    </div>

                    <span
                      className="mt-1 shrink-0 font-mono text-ink-faint transition-transform duration-200 ease-docket group-hover:translate-x-1 group-hover:text-ink"
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Reveal>
      )}
    </main>
  );
}
