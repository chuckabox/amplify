"use client";

import Link from "next/link";
import { Clock, MapPin, Gauge, TrendingUp, Info } from "lucide-react";
import { TierBadge } from "@/components/tier-badge";
import { Hint } from "@/components/hint";
import { useStore } from "@/lib/operator-store";
import { portfolio } from "@/lib/data/engineer";

const tierColor: Record<1 | 2 | 3, string> = {
  1: "bg-emerald-500",
  2: "bg-amber-500",
  3: "bg-rose-500",
};

const tierName: Record<1 | 2 | 3, string> = {
  1: "Passed on their own",
  2: "Needed a video",
  3: "Needed a visit",
};

export default function PortfolioPage() {
  const { operators } = useStore();
  const p = portfolio(operators);
  const maxTier = Math.max(1, ...p.byTier.map((t) => t.count));

  const impact = [
    {
      icon: Clock,
      label: "Engineer hours saved",
      value: `${p.hoursSaved}h`,
      hint: "Roughly 8 hours saved for every fleet that didn't need a site visit.",
    },
    {
      icon: MapPin,
      label: "Travel avoided",
      value: `${p.travelAvoidedKm.toLocaleString()} km`,
      hint: "Rough distance not driven because the check was done remotely.",
    },
    {
      icon: Gauge,
      label: "Coverage multiplier",
      value: `${p.multiplier.toFixed(1)}×`,
      hint: "How many fleets each in-person visit now covers. Higher is better.",
    },
    {
      icon: TrendingUp,
      label: "Fleets handled",
      value: `${p.total}`,
      hint: "Total fleets whose latest check is in your queue.",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Portfolio</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          The whole picture across every fleet — and the time this saves your
          team.
        </p>
      </div>

      {/* Why this exists */}
      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-border bg-accent/40 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <span className="font-medium text-foreground">Why this screen: </span>
          it turns the day-to-day queue into the numbers leadership cares about —
          how much travel and how many hours the tiered model removes.
        </p>
      </div>

      {/* Impact */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {impact.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {m.label}
                <Hint text={m.hint} />
              </span>
              <m.icon className="h-4 w-4 text-muted-foreground/70" />
            </div>
            <div className="mt-3 text-2xl font-semibold text-foreground">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Results split */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            How checks came out
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Most fleets clear without a visit — only the top band needs you.
          </p>
          <div className="mt-5 space-y-4">
            {p.byTier.map((t) => (
              <div key={t.tier}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <span
                      className={`h-2 w-2 rounded-full ${tierColor[t.tier]}`}
                    />
                    {tierName[t.tier]}
                  </span>
                  <span className="font-medium text-foreground">{t.count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${tierColor[t.tier]}`}
                    style={{ width: `${(t.count / maxTier) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top risk */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Fleets to watch
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Highest risk scores first — the ones most likely to need attention.
          </p>
          <ul className="mt-4 divide-y divide-border">
            {p.topRisk.map((r) => (
              <li
                key={r.name}
                className="flex items-center justify-between py-2.5"
              >
                <span className="flex items-center gap-2.5">
                  <TierBadge tier={r.tier} />
                  <span className="text-sm font-medium text-foreground">
                    {r.name}
                  </span>
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {r.score.toFixed(1)}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / 5
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/queue"
          className="text-sm font-medium text-primary hover:underline"
        >
          Back to the queue
        </Link>
      </div>
    </main>
  );
}
