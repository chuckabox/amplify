"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TierBadge } from "@/components/tier-badge";
import { useStore } from "@/lib/operator-store";
import {
  formatCurrency,
  formatDate,
  PILLAR_LABEL,
  type FindingStatus,
} from "@/lib/data/operators";

const statusStyles: Record<FindingStatus, string> = {
  clear: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  advisory: "bg-amber-50 text-amber-700 ring-amber-600/15",
  action: "bg-rose-50 text-rose-700 ring-rose-600/15",
};

const severityLabel: Record<number, string> = {
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
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-sm text-muted-foreground">Audit not found.</p>
        <Link
          href="/audits"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to audit history
        </Link>
      </main>
    );
  }

  const delta = audit.premiumAfter - audit.premiumBefore;
  const down = delta < 0;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href="/audits"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Audit history
      </Link>

      {/* Header */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center gap-3">
          <TierBadge tier={audit.tier} />
          <span className="font-mono text-xs text-muted-foreground">
            {audit.id}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(audit.date)}
          </span>
        </div>
        <p className="mt-3 text-foreground">{audit.reason}</p>

        <div className="mt-5 grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Risk score
            </div>
            <div className="mt-1 text-2xl font-semibold text-foreground">
              {audit.score.toFixed(1)}
              <span className="text-sm text-muted-foreground">/5</span>
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Findings
            </div>
            <div className="mt-1 text-2xl font-semibold text-foreground">
              {audit.findings.length}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Premium
            </div>
            <div
              className={`mt-1 text-2xl font-semibold ${
                down ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {down ? "−" : "+"}
              {formatCurrency(Math.abs(delta))}
            </div>
          </div>
        </div>
      </div>

      {/* Findings */}
      <h2 className="mt-8 mb-3 text-sm font-semibold text-foreground">
        Findings
      </h2>
      <div className="space-y-3">
        {audit.findings.map((f, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {PILLAR_LABEL[f.pillar]}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${statusStyles[f.status]}`}
              >
                {f.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {f.observation}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Severity
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`h-1.5 w-6 rounded-full ${
                      n <= f.severity
                        ? f.severity >= 4
                          ? "bg-rose-500"
                          : f.severity === 3
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {severityLabel[f.severity]}
              </span>
            </div>
            <div className="mt-3 rounded-lg bg-muted/60 px-3 py-2 text-sm text-foreground">
              <span className="font-medium">Recommendation: </span>
              {f.recommendation}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
