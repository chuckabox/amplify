"use client";

import { useRouter } from "next/navigation";
import {
  ListChecks,
  Sparkles,
  CircleCheck,
  Layers,
  Info,
  ChevronRight,
  Video,
  MapPin,
} from "lucide-react";
import { TierBadge } from "@/components/tier-badge";
import { Hint } from "@/components/hint";
import { useStore } from "@/lib/operator-store";
import {
  getAllWork,
  groupByOperator,
  workStatus,
  type WorkItem,
} from "@/lib/data/engineer";
import { PILLAR_LABEL } from "@/lib/data/operators";

const toneChip: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  blue: "bg-sky-50 text-sky-700 ring-sky-600/15",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/15",
  rose: "bg-rose-50 text-rose-700 ring-rose-600/15",
};

const scoreTone: Record<1 | 2 | 3, string> = {
  1: "text-emerald-600",
  2: "text-amber-600",
  3: "text-rose-600",
};

function WorkRow({ item }: { item: WorkItem }) {
  const router = useRouter();
  const ws = workStatus(item.audit);
  const finding = item.audit.findings[0];
  return (
    <button
      onClick={() => router.push(`/queue/${item.audit.id}`)}
      className="flex w-full items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-muted/40"
    >
      <TierBadge tier={item.audit.tier} />
      <span className={`text-sm font-semibold ${scoreTone[item.audit.tier]}`}>
        {item.audit.score.toFixed(1)}
        <span className="font-normal text-muted-foreground">/5</span>
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
        {finding ? `${PILLAR_LABEL[finding.pillar]}: ` : ""}
        {item.audit.reason}
      </span>
      <span
        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${toneChip[ws.tone]}`}
      >
        {ws.label}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
}

function OperatorGroup({
  name,
  region,
  fleetSize,
  items,
}: {
  name: string;
  region: string;
  fleetSize: number;
  items: WorkItem[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{name}</span>
          <span className="text-xs text-muted-foreground">· {region}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {fleetSize} vehicles · {items.length}{" "}
          {items.length === 1 ? "check" : "checks"}
        </span>
      </div>
      <div className="divide-y divide-border">
        {items.map((it) => (
          <WorkRow key={it.audit.id} item={it} />
        ))}
      </div>
    </div>
  );
}

export default function EngineerQueue() {
  const { operators } = useStore();

  const work = getAllWork(operators);
  const todo = work.filter((w) => workStatus(w.audit).group === "todo");
  const done = work.filter((w) => workStatus(w.audit).group === "done");
  const todoGroups = groupByOperator(todo);
  const doneGroups = groupByOperator(done);

  const aiApproved = done.filter((w) => w.audit.status !== "signed").length;
  const signedOff = done.filter((w) => w.audit.status === "signed").length;
  const needVideo = todo.filter((w) => w.audit.tier === 2).length;
  const needVisit = todo.filter((w) => w.audit.tier === 3).length;

  const metrics = [
    { icon: ListChecks, label: "To do", value: todo.length, tone: "text-rose-600" },
    { icon: Sparkles, label: "AI approved", value: aiApproved, tone: "text-sky-600" },
    { icon: CircleCheck, label: "Signed off", value: signedOff, tone: "text-emerald-600" },
    { icon: Layers, label: "All checks", value: work.length, tone: "text-foreground" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Your work</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything the AI has triaged, grouped by fleet. Your to-do list is on
          top; everything already handled is below.
        </p>
      </div>

      {/* Why this exists */}
      <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-border bg-accent/40 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p>
          <span className="font-medium text-foreground">Why this screen: </span>
          instead of driving to every depot, the AI sorts every fleet for you.
          You only work through the &ldquo;To do&rdquo; list — and can still open
          anything the AI approved to double-check it.
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

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
      {/* To do */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <ListChecks className="h-4 w-4 text-rose-500" />
          <h2 className="text-sm font-semibold text-foreground">
            To do — needs your action
          </h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {todo.length}
          </span>
          <Hint text="Only Tier 2 (video) and Tier 3 (visit) fleets land here. Tier 1 passes on its own." />
        </div>

        {todoGroups.length > 0 ? (
          <div className="space-y-3">
            {todoGroups.map((g) => (
              <OperatorGroup
                key={g.operatorId}
                name={g.operatorName}
                region={g.region}
                fleetSize={g.items[0].fleetSize}
                items={g.items}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            You&apos;re all caught up — nothing needs action right now.
          </div>
        )}

        {/* Small legend */}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5 text-amber-500" />
            {needVideo} waiting on a video
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-rose-500" />
            {needVisit} waiting on a visit
          </span>
        </div>
      </section>

      {/* Audited */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <CircleCheck className="h-4 w-4 text-emerald-500" />
          <h2 className="text-sm font-semibold text-foreground">Audited</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {done.length}
          </span>
          <Hint text="Passed automatically by the AI, or signed off by you. Open any to double-check the evidence." />
        </div>

        {doneGroups.length > 0 ? (
          <div className="space-y-3">
            {doneGroups.map((g) => (
              <OperatorGroup
                key={g.operatorId}
                name={g.operatorName}
                region={g.region}
                fleetSize={g.items[0].fleetSize}
                items={g.items}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Nothing audited yet.
          </div>
        )}
      </section>
      </div>
    </main>
  );
}
