// Mock domain data + business logic for the RiskGate operator experience.
// No backend — this is the single source of truth the client store hydrates from.

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

export type VehicleType = "Prime mover" | "Rigid" | "Trailer" | "Van";

export const VEHICLE_TYPES: VehicleType[] = [
  "Prime mover",
  "Rigid",
  "Trailer",
  "Van",
];

// Annual base insurance rate per vehicle type (AUD).
export const VEHICLE_BASE_RATE: Record<VehicleType, number> = {
  "Prime mover": 8200,
  Rigid: 5200,
  Trailer: 2400,
  Van: 1900,
};

export interface Vehicle {
  id: string;
  rego: string;
  type: VehicleType;
  make: string;
  year: number;
  odometerKm: number;
  status: "active" | "maintenance";
}

export type FindingStatus = "clear" | "advisory" | "action";

// Plain-English labels shown in the UI.
export const FINDING_STATUS_LABEL: Record<FindingStatus, string> = {
  clear: "Good",
  advisory: "Keep an eye on",
  action: "Needs fixing",
};

// What each tier means, in one sentence, for people who don't know the jargon.
export const TIER_MEANING: Record<1 | 2 | 3, string> = {
  1: "Passed — cleared automatically, no visit needed.",
  2: "Almost there — send a short video to confirm a couple of things.",
  3: "Needs an NTI engineer to visit in person.",
};

export interface Finding {
  pillar: Pillar;
  observation: string;
  severity: 1 | 2 | 3 | 4 | 5;
  recommendation: string;
  status: FindingStatus;
}

export type AuditStatus =
  | "triaged" // AI-cleared, waiting for an optional engineer spot-check
  | "signed" // an engineer has signed it off
  | "video_requested" // Tier 2 — waiting on a verification video
  | "escalated"; // Tier 3 — waiting on an in-person visit

export interface Audit {
  id: string;
  date: string; // ISO date
  tier: 1 | 2 | 3;
  score: number; // 1..5, lower is better
  status: AuditStatus;
  reason: string;
  findings: Finding[];
  premiumBefore: number;
  premiumAfter: number;
  engineerDecision?: "agreed" | "noted"; // agreed with AI, or added own notes
  engineerNotes?: string;
}

// The demo forces each of the three login fleets to a fixed outcome so the
// three tiers are always demonstrable. Fleets not listed here default to pass.
export const FORCED_TIER: Record<string, 1 | 2 | 3> = {
  acme: 1,
  northern: 2,
  highway: 3,
};

export interface Operator {
  id: string;
  name: string;
  initials: string;
  industry: string;
  region: string;
  contact: string;
  memberSince: string;
  demoLogin?: boolean; // shown as a pickable fleet on the login screen
  policy: {
    number: string;
    coverage: string[];
    excess: number;
    riskRating: "Preferred" | "Standard" | "Watch";
    auditIntervalMonths: number;
  };
  vehicles: Vehicle[];
  audits: Audit[]; // newest first
  benchmarkPercentile: number;
}

// ---------- Business logic ----------

export function fleetBasePremium(vehicles: Vehicle[]): number {
  return vehicles.reduce((sum, v) => sum + VEHICLE_BASE_RATE[v.type], 0);
}

export function totalOdometer(vehicles: Vehicle[]): number {
  return vehicles.reduce((sum, v) => sum + v.odometerKm, 0);
}

// Risk multiplier applied to the base premium, driven by the latest audit.
export function riskMultiplier(operator: Operator): number {
  const latest = operator.audits[0];
  if (!latest) return 1.18; // un-audited applicants carry a loading
  if (latest.tier === 1) return 0.9;
  if (latest.tier === 2) return 1.12;
  return 1.4;
}

// Mileage loading: ~$3,500 per million fleet km.
export function mileageLoading(vehicles: Vehicle[]): number {
  return Math.round((totalOdometer(vehicles) / 1_000_000) * 3500);
}

export function computePremium(operator: Operator): number {
  const base = fleetBasePremium(operator.vehicles);
  const premium = base * riskMultiplier(operator) + mileageLoading(operator.vehicles);
  return Math.round(premium / 10) * 10;
}

export function addMonths(iso: string, months: number): string {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function nextAuditDue(operator: Operator): string {
  const latest = operator.audits[0];
  const from = latest ? latest.date : new Date().toISOString().slice(0, 10);
  // Tier 1 fleets earn a longer interval; riskier fleets are re-checked sooner.
  const interval = latest
    ? latest.tier === 1
      ? 12
      : latest.tier === 2
        ? 9
        : 6
    : operator.policy.auditIntervalMonths;
  return addMonths(from, interval);
}

export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ---------- Seed operators ----------

let vid = 0;
const v = (
  rego: string,
  type: VehicleType,
  make: string,
  year: number,
  odometerKm: number,
  status: Vehicle["status"] = "active",
): Vehicle => ({ id: `v${++vid}`, rego, type, make, year, odometerKm, status });

export const INITIAL_OPERATORS: Operator[] = [
  {
    id: "acme",
    name: "Acme Transport",
    initials: "AT",
    industry: "General road freight",
    region: "Brisbane, QLD",
    contact: "ops@acmetransport.com.au",
    memberSince: "2021",
    demoLogin: true,
    policy: {
      number: "NTI-QLD-04821",
      coverage: ["Heavy motor", "Goods in transit", "Public liability"],
      excess: 5000,
      riskRating: "Preferred",
      auditIntervalMonths: 12,
    },
    benchmarkPercentile: 78,
    vehicles: [
      v("ACM-01", "Prime mover", "Kenworth T610", 2021, 412000),
      v("ACM-02", "Prime mover", "Volvo FH16", 2020, 508000),
      v("ACM-03", "Prime mover", "Kenworth T410", 2022, 214000),
      v("ACM-11", "Trailer", "Maxitrans B-Double", 2019, 380000),
      v("ACM-12", "Trailer", "Vawdrey Curtainsider", 2020, 341000),
      v("ACM-21", "Rigid", "Isuzu FVR", 2021, 176000, "maintenance"),
      v("ACM-22", "Rigid", "Hino 500", 2022, 98000),
    ],
    audits: [
      {
        id: "AUD-2025-114",
        date: "2025-08-14",
        tier: 1,
        score: 1.8,
        status: "signed",
        reason: "All pillars within standard; strong trust signals.",
        premiumBefore: 61200,
        premiumAfter: 55980,
        findings: [
          {
            pillar: "asset_management",
            observation: "Tyre tread on ACM-02 measured at 4.1mm, well above limit.",
            severity: 1,
            recommendation: "No action. Continue quarterly tread checks.",
            status: "clear",
          },
          {
            pillar: "people_capability",
            observation: "All 9 drivers hold current fatigue-management accreditation.",
            severity: 1,
            recommendation: "No action.",
            status: "clear",
          },
          {
            pillar: "site_safety_security",
            observation: "Load-restraint photos consistent with NTC guide.",
            severity: 2,
            recommendation: "Advisory: photograph restraints before each departure.",
            status: "advisory",
          },
        ],
      },
    ],
  },
  {
    id: "northern",
    name: "Northern Freight",
    initials: "NF",
    industry: "Long-haul & refrigerated",
    region: "Darwin, NT",
    contact: "compliance@northernfreight.com.au",
    memberSince: "2019",
    demoLogin: true,
    policy: {
      number: "NTI-NT-01193",
      coverage: ["Heavy motor", "Refrigerated goods", "Public liability", "Downtime"],
      excess: 10000,
      riskRating: "Standard",
      auditIntervalMonths: 9,
    },
    benchmarkPercentile: 54,
    vehicles: [
      v("NFR-100", "Prime mover", "Mack Super-Liner", 2018, 812000),
      v("NFR-101", "Prime mover", "Kenworth C509", 2019, 690000),
      v("NFR-102", "Prime mover", "Volvo FH16", 2021, 355000),
      v("NFR-103", "Prime mover", "Western Star 4800", 2017, 940000, "maintenance"),
      v("NFR-201", "Trailer", "Maxitrans Reefer", 2020, 410000),
      v("NFR-202", "Trailer", "Vawdrey Road-train", 2019, 505000),
      v("NFR-203", "Trailer", "Krueger Flat-top", 2018, 620000),
      v("NFR-301", "Rigid", "Isuzu Giga", 2020, 260000),
    ],
    audits: [
      {
        id: "AUD-2025-098",
        date: "2025-08-22",
        tier: 2,
        score: 2.9,
        status: "video_requested",
        reason: "Tyre tread on NFR-103 near limit; brake-line corrosion suspected.",
        premiumBefore: 78400,
        premiumAfter: 82600,
        findings: [
          {
            pillar: "asset_management",
            observation: "NFR-103 front tyres estimated near 1.8mm; verification requested.",
            severity: 3,
            recommendation: "Submit close-up video of both front tyres and brake lines.",
            status: "action",
          },
          {
            pillar: "emergency_incident",
            observation: "Fire extinguisher on NFR-201 inspection tag expired 3 months ago.",
            severity: 3,
            recommendation: "Re-inspect and re-tag all depot fire equipment.",
            status: "action",
          },
        ],
      },
      {
        id: "AUD-2024-071",
        date: "2024-11-19",
        tier: 1,
        score: 2.1,
        status: "signed",
        reason: "Cleared with minor advisories.",
        premiumBefore: 75200,
        premiumAfter: 71900,
        findings: [
          {
            pillar: "site_safety_security",
            observation: "Depot access gate unmonitored overnight.",
            severity: 2,
            recommendation: "Advisory: add after-hours access log.",
            status: "advisory",
          },
        ],
      },
    ],
  },
  {
    id: "highway",
    name: "Highway Haulage",
    initials: "HH",
    industry: "Regional distribution",
    region: "Newcastle, NSW",
    contact: "admin@highwayhaulage.com.au",
    memberSince: "2023",
    demoLogin: true,
    policy: {
      number: "NTI-NSW-07740",
      coverage: ["Heavy motor", "Goods in transit"],
      excess: 7500,
      riskRating: "Watch",
      auditIntervalMonths: 6,
    },
    benchmarkPercentile: 22,
    vehicles: [
      v("HWY-1", "Rigid", "Hino 300", 2019, 240000),
      v("HWY-2", "Rigid", "Isuzu FSR", 2018, 318000, "maintenance"),
      v("HWY-3", "Prime mover", "DAF CF", 2017, 720000),
      v("HWY-4", "Van", "Mercedes Sprinter", 2021, 96000),
      v("HWY-5", "Van", "Ford Transit", 2020, 141000),
      v("HWY-6", "Trailer", "Maxitrans Tautliner", 2016, 480000),
    ],
    audits: [
      {
        id: "AUD-2025-061",
        date: "2025-08-08",
        tier: 3,
        score: 4.2,
        status: "escalated",
        reason: "Load-restraint non-conformance and inconsistent photo GPS.",
        premiumBefore: 30100,
        premiumAfter: 42140,
        findings: [
          {
            pillar: "site_safety_security",
            observation: "Load on HWY-6 not restrained to NTC guide; straps frayed.",
            severity: 5,
            recommendation: "Immediate: replace restraints and re-train loaders.",
            status: "action",
          },
          {
            pillar: "asset_management",
            observation: "HWY-2 brake pads below 3mm friction material.",
            severity: 4,
            recommendation: "Immediate: replace pads before return to service.",
            status: "action",
          },
          {
            pillar: "people_capability",
            observation: "2 of 5 drivers' fatigue training lapsed.",
            severity: 3,
            recommendation: "Re-certify drivers within 30 days.",
            status: "action",
          },
        ],
      },
    ],
  },

  // --- Extra fleets: not login-able, they exist to fill the engineer queue ---
  {
    id: "coastal",
    name: "Coastal Carriers",
    initials: "CC",
    industry: "Refrigerated distribution",
    region: "Geelong, VIC",
    contact: "ops@coastalcarriers.com.au",
    memberSince: "2020",
    policy: {
      number: "NTI-VIC-03310",
      coverage: ["Heavy motor", "Refrigerated goods"],
      excess: 7500,
      riskRating: "Standard",
      auditIntervalMonths: 9,
    },
    benchmarkPercentile: 61,
    vehicles: [
      v("CST-1", "Prime mover", "Volvo FH", 2021, 288000),
      v("CST-2", "Rigid", "Isuzu FVR", 2022, 132000),
      v("CST-3", "Trailer", "Maxitrans Reefer", 2020, 305000),
      v("CST-4", "Van", "Renault Master", 2021, 88000),
    ],
    audits: [
      {
        id: "AUD-2025-121",
        date: "2025-08-24",
        tier: 2,
        score: 3.1,
        status: "video_requested",
        reason: "Fridge unit seal wear on CST-3; asked for a close-up video.",
        premiumBefore: 41200,
        premiumAfter: 43900,
        findings: [
          {
            pillar: "asset_management",
            observation: "Reefer door seal on CST-3 looks worn; hard to judge from photo.",
            severity: 3,
            recommendation: "Send a short video panning across the door seal.",
            status: "action",
          },
        ],
      },
    ],
  },
  {
    id: "outback",
    name: "Outback Logistics",
    initials: "OL",
    industry: "Remote-area haulage",
    region: "Alice Springs, NT",
    contact: "admin@outbacklog.com.au",
    memberSince: "2018",
    policy: {
      number: "NTI-NT-02087",
      coverage: ["Heavy motor", "Goods in transit", "Public liability"],
      excess: 12500,
      riskRating: "Watch",
      auditIntervalMonths: 6,
    },
    benchmarkPercentile: 18,
    vehicles: [
      v("OBK-1", "Prime mover", "Kenworth C509", 2016, 1020000),
      v("OBK-2", "Prime mover", "Mack Trident", 2017, 880000, "maintenance"),
      v("OBK-3", "Trailer", "Vawdrey Road-train", 2015, 760000),
      v("OBK-4", "Trailer", "Krueger Flat-top", 2016, 690000),
    ],
    audits: [
      {
        id: "AUD-2025-057",
        date: "2025-08-05",
        tier: 3,
        score: 4.5,
        status: "escalated",
        reason: "Brake wear across two units and no recent maintenance logs.",
        premiumBefore: 44800,
        premiumAfter: 62700,
        findings: [
          {
            pillar: "asset_management",
            observation: "OBK-2 air lines show corrosion; brakes overdue for service.",
            severity: 5,
            recommendation: "Immediate: full brake service before next trip.",
            status: "action",
          },
          {
            pillar: "emergency_incident",
            observation: "No fire equipment visible in cab photos.",
            severity: 4,
            recommendation: "Fit and tag extinguishers in every unit.",
            status: "action",
          },
        ],
      },
    ],
  },
  {
    id: "metro",
    name: "Metro Movers",
    initials: "MM",
    industry: "Urban parcel delivery",
    region: "Perth, WA",
    contact: "hello@metromovers.com.au",
    memberSince: "2022",
    policy: {
      number: "NTI-WA-06642",
      coverage: ["Heavy motor", "Goods in transit"],
      excess: 4000,
      riskRating: "Preferred",
      auditIntervalMonths: 12,
    },
    benchmarkPercentile: 84,
    vehicles: [
      v("MET-1", "Van", "Mercedes Sprinter", 2022, 64000),
      v("MET-2", "Van", "Ford Transit", 2023, 31000),
      v("MET-3", "Rigid", "Hino 300", 2022, 88000),
      v("MET-4", "Van", "Renault Master", 2021, 102000),
    ],
    audits: [
      {
        id: "AUD-2025-133",
        date: "2025-08-26",
        tier: 1,
        score: 1.6,
        status: "triaged",
        reason: "Clean check across all pillars; AI cleared, awaiting spot-check.",
        premiumBefore: 12400,
        premiumAfter: 11160,
        findings: [
          {
            pillar: "asset_management",
            observation: "All vehicles recently serviced; tread and brakes healthy.",
            severity: 1,
            recommendation: "No action.",
            status: "clear",
          },
          {
            pillar: "people_capability",
            observation: "All drivers current on induction and training.",
            severity: 1,
            recommendation: "No action.",
            status: "clear",
          },
        ],
      },
    ],
  },
];
