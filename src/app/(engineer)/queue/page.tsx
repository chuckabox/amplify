"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inbox, CircleCheck, Video, MapPin, Info } from "lucide-react";
import { TierBadge } from "@/components/tier-badge";
import { Hint } from "@/components/hint";
import { useStore } from "@/lib/operator-store";
import { getQueue, portfolio } from "@/lib/data/engineer";
import { PILLAR_LABEL } from "@/lib/data/operators";

const STATUS_LABEL: Record<string, string> = {
  signed: "Signed off",
  video_requested: "Waiting on video",
  escalated: "Needs a visit",
};

type Filter = "all" | 1 | 2 | 3;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: 1, label: "Passed" },
  { key: 2, label: "Video check" },
  { key: 3, label: "Needs visit" },
];

export default function EngineerQueue() {
  const router = useRouter();
  const { operators } = useStore();
  const [filter, setFilter] = useState<Filter>("all");

  const queue = getQueue(operators);
  const stats = portfolio(operators);
  const rows = queue.filter((r) => filter === "all" || r.audit.tier === filter);

  const metrics = [
    { icon: Inbox, label: "In the queue", value: stats.total, tone: "text-foreground" },
    { icon: CircleCheck, label: "Passed on their own", value: stats.autoCleared, tone: "text-emerald-600" },
    { icon: Video, label: "Need a video", value: stats.videoCheck, tone: "text-amber-600" },
    { icon: MapPin, label: "Need a visit", value: stats.visits, tone: "text-rose-600" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Audit queue</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every fleet&apos;s safety check lands here already scored. You only act
          on the ones that need a person.
        </p>
      </div>

      {/* Why this exists */}
      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-border bg-accent/40 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <span className="font-medium text-foreground">Why this screen: </span>
          instead of driving to every depot, you see all fleets in one list.
          Green ones already passed — a quick look is enough. Amber and red are
          where your time actually matters.
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
            <div className={`mt-3 text-2xl font-semibold ${m.tone}`}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-8 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          Fleets
          <Hint text="Sorted with the riskiest at the top, so the fleets that need you are first." />
        </h2>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          {FILTERS.map((f) => (
            <button
              key={String(f.key)}
              onClick={() => setFilter(f.key)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                {["Fleet", "Area", "Vehicles", "Result", "Score", "What we found", "Status"].map(
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
                  key={r.audit.id}
                  onClick={() => router.push(`/queue/${r.audit.id}`)}
                  className="cursor-pointer transition-colors hover:bg-muted/40"
                >
                  <td className="px-5 py-4 font-medium text-foreground">
                    {r.operatorName}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{r.region}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {r.fleetSize}
                  </td>
                  <td className="px-5 py-4">
                    <TierBadge tier={r.audit.tier} />
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-semibold ${
                        r.audit.tier === 1
                          ? "text-emerald-600"
                          : r.audit.tier === 2
                            ? "text-amber-600"
                            : "text-rose-600"
                      }`}
                    >
                      {r.audit.score.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground"> / 5</span>
                  </td>
                  <td className="max-w-xs truncate px-5 py-4 text-muted-foreground">
                    {r.audit.findings[0]
                      ? PILLAR_LABEL[r.audit.findings[0].pillar] +
                        ": " +
                        r.audit.reason
                      : r.audit.reason}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-muted-foreground">
                      {STATUS_LABEL[r.audit.status] ?? r.audit.status}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-sm text-muted-foreground"
                  >
                    No fleets in this group.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
