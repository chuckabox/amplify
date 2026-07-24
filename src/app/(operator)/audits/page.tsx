"use client";

import Link from "next/link";
import { ClipboardCheck, ChevronRight, TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TierBadge } from "@/components/tier-badge";
import { useStore } from "@/lib/operator-store";
import { formatCurrency, formatDate } from "@/lib/data/operators";

export default function AuditsPage() {
  const { current } = useStore();
  if (!current) return null;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Audit history
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every submission, its outcome and its effect on your premium.
          </p>
        </div>
        <Link href="/audit/new">
          <Button className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            New audit
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {current.audits.map((a) => {
          const delta = a.premiumAfter - a.premiumBefore;
          const down = delta < 0;
          return (
            <Link
              key={a.id}
              href={`/audits/${a.id}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <TierBadge tier={a.tier} />
                  <span className="font-mono text-xs text-muted-foreground">
                    {a.id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(a.date)}
                  </span>
                </div>
                <p className="mt-2 truncate text-sm text-foreground">
                  {a.reason}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {a.findings.length} findings · score {a.score.toFixed(1)}/5
                </p>
              </div>

              <div className="hidden text-right sm:block">
                <div
                  className={`inline-flex items-center gap-1 text-sm font-medium ${
                    down ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {down ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  {down ? "−" : "+"}
                  {formatCurrency(Math.abs(delta))}
                </div>
                <div className="text-xs text-muted-foreground">
                  premium {down ? "saved" : "loaded"}
                </div>
              </div>

              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </main>
  );
}
