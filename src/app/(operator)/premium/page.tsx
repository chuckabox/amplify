"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { Reveal } from "@/components/motion";
import { useStore } from "@/lib/operator-store";
import {
  fleetBasePremium,
  mileageLoading,
  riskMultiplier,
  computePremium,
  totalOdometer,
  formatCurrency,
  formatDate,
  VEHICLE_BASE_RATE,
  VEHICLE_TYPES,
  MILEAGE_RATE_PER_MILLION_KM,
  type VehicleType,
} from "@/lib/data/operators";

export default function PremiumPage() {
  const { current } = useStore();
  if (!current) return null;

  const base = fleetBasePremium(current.vehicles);
  const mult = riskMultiplier(current);
  const loading = mileageLoading(current.vehicles);
  const premium = computePremium(current);
  const latest = current.audits[0];
  const riskAdjustment = Math.round(base * mult - base);
  const odo = totalOdometer(current.vehicles);

  const byType = VEHICLE_TYPES.map((t) => ({
    type: t as VehicleType,
    count: current.vehicles.filter((v) => v.type === t).length,
  })).filter((r) => r.count > 0);

  return (
    <main id="main" className="mx-auto w-full max-w-[1000px] flex-1 px-6 py-12">
      <Reveal>
        <div className="border-b border-rule pb-8">
          <p className="field-label">Schedule of rating</p>
          <h1 className="mt-4 text-[clamp(2rem,4vw,2.75rem)] leading-[1.02]">
            How your premium is built
          </h1>
          <p className="mt-4 max-w-[62ch] leading-[1.7] text-ink-muted">
            Three lines, in order. Nothing here is a black box — if the figure
            changes, one of these three moved.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        {/* ---------- The calculation sheet ---------- */}
        <Reveal delay={0.08} className="lg:col-span-7">
          <section aria-labelledby="calc-heading">
            <h2 id="calc-heading" className="field-label">
              Calculation
            </h2>

            {/* 1 — base */}
            <div className="mt-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ink-faint">01</span>
                <h3 className="text-[15px] font-semibold">Fleet base rate</h3>
              </div>
              <dl className="mt-4 space-y-2.5">
                {byType.map((r) => (
                  <div
                    key={r.type}
                    className="flex items-baseline justify-between gap-4 text-sm"
                  >
                    <dt className="flex items-baseline gap-2 text-ink-muted">
                      <span className="font-mono tabular-nums">{r.count}×</span>
                      <span>{r.type}</span>
                      <span className="font-mono text-xs text-ink-faint">
                        @ {formatCurrency(VEHICLE_BASE_RATE[r.type])}
                      </span>
                    </dt>
                    {/* dotted leader, as a printed schedule sets it */}
                    <span
                      className="mx-2 flex-1 translate-y-[-3px] border-b border-dotted border-rule-strong"
                      aria-hidden
                    />
                    <dd className="font-mono tabular-nums">
                      {formatCurrency(VEHICLE_BASE_RATE[r.type] * r.count)}
                    </dd>
                  </div>
                ))}
                <div className="flex items-baseline justify-between border-t border-rule pt-3 text-sm font-medium">
                  <dt>Base subtotal</dt>
                  <dd className="font-mono tabular-nums">
                    {formatCurrency(base)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* 2 — audit adjustment */}
            <div className="mt-10">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ink-faint">02</span>
                <h3 className="text-[15px] font-semibold">Audit adjustment</h3>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 text-sm">
                <div className="flex items-center gap-3">
                  {latest ? (
                    <TierBadge tier={latest.tier} />
                  ) : (
                    <span className="text-ink-muted">No audit on file</span>
                  )}
                  <span className="font-mono tabular-nums text-ink-muted">
                    ×{mult.toFixed(2)}
                  </span>
                </div>
                <span
                  className={`font-mono tabular-nums ${
                    riskAdjustment < 0 ? "text-tier-1-ink" : "text-tier-3-ink"
                  }`}
                >
                  {riskAdjustment < 0 ? "−" : "+"}
                  {formatCurrency(Math.abs(riskAdjustment))}
                </span>
              </div>
              <p className="mt-3 max-w-[58ch] text-xs leading-relaxed text-ink-muted">
                {latest
                  ? `Applied from ${latest.id}, submitted ${formatDate(latest.date)}. A Tier 1 outcome discounts the base rate; Tier 2 and Tier 3 load it.`
                  : "Policies without a completed audit carry a 1.18× loading until one is submitted."}
              </p>
            </div>

            {/* 3 — distance */}
            <div className="mt-10">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-ink-faint">03</span>
                <h3 className="text-[15px] font-semibold">Distance loading</h3>
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4 text-sm">
                <span className="text-ink-muted">
                  <span className="font-mono tabular-nums">
                    {(odo / 1_000_000).toFixed(2)}M
                  </span>{" "}
                  fleet km at{" "}
                  <span className="font-mono tabular-nums">
                    {formatCurrency(MILEAGE_RATE_PER_MILLION_KM)}
                  </span>{" "}
                  per million
                </span>
                <span className="font-mono tabular-nums">
                  +{formatCurrency(loading)}
                </span>
              </div>
            </div>

            {/* total */}
            <div className="mt-10 border-t-[3px] border-double border-rule-strong pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <span className="text-lg font-semibold">Annual premium</span>
                <span className="font-mono text-[2.25rem] leading-none tabular-nums tracking-[-0.04em]">
                  {formatCurrency(premium)}
                </span>
              </div>
              <p className="mt-3 font-mono text-[11px] text-ink-muted">
                ROUNDED TO THE NEAREST $10 · EXCESS{" "}
                {formatCurrency(current.policy.excess)}
              </p>
            </div>
          </section>
        </Reveal>

        {/* ---------- Side ---------- */}
        <Reveal delay={0.14} className="lg:col-span-5">
          <div className="space-y-8">
            <section className="border border-rule bg-paper-raised p-7">
              <h2 className="text-[15px] font-semibold">
                What actually moves this figure
              </h2>
              <ol className="mt-5 space-y-5">
                {[
                  {
                    n: "01",
                    body: "A Tier 1 outcome applies a 0.88× discount to the base rate. On this fleet that is worth roughly " +
                      formatCurrency(Math.abs(Math.round(base * 0.88 - base))) +
                      " a year.",
                  },
                  {
                    n: "02",
                    body: "Clearing open findings before the next audit lifts the score, which is what decides the tier.",
                  },
                  {
                    n: "03",
                    body: "Evidence attested by an accredited workshop raises the trust signal and clears more items without a follow-up.",
                  },
                ].map((item) => (
                  <li key={item.n} className="flex gap-4">
                    <span className="font-mono text-xs text-ink-faint">
                      {item.n}
                    </span>
                    <p className="text-[13px] leading-relaxed text-ink-muted">
                      {item.body}
                    </p>
                  </li>
                ))}
              </ol>
              <Link href="/audit/new" className="mt-7 block">
                <Button variant="accent" className="w-full">
                  Run a guided audit
                </Button>
              </Link>
            </section>

            <section className="border border-rule bg-paper-raised p-7">
              <h2 className="field-label">Policy</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Number", current.policy.number],
                  ["Excess", formatCurrency(current.policy.excess)],
                  ["Rating", current.policy.riskRating],
                  [
                    "Review cycle",
                    `${current.policy.auditIntervalMonths} months`,
                  ],
                  ...(latest
                    ? ([["Priced on", formatDate(latest.date)]] as [
                        string,
                        string,
                      ][])
                    : []),
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-muted">{k}</dt>
                    <dd className="font-mono text-xs tabular-nums">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 border-t border-rule pt-5">
                <span className="field-label">Covers</span>
                <ul className="mt-3 space-y-2">
                  {current.policy.coverage.map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-2.5 text-[13px] text-ink-muted"
                    >
                      <span
                        className="mt-[6px] size-1.5 shrink-0 bg-accent"
                        aria-hidden
                      />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
