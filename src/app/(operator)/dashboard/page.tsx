"use client";

import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { TierBadge, StatusStamp } from "@/components/tier-badge";
import { Figure } from "@/components/figure";
import { Reveal } from "@/components/motion";
import { useStore } from "@/lib/operator-store";
import {
  computePremium,
  formatCurrency,
  formatDate,
  nextAuditDue,
  daysUntil,
  totalOdometer,
  PILLAR_LABEL,
} from "@/lib/data/operators";

export default function OperatorDashboard() {
  const { current } = useStore();
  if (!current) return null;

  const premium = computePremium(current);
  const due = nextAuditDue(current);
  const dueDays = daysUntil(due);
  const latest = current.audits[0];
  const odo = totalOdometer(current.vehicles);

  const ledger = [
    {
      href: "/fleet",
      label: "Fleet",
      value: String(current.vehicles.length),
      unit: "vehicles",
      note: "Add or retire a vehicle to re-price",
    },
    {
      href: "/premium",
      label: "Annual premium",
      value: formatCurrency(premium),
      note: "See the arithmetic",
    },
    {
      href: "/fleet",
      label: "Fleet distance",
      value: (odo / 1_000_000).toFixed(2),
      unit: "M km",
      note: "Loaded at $3,420 per million",
    },
    {
      href: "/audit/new",
      label: "Next audit",
      value: dueDays > 0 ? String(dueDays) : "Due",
      unit: dueDays > 0 ? "days" : "now",
      note: `Falls due ${formatDate(due)}`,
    },
  ];

  return (
    <main id="main" className="mx-auto w-full max-w-[1240px] flex-1 px-6 py-12">
      {/* ---------- Docket head ---------- */}
      <Reveal>
        <div className="flex flex-col justify-between gap-8 border-b border-rule pb-9 md:flex-row md:items-end">
          <div>
            <p className="field-label">
              {current.industry} · {current.region}
            </p>
            <h1 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.02]">
              {current.name}
            </h1>
            <dl className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-2 font-mono text-xs text-ink-muted">
              <div className="flex gap-2">
                <dt className="text-ink-faint">POLICY</dt>
                <dd>{current.policy.number}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-faint">RATING</dt>
                <dd className="text-ink">{current.policy.riskRating}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ink-faint">SINCE</dt>
                <dd>{current.memberSince}</dd>
              </div>
            </dl>
          </div>

          <Link href="/audit/new" className="shrink-0">
            <Button variant="accent" size="lg" className="w-full md:w-auto">
              Start an audit
              <ButtonIconWell>
                <span className="font-mono text-xs">→</span>
              </ButtonIconWell>
            </Button>
          </Link>
        </div>
      </Reveal>

      {/* ---------- Ledger ---------- */}
      <Reveal delay={0.08}>
        <div className="mt-px grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {ledger.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="group bg-paper-raised p-6 transition-colors duration-200 ease-docket hover:bg-accent-wash/35"
            >
              <Figure label={s.label} value={s.value} unit={s.unit} />
              <span className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
                {s.note}
                <span
                  className="font-mono transition-transform duration-200 ease-docket group-hover:translate-x-0.5"
                  aria-hidden
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* ---------- Latest audit + premium ---------- */}
      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <Reveal delay={0.12} className="lg:col-span-7">
          <div className="flex items-baseline justify-between gap-4 border-b border-rule pb-3">
            <h2 className="text-xl">Most recent audit</h2>
            {latest && (
              <Link
                href={`/audits/${latest.id}`}
                className="text-[13px] text-ink-muted underline decoration-rule-strong underline-offset-4 hover:text-ink"
              >
                Full record
              </Link>
            )}
          </div>

          {latest ? (
            <div className="pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <TierBadge tier={latest.tier} />
                <span className="font-mono text-xs text-ink-muted">
                  {latest.id} · {formatDate(latest.date)} · SCORE{" "}
                  {latest.score.toFixed(1)}/5
                </span>
              </div>

              <p className="mt-5 max-w-[62ch] leading-[1.7] text-ink-muted">
                {latest.reason}
              </p>

              <h3 className="field-label mt-9">Findings</h3>
              <ul className="mt-3 divide-y divide-rule border-t border-rule">
                {latest.findings.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start justify-between gap-5 py-4"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium">
                        {PILLAR_LABEL[f.pillar]}
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">
                        {f.observation}
                      </p>
                    </div>
                    <StatusStamp status={f.status} className="mt-0.5 shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <EmptyState
              className="mt-6"
              title="No audit on file yet"
              body="Your premium is currently carrying the un-audited loading of 1.18×. Running the guided audit replaces that estimate with a figure priced on your own evidence — it takes about ten minutes in the yard."
              action={
                <Link href="/audit/new">
                  <Button variant="accent">Start your first audit</Button>
                </Link>
              }
            />
          )}
        </Reveal>

        {/* Side column */}
        <Reveal delay={0.18} className="lg:col-span-5">
          <div className="space-y-8">
            <div className="plate">
              <div className="plate-core p-7">
                <span className="field-label">Annual premium</span>
                <div className="mt-4 font-mono text-[2.75rem] leading-none tabular-nums tracking-[-0.04em]">
                  {formatCurrency(premium)}
                </div>
                {latest ? (
                  <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
                    Priced on your {formatDate(latest.date)} audit, which
                    applied a {latest.tier === 1 ? "0.88×" : latest.tier === 2 ? "1.14×" : "1.42×"}{" "}
                    adjustment to the fleet base rate.
                  </p>
                ) : (
                  <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
                    Carrying the un-audited loading until your first submission.
                  </p>
                )}
                <Link href="/premium" className="mt-6 block">
                  <Button variant="outline" className="w-full">
                    How this is calculated
                  </Button>
                </Link>
              </div>
            </div>

            <div className="border border-rule bg-paper-raised p-7">
              <span className="field-label">Against comparable fleets</span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-[2.75rem] leading-none tabular-nums tracking-[-0.04em]">
                  {current.benchmarkPercentile}
                </span>
                <span className="text-sm text-ink-muted">th percentile</span>
              </div>

              {/* A ruled scale, not a rounded progress pill */}
              <div className="mt-6" aria-hidden>
                <div className="relative h-8">
                  <div className="absolute inset-x-0 top-4 h-px bg-rule-strong" />
                  {Array.from({ length: 11 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute top-4 h-2 w-px bg-rule-strong"
                      style={{ left: `${i * 10}%` }}
                    />
                  ))}
                  <span
                    className="absolute top-0 h-8 w-[2px] bg-ink"
                    style={{ left: `${current.benchmarkPercentile}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-faint">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <p className="mt-5 text-[13px] leading-relaxed text-ink-muted">
                Safer than {current.benchmarkPercentile}% of fleets in the same
                region and size band. The comparison uses audited outcomes, not
                claims history.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
