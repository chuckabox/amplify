// Domain types for the public audit flow.
// No vehicles, no operators, no premium maths — just pillars and findings.

export type Pillar =
  | "people_capability"
  | "asset_management"
  | "emergency_incident"
  | "site_safety_security";

export const PILLAR_LABEL: Record<Pillar, string> = {
  people_capability: "People & Capability",
  asset_management: "Asset Management",
  emergency_incident: "Emergency & Incident",
  site_safety_security: "Site Safety & Security",
};

export type FindingStatus = "clear" | "advisory" | "action";

// Plain-English labels shown in the UI.
export const FINDING_STATUS_LABEL: Record<FindingStatus, string> = {
  clear: "Good",
  advisory: "Keep an eye on",
  action: "Needs fixing",
};

export interface Finding {
  pillar: Pillar;
  observation: string;
  severity: 1 | 2 | 3 | 4 | 5;
  recommendation: string;
  status: FindingStatus;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
