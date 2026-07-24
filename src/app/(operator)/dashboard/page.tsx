import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  Route,
  CalendarClock,
  ArrowRight,
  ClipboardCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { TierBadge } from "@/components/tier-badge";

const stats = [
  { icon: Truck, label: "Fleet size", value: "45", sub: "active vehicles" },
  { icon: ShieldCheck, label: "Annual premium", value: "$285k", sub: "all-risk coverage" },
  { icon: Route, label: "Total mileage", value: "2.1M", sub: "fleet km, YTD" },
  { icon: CalendarClock, label: "Next audit", value: "21 days", sub: "due 15 Aug 2026" },
];

const pillars = [
  { name: "Asset management", detail: "Tyre & brake inspection" },
  { name: "Site safety & security", detail: "Load restraint verification" },
  { name: "People & capability", detail: "Driver training records" },
  { name: "Emergency & incident", detail: "Fire equipment check" },
];

export default function OperatorDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* App bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Logo href="/dashboard" />
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="hidden text-sm text-muted-foreground sm:block">
              Acme Transport
            </span>
          </div>
          <div className="flex items-center gap-3">
            <TierBadge tier={1} label="Compliant" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              AT
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your policy, audit status and recent findings at a glance.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card p-5"
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
              <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Primary action */}
        <div className="mt-6 flex flex-col items-start justify-between gap-6 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-center">
          <div className="max-w-lg">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Run your next guided audit
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Capture evidence across the four pillars from your phone. Most
              audits take around fifteen minutes and get an instant risk result.
            </p>
          </div>
          <div className="flex w-full shrink-0 gap-3 sm:w-auto">
            <Link href="/dashboard" className="flex-1 sm:flex-none">
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                Start audit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              History
            </Button>
          </div>
        </div>

        {/* Two column */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {/* Last audit */}
          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                Last audit summary
              </h3>
              <span className="text-xs text-muted-foreground">
                Submitted 12 Jul 2026
              </span>
            </div>
            <ul className="divide-y divide-border">
              {pillars.map((p) => (
                <li
                  key={p.name}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {p.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.detail}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/15">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Clear
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk score */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground">
              Overall risk score
            </h3>
            <div className="mt-6 flex items-end gap-1.5">
              <span className="text-5xl font-semibold text-foreground">1.8</span>
              <span className="mb-1.5 text-sm text-muted-foreground">/ 5.0</span>
            </div>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: "36%" }}
              />
            </div>
            <div className="mt-4">
              <TierBadge tier={1} label="Tier 1 · Auto-cleared" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Your fleet meets all NTI standards this period. No immediate action
              is required.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
