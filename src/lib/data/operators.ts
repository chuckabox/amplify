// Mock domain data + business logic for the Weighbridge operator experience.
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

// Annual base insurance rate per vehicle type (AUD), as filed.
export const VEHICLE_BASE_RATE: Record<VehicleType, number> = {
  "Prime mover": 8240,
  Rigid: 5180,
  Trailer: 2360,
  Van: 1890,
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
  if (latest.tier === 1) return 0.88;
  if (latest.tier === 2) return 1.14;
  return 1.42;
}

// Mileage loading: $3,420 per million fleet km.
export const MILEAGE_RATE_PER_MILLION_KM = 3420;

export function mileageLoading(vehicles: Vehicle[]): number {
  return Math.round(
    (totalOdometer(vehicles) / 1_000_000) * MILEAGE_RATE_PER_MILLION_KM,
  );
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
    id: "halloran",
    name: "Halloran Haulage",
    initials: "HH",
    industry: "General road freight",
    region: "Rocklea, QLD",
    contact: "ops@halloranhaulage.com.au",
    memberSince: "2021",
    demoLogin: true,
    policy: {
      number: "NTI-QLD-04821",
      coverage: ["Heavy motor", "Goods in transit", "Public liability"],
      excess: 5500,
      riskRating: "Preferred",
      auditIntervalMonths: 12,
    },
    benchmarkPercentile: 81,
    vehicles: [
      v("HAL-01", "Prime mover", "Kenworth T610", 2021, 412480),
      v("HAL-02", "Prime mover", "Volvo FH16", 2020, 508130),
      v("HAL-03", "Prime mover", "Kenworth T410", 2022, 213960),
      v("HAL-11", "Trailer", "Maxitrans B-Double", 2019, 379740),
      v("HAL-12", "Trailer", "Vawdrey Curtainsider", 2020, 341285),
      v("HAL-21", "Rigid", "Isuzu FVR", 2021, 176320, "maintenance"),
      v("HAL-22", "Rigid", "Hino 500", 2022, 97845),
    ],
    audits: [
      {
        id: "AUD-2026-1142",
        date: "2026-03-14",
        tier: 1,
        score: 1.7,
        status: "signed",
        reason:
          "All four pillars sat within standard and the evidence checked out on metadata. Cleared to spot-check.",
        premiumBefore: 61240,
        premiumAfter: 55910,
        findings: [
          {
            pillar: "asset_management",
            observation:
              "Tread on HAL-02 measured 4.1mm across the centre three-quarters, well clear of the limit.",
            severity: 1,
            recommendation: "No action. Keep the quarterly tread checks running.",
            status: "clear",
          },
          {
            pillar: "people_capability",
            observation:
              "All nine drivers hold current fatigue-management accreditation, most recent issued 11 Feb.",
            severity: 1,
            recommendation: "No action.",
            status: "clear",
          },
          {
            pillar: "site_safety_security",
            observation:
              "Restraint photos match the NTC load-restraint guide, though only two of six departures were documented.",
            severity: 2,
            recommendation:
              "Photograph restraints before every departure, not just the long runs.",
            status: "advisory",
          },
        ],
      },
    ],
  },
  {
    id: "tanami",
    name: "Tanami Freight Lines",
    initials: "TF",
    industry: "Long-haul & refrigerated",
    region: "Berrimah, NT",
    contact: "compliance@tanamifreight.com.au",
    memberSince: "2019",
    demoLogin: true,
    policy: {
      number: "NTI-NT-01193",
      coverage: ["Heavy motor", "Refrigerated goods", "Public liability", "Downtime"],
      excess: 11000,
      riskRating: "Standard",
      auditIntervalMonths: 9,
    },
    benchmarkPercentile: 47,
    vehicles: [
      v("TAN-100", "Prime mover", "Mack Super-Liner", 2018, 811620),
      v("TAN-101", "Prime mover", "Kenworth C509", 2019, 689450),
      v("TAN-102", "Prime mover", "Volvo FH16", 2021, 354870),
      v("TAN-103", "Prime mover", "Western Star 4800", 2017, 941305, "maintenance"),
      v("TAN-201", "Trailer", "Maxitrans Reefer", 2020, 409760),
      v("TAN-202", "Trailer", "Vawdrey Road-train", 2019, 504915),
      v("TAN-203", "Trailer", "Krueger Flat-top", 2018, 619840),
      v("TAN-301", "Rigid", "Isuzu Giga", 2020, 259630),
    ],
    audits: [
      {
        id: "AUD-2026-0981",
        date: "2026-04-22",
        tier: 2,
        score: 3.1,
        status: "video_requested",
        reason:
          "Tread on TAN-103 reads close to the limit and the brake lines are hard to judge from the angle supplied. Asked for a clip rather than a visit.",
        premiumBefore: 78380,
        premiumAfter: 82640,
        findings: [
          {
            pillar: "asset_management",
            observation:
              "TAN-103 front tyres estimate at roughly 1.8mm. The photo was taken at an angle that makes the reading unreliable.",
            severity: 3,
            recommendation:
              "Send a close-up clip of both front tyres and the brake lines, square on.",
            status: "action",
          },
          {
            pillar: "emergency_incident",
            observation:
              "The inspection tag on TAN-201's extinguisher expired on 18 January, three months before submission.",
            severity: 3,
            recommendation: "Re-inspect and re-tag all depot fire equipment.",
            status: "action",
          },
        ],
      },
      {
        id: "AUD-2025-0713",
        date: "2025-07-19",
        tier: 1,
        score: 2.2,
        status: "signed",
        reason: "Cleared with two advisories, neither affecting the rate.",
        premiumBefore: 75180,
        premiumAfter: 71940,
        findings: [
          {
            pillar: "site_safety_security",
            observation:
              "The Berrimah yard gate is unmonitored between 19:00 and 05:00.",
            severity: 2,
            recommendation: "Add an after-hours access log.",
            status: "advisory",
          },
        ],
      },
    ],
  },
  {
    id: "coalfields",
    name: "Coalfields Carriers",
    initials: "CC",
    industry: "Regional distribution",
    region: "Cardiff, NSW",
    contact: "admin@coalfieldscarriers.com.au",
    memberSince: "2023",
    demoLogin: true,
    policy: {
      number: "NTI-NSW-07740",
      coverage: ["Heavy motor", "Goods in transit"],
      excess: 8250,
      riskRating: "Watch",
      auditIntervalMonths: 6,
    },
    benchmarkPercentile: 19,
    vehicles: [
      v("CFC-1", "Rigid", "Hino 300", 2019, 239870),
      v("CFC-2", "Rigid", "Isuzu FSR", 2018, 318450, "maintenance"),
      v("CFC-3", "Prime mover", "DAF CF", 2017, 719630),
      v("CFC-4", "Van", "Mercedes Sprinter", 2021, 95720),
      v("CFC-5", "Van", "Ford Transit", 2020, 141380),
      v("CFC-6", "Trailer", "Maxitrans Tautliner", 2016, 480215),
    ],
    audits: [
      {
        id: "AUD-2026-0617",
        date: "2026-05-08",
        tier: 3,
        score: 4.4,
        status: "escalated",
        reason:
          "Restraint on CFC-6 does not meet the NTC guide, and three photos carry GPS points 40km from the depot. This one needs a person on site.",
        premiumBefore: 30080,
        premiumAfter: 42190,
        findings: [
          {
            pillar: "site_safety_security",
            observation:
              "The load on CFC-6 is not restrained to the NTC guide and two straps are frayed through the webbing.",
            severity: 5,
            recommendation:
              "Replace the restraints and re-train the loading crew before the next run.",
            status: "action",
          },
          {
            pillar: "asset_management",
            observation:
              "CFC-2 brake pads measure under 3mm of friction material on the near-side front.",
            severity: 4,
            recommendation: "Replace the pads before the vehicle returns to service.",
            status: "action",
          },
          {
            pillar: "people_capability",
            observation:
              "Two of five drivers have fatigue training that lapsed in February.",
            severity: 3,
            recommendation: "Re-certify both drivers within 30 days.",
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
