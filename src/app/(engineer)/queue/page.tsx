"use client";

import { useRouter } from "next/navigation";
import { TierBadge, StatusStamp } from "@/components/tier-badge";
import { Figure } from "@/components/figure";
import { Reveal } from "@/components/motion";
import { useStore } from "@/lib/operator-store";
import {
  getAllWork,
  groupByOperator,
  workStatus,
  type WorkItem,
} from "@/lib/data/engineer";
import { PILLAR_LABEL } from "@/lib/data/operators";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

const scoreTone: Record<1 | 2 | 3, string> = {
  1: "text-tier-1-ink",
  2: "text-tier-2-ink",
  3: "text-tier-3-ink",
};

function WorkRow({ item }: { item: WorkItem }) {
  const router = useRouter();
  const ws = workStatus(item.audit);
  const finding = item.audit.findings[0];
  const severityLabel = item.audit.tier === 3 ? "visit" : item.audit.tier === 2 ? "video" : "clear";

  return (
    <TableRow
      onClick={() => router.push(`/queue/${item.audit.id}`)}
      className="cursor-pointer"
    >
      <TableCell className="w-[120px]">
        <TierBadge tier={item.audit.tier} label={`Tier ${item.audit.tier} · ${severityLabel}`} />
      </TableCell>
      <TableCell className="w-[80px] font-mono font-medium">
        <span className={scoreTone[item.audit.tier]}>
          {item.audit.score.toFixed(1)}
        </span>
        <span className="text-ink-faint">/5</span>
      </TableCell>
      <TableCell className="max-w-[280px] truncate text-ink-muted">
        <span className="font-semibold text-ink">
          {finding ? `${PILLAR_LABEL[finding.pillar]}: ` : ""}
        </span>
        {item.audit.reason}
      </TableCell>
      <TableCell className="w-[120px] text-right">
        <StatusStamp status={ws.group === "done" ? (item.audit.status === "signed" ? "clear" : "advisory") : "action"} />
      </TableCell>
      <TableCell className="w-[40px] text-right font-mono text-ink-muted">
        →
      </TableCell>
    </TableRow>
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
    <div className="mt-8 first:mt-4">
      <div className="flex items-baseline justify-between border-b border-rule pb-2.5 mb-3">
        <div>
          <span className="field-label">{region} · {fleetSize} vehicles</span>
          <h3 className="font-display text-lg font-semibold text-ink">{name}</h3>
        </div>
        <span className="font-mono text-xs text-ink-muted">
          {items.length} {items.length === 1 ? "check" : "checks"}
        </span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[120px]">Standing</TableHead>
            <TableHead className="w-[80px]">Score</TableHead>
            <TableHead>Triage Details & Focus Areas</TableHead>
            <TableHead className="w-[120px] text-right">Status</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((it) => (
            <WorkRow key={it.audit.id} item={it} />
          ))}
        </TableBody>
      </Table>
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
    { label: "To do", value: todo.length, tone: "tier-3" as const, note: `${needVideo} video, ${needVisit} visits` },
    { label: "AI approved", value: aiApproved, tone: "tier-2" as const, note: "Cleared without site visit" },
    { label: "Signed off", value: signedOff, tone: "tier-1" as const, note: "Approved by engineer" },
    { label: "All checks", value: work.length, tone: "ink" as const, note: "Total compliance registry" },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 flex-1">
      {/* Heading */}
      <Reveal>
        <div className="border-b border-rule pb-8">
          <p className="field-label">NTI RISK ENGINEERING</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink">
            Triage Register
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            The heavy-vehicle compliance triage register. Review remote video submissions and schedule site audits for flagged fleets below.
          </p>
        </div>
      </Reveal>

      {/* Why this exists */}
      <Reveal delay={0.08}>
        <div className="mt-6 flex items-start gap-3 rounded-[3px] border border-rule bg-paper-sunk/35 p-4 text-xs leading-relaxed text-ink-muted">
          <svg className="size-4 shrink-0 text-ink-muted mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <p>
            <span className="font-semibold text-ink uppercase tracking-wider text-[10px] block mb-0.5">Triage Strategy: </span>
            Instead of routing engineers to every regional depot, the Tonnage platform sorts fleets continuously. Engineers focus strictly on resolving outstanding action items in the to-do column, while retaining review authority over auto-passed checks.
          </p>
        </div>
      </Reveal>

      {/* Metrics Ledger Grid */}
      <Reveal delay={0.12}>
        <div className="grid gap-px border border-rule bg-rule grid-cols-2 lg:grid-cols-4 mt-8">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-paper-raised p-6"
            >
              <Figure label={m.label} value={m.value} tone={m.tone} note={m.note} />
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
        {/* To do */}
        <Reveal delay={0.16}>
          <section>
            <div className="mb-4 flex items-center gap-2 border-b border-rule-strong pb-2">
              <span className="h-2 w-2 rounded-full bg-tier-3" />
              <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
                To do — action required
              </h2>
              <span className="ml-auto font-mono text-xs text-ink-muted font-bold">
                {todo.length}
              </span>
            </div>

            {todoGroups.length > 0 ? (
              <div className="space-y-6">
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
              <div className="rounded-[4px] border border-dashed border-rule-strong bg-paper-sunk/20 p-8 text-center text-sm text-ink-muted">
                Triage register clear — no outstanding items.
              </div>
            )}
          </section>
        </Reveal>

        {/* Audited */}
        <Reveal delay={0.2}>
          <section>
            <div className="mb-4 flex items-center gap-2 border-b border-rule-strong pb-2">
              <span className="h-2 w-2 rounded-full bg-tier-1" />
              <h2 className="text-sm font-semibold text-ink uppercase tracking-wider">
                Audited archive
              </h2>
              <span className="ml-auto font-mono text-xs text-ink-muted font-bold">
                {done.length}
              </span>
            </div>

            {doneGroups.length > 0 ? (
              <div className="space-y-6">
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
              <div className="rounded-[4px] border border-dashed border-rule-strong bg-paper-sunk/20 p-8 text-center text-sm text-ink-muted">
                No archived check dockets found.
              </div>
            )}
          </section>
        </Reveal>
      </div>
    </main>
  );
}
