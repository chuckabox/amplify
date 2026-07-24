import {
  Inbox,
  CircleCheck,
  Video,
  MapPin,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { TierBadge } from "@/components/tier-badge";

const metrics = [
  { icon: Inbox, label: "This week", value: "12", sub: "submissions" },
  { icon: CircleCheck, label: "Auto-cleared", value: "8", sub: "67% · Tier 1", tone: "text-emerald-600" },
  { icon: Video, label: "Video verified", value: "3", sub: "25% · Tier 2", tone: "text-amber-600" },
  { icon: MapPin, label: "Visits needed", value: "1", sub: "8% · Tier 3", tone: "text-rose-600" },
];

const rows = [
  {
    operator: "Acme Transport",
    fleet: "45",
    tier: 1 as const,
    score: "1.8",
    scoreTone: "text-emerald-600",
    reason: "All pillars within standard; high trust signals.",
    status: "Cleared",
    action: "Spot-check",
    primary: false,
  },
  {
    operator: "Northern Freight",
    fleet: "120",
    tier: 2 as const,
    score: "2.9",
    scoreTone: "text-amber-600",
    reason: "Tyre tread on rig 12 near limit; video requested.",
    status: "Video requested",
    action: "Review video",
    primary: true,
  },
  {
    operator: "Highway Haulage",
    fleet: "15",
    tier: 3 as const,
    score: "4.2",
    scoreTone: "text-rose-600",
    reason: "Load restraint non-conformance; GPS inconsistent.",
    status: "Escalated",
    action: "Assign visit",
    primary: true,
  },
];

const impact = [
  { label: "Engineer hours saved", value: "24h", sub: "this month" },
  { label: "Travel avoided", value: "1,200 km", sub: "approx." },
  { label: "Throughput multiplier", value: "8.5×", sub: "vs. manual" },
  { label: "Avg triage time", value: "3.2s", sub: "per submission" },
];

const filters = ["All", "Tier 1", "Tier 2", "Tier 3"];

export default function EngineerQueue() {
  return (
    <div className="min-h-screen bg-background">
      {/* App bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Logo href="/queue" />
            <span className="hidden h-4 w-px bg-border sm:block" />
            <span className="hidden text-sm text-muted-foreground sm:block">
              NTI Risk Engineering
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              EN
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Audit queue</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every submission triaged and routed. You only touch the exceptions.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {m.label}
                </span>
                <m.icon className="h-4 w-4 text-muted-foreground/70" />
              </div>
              <div
                className={`mt-3 text-2xl font-semibold ${m.tone ?? "text-foreground"}`}
              >
                {m.value}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Queue */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Active queue</h2>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {filters.map((f, i) => (
              <button
                key={f}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  i === 0
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Operator", "Fleet", "Tier", "Score", "Routed reason", "Status", ""].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => (
                  <tr
                    key={r.operator}
                    className="transition-colors hover:bg-muted/40"
                  >
                    <td className="px-5 py-4 font-medium text-foreground">
                      {r.operator}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {r.fleet}
                    </td>
                    <td className="px-5 py-4">
                      <TierBadge tier={r.tier} />
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-semibold ${r.scoreTone}`}>
                        {r.score}
                      </span>
                      <span className="text-muted-foreground"> / 5</span>
                    </td>
                    <td className="max-w-xs px-5 py-4 text-muted-foreground">
                      {r.reason}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {r.status}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button
                        size="sm"
                        variant={r.primary ? "default" : "ghost"}
                      >
                        {r.action}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Impact */}
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              Portfolio impact
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {impact.map((m, i) => (
              <div
                key={m.label}
                className={
                  i > 0 ? "lg:border-l lg:border-border lg:pl-6" : undefined
                }
              >
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {m.label}
                </div>
                <div className="mt-2 text-2xl font-semibold text-foreground">
                  {m.value}
                </div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
