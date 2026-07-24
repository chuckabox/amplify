// Derives the engineer-side views from the same operator data the operators use.
// The engineer sees every fleet's most recent audit in one queue, so the "three
// in, one visit out" story is visible at a glance.

import type { Audit, Operator } from "@/lib/data/operators";

export interface QueueItem {
  operatorId: string;
  operatorName: string;
  region: string;
  fleetSize: number;
  audit: Audit;
}

// One row per operator: their latest audit is their current standing.
export function getQueue(operators: Operator[]): QueueItem[] {
  return operators
    .filter((op) => op.audits.length > 0)
    .map((op) => ({
      operatorId: op.id,
      operatorName: op.name,
      region: op.region,
      fleetSize: op.vehicles.length,
      audit: op.audits[0],
    }))
    .sort((a, b) => b.audit.tier - a.audit.tier || b.audit.score - a.audit.score);
}

export function findAuditContext(
  operators: Operator[],
  auditId: string,
): { operator: Operator; audit: Audit } | null {
  for (const op of operators) {
    const audit = op.audits.find((a) => a.id === auditId);
    if (audit) return { operator: op, audit };
  }
  return null;
}

export interface TrustSignal {
  key: string;
  label: string;
  ok: boolean;
  hint: string;
}

// Simple, deterministic trust signals so the anti-gaming story is visible.
// Riskier audits fail more checks (Tier 3 mirrors "inconsistent photo GPS").
export function trustSignals(audit: Audit): TrustSignal[] {
  return [
    {
      key: "exif",
      label: "Photo details present",
      ok: true,
      hint: "The photos include the hidden camera details we expect from a real phone photo.",
    },
    {
      key: "gps",
      label: "Location matches one site",
      ok: audit.tier < 3,
      hint: "All the photos were taken close together, at one believable depot location.",
    },
    {
      key: "time",
      label: "Taken recently",
      ok: audit.tier < 3,
      hint: "The photos were taken within the audit window, not dug out of an old folder.",
    },
    {
      key: "workshop",
      label: "Workshop-backed",
      ok: audit.tier === 1,
      hint: "An approved workshop ran or vouched for this check, which raises trust.",
    },
  ];
}

export function trustScore(audit: Audit): number {
  const s = trustSignals(audit);
  return s.filter((x) => x.ok).length / s.length;
}

export interface Portfolio {
  total: number;
  autoCleared: number;
  videoCheck: number;
  visits: number;
  hoursSaved: number;
  travelAvoidedKm: number;
  multiplier: number;
  byTier: { tier: 1 | 2 | 3; count: number }[];
  topRisk: { name: string; score: number; tier: 1 | 2 | 3 }[];
}

export function portfolio(operators: Operator[]): Portfolio {
  const q = getQueue(operators);
  const total = q.length;
  const autoCleared = q.filter((i) => i.audit.tier === 1).length;
  const videoCheck = q.filter((i) => i.audit.tier === 2).length;
  const visits = q.filter((i) => i.audit.tier === 3).length;

  // Each audit that avoided a site visit saves ~8 engineer hours and ~400km.
  const avoided = autoCleared + videoCheck;
  const hoursSaved = avoided * 8;
  const travelAvoidedKm = avoided * 400;
  const multiplier = total / Math.max(visits, 1);

  const byTier = ([1, 2, 3] as const).map((tier) => ({
    tier,
    count: q.filter((i) => i.audit.tier === tier).length,
  }));

  const topRisk = [...q]
    .sort((a, b) => b.audit.score - a.audit.score)
    .slice(0, 5)
    .map((i) => ({
      name: i.operatorName,
      score: i.audit.score,
      tier: i.audit.tier,
    }));

  return {
    total,
    autoCleared,
    videoCheck,
    visits,
    hoursSaved,
    travelAvoidedKm,
    multiplier,
    byTier,
    topRisk,
  };
}
