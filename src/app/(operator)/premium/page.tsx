"use client";

import Link from "next/link";
import { Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { useStore } from "@/lib/operator-store";
import {
  fleetBasePremium,
  mileageLoading,
  riskMultiplier,
  computePremium,
  formatCurrency,
  formatDate,
  VEHICLE_BASE_RATE,
  VEHICLE_TYPES,
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

  // Group vehicles by type for the base breakdown.
  const byType = VEHICLE_TYPES.map((t) => ({
    type: t as VehicleType,
    count: current.vehicles.filter((v) => v.type === t).length,
  })).filter((r) => r.count > 0);

  const multLabel =
    mult < 1 ? "discount" : mult > 1 ? "loading" : "neutral";

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          Premium breakdown
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Exactly how your {formatCurrency(premium)} annual premium is
          calculated — and how your audit changes it.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Calculation */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">Calculation</h2>

          {/* Base by vehicle type */}
          <div className="mt-4 space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              1 · Fleet base rate
            </div>
            {byType.map((r) => (
              <div
                key={r.type}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {r.count} × {r.type}
                  <span className="text-muted-foreground/60">
                    {" "}
                    @ {formatCurrency(VEHICLE_BASE_RATE[r.type])}
                  </span>
                </span>
                <span className="font-medium text-foreground">
                  {formatCurrency(VEHICLE_BASE_RATE[r.type] * r.count)}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between border-t border-border pt-2 text-sm">
              <span className="font-medium text-foreground">Base subtotal</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(base)}
              </span>
            </div>
          </div>

          {/* Risk multiplier */}
          <div className="mt-6 space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              2 · Audit risk adjustment
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                {latest ? (
                  <>
                    <TierBadge tier={latest.tier} /> ×{mult.toFixed(2)}{" "}
                    {multLabel}
                  </>
                ) : (
                  <>Un-audited loading ×{mult.toFixed(2)}</>
                )}
              </span>
              <span
                className={`font-medium ${
                  riskAdjustment < 0 ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {riskAdjustment < 0 ? "−" : "+"}
                {formatCurrency(Math.abs(riskAdjustment))}
              </span>
            </div>
          </div>

          {/* Mileage loading */}
          <div className="mt-6 space-y-2">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              3 · Fleet mileage loading
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                ~$3,500 per million fleet km
              </span>
              <span className="font-medium text-foreground">
                +{formatCurrency(loading)}
              </span>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between rounded-xl bg-accent/60 px-4 py-3">
            <span className="text-sm font-semibold text-foreground">
              Annual premium
            </span>
            <span className="text-xl font-semibold text-foreground">
              {formatCurrency(premium)}
            </span>
          </div>
        </div>

        {/* Side: how to lower it */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Lower your premium
              </h2>
            </div>
            <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
              <li>
                A <span className="font-medium text-foreground">Tier 1</span>{" "}
                audit applies a 0.90× discount to your base rate.
              </li>
              <li>
                Resolving open findings before your next audit improves your
                score and rating.
              </li>
              <li>
                Workshop-attested evidence raises trust and clears more items
                automatically.
              </li>
            </ul>
            <Link href="/audit/new">
              <Button className="mt-5 w-full gap-2">
                Run a guided audit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold text-foreground">Policy</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Number</dt>
                <dd className="font-medium text-foreground">
                  {current.policy.number}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Excess</dt>
                <dd className="font-medium text-foreground">
                  {formatCurrency(current.policy.excess)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Rating</dt>
                <dd className="font-medium text-foreground">
                  {current.policy.riskRating}
                </dd>
              </div>
              {latest && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Priced on</dt>
                  <dd className="font-medium text-foreground">
                    {formatDate(latest.date)}
                  </dd>
                </div>
              )}
            </dl>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {current.policy.coverage.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
