"use client";

import Link from "next/link";
import {
  Truck,
  Wallet,
  Route,
  CalendarClock,
  ArrowRight,
  ClipboardCheck,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { Hint } from "@/components/hint";
import { OperatorTour } from "@/components/operator-tour";
import { useStore } from "@/lib/operator-store";
import {
  computePremium,
  formatCurrency,
  formatDate,
  nextAuditDue,
  daysUntil,
  totalOdometer,
  PILLAR_LABEL,
  FINDING_STATUS_LABEL,
  TIER_MEANING,
} from "@/lib/data/operators";

const statusStyles: Record<string, string> = {
  clear: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  advisory: "bg-amber-50 text-amber-700 ring-amber-600/15",
  action: "bg-rose-50 text-rose-700 ring-rose-600/15",
};

export default function OperatorDashboard() {
  const { current } = useStore();
  if (!current) return null;

  const premium = computePremium(current);
  const due = nextAuditDue(current);
  const dueDays = daysUntil(due);
  const latest = current.audits[0];
  const odo = totalOdometer(current.vehicles);

  const stats = [
    {
      href: "/fleet",
      icon: Truck,
      label: "Fleet size",
      value: `${current.vehicles.length}`,
      sub: "vehicles — manage fleet",
    },
    {
      href: "/premium",
      icon: Wallet,
      label: "Yearly price",
      value: formatCurrency(premium),
      sub: "see how it's worked out",
    },
    {
      href: "/fleet",
      icon: Route,
      label: "Total distance driven",
      value: `${(odo / 1_000_000).toFixed(2)}M km`,
      sub: "across the fleet",
    },
    {
      href: "/audit/new",
      icon: CalendarClock,
      label: "Next check due",
      value: dueDays > 0 ? `${dueDays} days` : "Due now",
      sub: `due ${formatDate(due)}`,
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Greeting banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-primary-foreground/75">
              {current.industry} · {current.region}
            </p>
            <h1 className="mt-1 text-2xl font-semibold">{current.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/80">
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium">
                {current.policy.riskRating}
              </span>
              <span>Policy {current.policy.number}</span>
            </div>
            <div className="mt-3">
              <OperatorTour />
            </div>
          </div>
          <Link href="/audit/new" data-tour="start-audit">
            <Button
              size="lg"
              className="gap-2 bg-white text-primary hover:bg-white/90"
            >
              <ClipboardCheck className="h-4 w-4" />
              Start safety check
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats (clickable) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" data-tour="stats">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {s.label}
              </span>
              <s.icon className="h-4 w-4 text-muted-foreground/70" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-foreground">
              {s.value}
            </div>
            <div className="mt-0.5 flex items-center gap-0.5 text-xs text-muted-foreground">
              {s.sub}
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      {/* Two column */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {/* Latest audit */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              Your last safety check
            </h2>
            {latest && (
              <Link
                href={`/audits/${latest.id}`}
                className="text-xs font-medium text-primary hover:underline"
              >
                View details
              </Link>
            )}
          </div>

          {latest ? (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <TierBadge tier={latest.tier} />
                <Hint text={TIER_MEANING[latest.tier]} />
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  {formatDate(latest.date)} · score {latest.score.toFixed(1)}/5
                  <Hint text="Lower is safer. 1 is the best score, 5 is the worst." />
                </span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {latest.reason}
              </p>
              <ul className="mt-4 divide-y divide-border">
                {latest.findings.map((f, i) => (
                  <li key={i} className="flex items-center justify-between py-2.5">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {PILLAR_LABEL[f.pillar]}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {f.observation}
                      </div>
                    </div>
                    <span
                      className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[f.status]}`}
                    >
                      {FINDING_STATUS_LABEL[f.status]}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No safety checks yet. Do your first one to set your price.
            </p>
          )}
        </div>

        {/* Premium / benchmark */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-accent/50 p-6" data-tour="premium">
            <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
              Your yearly price
              <Hint text="Your insurance premium — what you pay NTI each year to be covered." />
            </h2>
            <div className="mt-3 text-3xl font-semibold text-foreground">
              {formatCurrency(premium)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">per year</p>
            {latest && (
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-card px-2 py-0.5 text-xs font-medium text-emerald-700">
                <TrendingDown className="h-3 w-3" />
                Based on your {formatDate(latest.date)} check
              </div>
            )}
            <Link href="/premium">
              <Button variant="outline" size="sm" className="mt-4 w-full gap-1">
                See how it&apos;s worked out
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">
              How you compare
            </h2>
            <div className="mt-3 flex items-end gap-1">
              <span className="text-3xl font-semibold text-foreground">
                Top {100 - current.benchmarkPercentile}%
              </span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${current.benchmarkPercentile}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Safer than {current.benchmarkPercentile}% of similar fleets your
              size in your area.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
