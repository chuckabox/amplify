import type { Pillar } from "@/lib/data/audit";

export const PASSPORT_STORAGE_KEY = "tonnage-risk-passport-updated";

export type DocumentKind =
  | "maintenance"
  | "driver"
  | "incident"
  | "fatigue"
  | "registration"
  | "subcontractor"
  | "training"
  | "emergency"
  | "contract";

export interface DocumentType {
  kind: DocumentKind;
  label: string;
  shortLabel: string;
  accepts: string;
}

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    kind: "maintenance",
    label: "Maintenance and service records",
    shortLabel: "Maintenance",
    accepts: "Service sheets, defect reports",
  },
  {
    kind: "driver",
    label: "Licences and medical clearances",
    shortLabel: "Driver credentials",
    accepts: "Licences, medical certificates",
  },
  {
    kind: "incident",
    label: "Incident and near-miss reports",
    shortLabel: "Incidents",
    accepts: "Reports, corrective actions",
  },
  {
    kind: "fatigue",
    label: "Fatigue policies and work-diary audits",
    shortLabel: "Fatigue",
    accepts: "Policies, diary audit exports",
  },
  {
    kind: "registration",
    label: "Vehicle registrations",
    shortLabel: "Registrations",
    accepts: "Registration certificates",
  },
  {
    kind: "subcontractor",
    label: "Subcontractor certificates",
    shortLabel: "Subcontractors",
    accepts: "Accreditations, insurance",
  },
  {
    kind: "training",
    label: "Training and induction records",
    shortLabel: "Training",
    accepts: "Registers, certificates",
  },
  {
    kind: "emergency",
    label: "Emergency-response plans",
    shortLabel: "Emergency plans",
    accepts: "Plans, drill records",
  },
  {
    kind: "contract",
    label: "Contracts and insurance documents",
    shortLabel: "Contracts",
    accepts: "Policies, schedules, contracts",
  },
];

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
  tone?: "neutral" | "good" | "warning" | "critical";
}

export interface ExtractedRecord {
  id: string;
  historyLabel: string;
  sourceName: string;
  documentKind: DocumentKind;
  entityType: "Vehicle" | "Driver" | "Subcontractor" | "Depot";
  entityId: string;
  entityLabel: string;
  extractedAt: string;
  fields: ExtractedField[];
  alert: {
    label: string;
    detail: string;
    severity: "warning" | "critical";
  };
  control: {
    label: string;
    rows: Array<{ label: string; value: string; state: "good" | "bad" }>;
  };
  source: {
    title: string;
    ref: string;
    format: string;
    typeLabel: string;
    signedBy: string;
  };
}

export const PAST_AUDITS: ExtractedRecord[] = [
  {
    id: "extract-0248",
    historyLabel: "Maintenance PDF",
    sourceName: "Truck_28_Service_12-Jun-2026.pdf",
    documentKind: "maintenance",
    entityType: "Vehicle",
    entityId: "vehicle-28",
    entityLabel: "Truck 28 / ABC123",
    extractedAt: "25 Jul 2026, 10:42",
    fields: [
      { label: "Vehicle", value: "Truck 28", confidence: 0.99 },
      { label: "Registration", value: "ABC123", confidence: 0.98 },
      { label: "Service date", value: "12 Jun 2026", confidence: 0.97 },
      { label: "Odometer at service", value: "482,350 km", confidence: 0.96 },
      {
        label: "Brake defect identified",
        value: "Yes",
        confidence: 0.99,
        tone: "critical",
      },
      {
        label: "Repair completed",
        value: "No",
        confidence: 0.98,
        tone: "critical",
      },
      {
        label: "Next service due",
        value: "500,000 km",
        confidence: 0.95,
        tone: "warning",
      },
    ],
    alert: {
      label: "Critical review required",
      detail:
        "An open brake defect has no linked repair evidence. The vehicle is also 3,200 km from its next scheduled service.",
      severity: "critical",
    },
    control: {
      label: "Control: Safety-critical defects are repaired and closed",
      rows: [
        { label: "Defect identified in service record", value: "Found", state: "good" },
        { label: "Vehicle matched", value: "Truck 28", state: "good" },
        { label: "Repair completion recorded", value: "No", state: "bad" },
        { label: "Separate repair evidence found", value: "Missing", state: "bad" },
      ],
    },
    source: {
      title: "Fleet Service Report",
      ref: "COORANBONG FREIGHT / WORK ORDER 88241",
      format: "PDF",
      typeLabel: "Maintenance",
      signedBy: "B. Morton / Workshop supervisor",
    },
  },
  {
    id: "extract-0231",
    historyLabel: "Pre-start logs",
    sourceName: "Prestart_Logs_Q2-2026.xlsx",
    documentKind: "maintenance",
    entityType: "Depot",
    entityId: "depot-rocklea",
    entityLabel: "Rocklea depot / 18 vehicles",
    extractedAt: "25 Jul 2026, 09:15",
    fields: [
      { label: "Logs submitted", value: "186", confidence: 0.99 },
      { label: "Vehicles covered", value: "18", confidence: 0.98 },
      { label: "Operating days", value: "294", confidence: 0.97 },
      {
        label: "Completion rate",
        value: "63%",
        confidence: 0.96,
        tone: "warning",
      },
      { label: "Defects raised from pre-start", value: "9", confidence: 0.94 },
      {
        label: "Vehicles with no logs",
        value: "3",
        confidence: 0.93,
        tone: "warning",
      },
    ],
    alert: {
      label: "Coverage gap found",
      detail:
        "Pre-start completion rose from 57% to 63%, but three vehicles submitted no logs at all this quarter.",
      severity: "warning",
    },
    control: {
      label: "Control: Drivers complete daily pre-start inspections",
      rows: [
        { label: "Pre-start procedure uploaded", value: "Current", state: "good" },
        { label: "Logs linked to vehicles", value: "186", state: "good" },
        { label: "Coverage across operating days", value: "63%", state: "bad" },
        { label: "Vehicles with zero logs", value: "3", state: "bad" },
      ],
    },
    source: {
      title: "Pre-start Log Export",
      ref: "COORANBONG FREIGHT / Q2 2026 / ROCKLEA",
      format: "XLSX",
      typeLabel: "Pre-start logs",
      signedBy: "Exported by / S. Whitmore / Depot manager",
    },
  },
  {
    id: "extract-0219",
    historyLabel: "Driver records",
    sourceName: "Driver_Credentials_Jul-2026.zip",
    documentKind: "driver",
    entityType: "Driver",
    entityId: "driver-ravi",
    entityLabel: "Ravi Sandhu / MC licence",
    extractedAt: "25 Jul 2026, 08:20",
    fields: [
      { label: "Drivers in batch", value: "29", confidence: 0.99 },
      { label: "Current licences", value: "29", confidence: 0.98 },
      {
        label: "Current medical clearances",
        value: "27",
        confidence: 0.97,
        tone: "warning",
      },
      {
        label: "Next expiry",
        value: "21 Aug 2026",
        confidence: 0.96,
        tone: "warning",
      },
      { label: "Fatigue training current", value: "29", confidence: 0.95 },
      { label: "Inductions on file", value: "28", confidence: 0.94 },
    ],
    alert: {
      label: "Expiry approaching",
      detail:
        "Ravi Sandhu's medical clearance expires in 27 days. Two drivers have no current medical clearance on file.",
      severity: "warning",
    },
    control: {
      label: "Control: Drivers hold current licences and medical clearances",
      rows: [
        { label: "Licence checked for every driver", value: "29 of 29", state: "good" },
        { label: "Driver matched to depot roster", value: "Matched", state: "good" },
        { label: "Medical clearance current", value: "27 of 29", state: "bad" },
        { label: "Expiry inside 30 days", value: "1", state: "bad" },
      ],
    },
    source: {
      title: "Driver Credential Pack",
      ref: "COORANBONG FREIGHT / JULY 2026 INTAKE",
      format: "ZIP",
      typeLabel: "Driver credentials",
      signedBy: "Compiled by / L. Ferreira / Compliance officer",
    },
  },
];

export const SAMPLE_EXTRACTION: ExtractedRecord = PAST_AUDITS[0];

export interface PassportEntity {
  id: string;
  type: "vehicle" | "driver" | "subcontractor" | "depot";
  label: string;
  meta: string;
  status: "clear" | "watch" | "critical";
  statusLabel: string;
  changed?: boolean;
  facts: Array<{ label: string; value: string; tone?: "warning" | "critical" }>;
}

export const PASSPORT_ENTITIES: PassportEntity[] = [
  {
    id: "vehicle-28",
    type: "vehicle",
    label: "Truck 28",
    meta: "ABC123 / 2021 Isuzu FYJ",
    status: "critical",
    statusLabel: "Critical review",
    changed: true,
    facts: [
      { label: "Current odometer", value: "496,800 km" },
      { label: "Next service", value: "500,000 km", tone: "warning" },
      { label: "Open brake defect", value: "Yes", tone: "critical" },
      { label: "Repair evidence", value: "Missing", tone: "critical" },
    ],
  },
  {
    id: "vehicle-14",
    type: "vehicle",
    label: "Truck 14",
    meta: "763KLT / 2019 Fuso Fighter",
    status: "clear",
    statusLabel: "Current",
    facts: [
      { label: "Current odometer", value: "318,420 km" },
      { label: "Next service", value: "330,000 km" },
      { label: "Open defects", value: "None" },
      { label: "Registration", value: "18 Mar 2027" },
    ],
  },
  {
    id: "driver-ravi",
    type: "driver",
    label: "Ravi Sandhu",
    meta: "MC licence / Brisbane depot",
    status: "watch",
    statusLabel: "Expiry approaching",
    facts: [
      { label: "Heavy vehicle licence", value: "08 Sep 2027" },
      { label: "Medical clearance", value: "21 Aug 2026", tone: "warning" },
      { label: "Fatigue training", value: "Current" },
      { label: "Last induction", value: "04 Feb 2026" },
    ],
  },
  {
    id: "subco-coastal",
    type: "subcontractor",
    label: "Coastal Linehaul Pty Ltd",
    meta: "12 vehicles, 9 drivers",
    status: "watch",
    statusLabel: "Evidence gap",
    facts: [
      { label: "Public liability", value: "Current" },
      { label: "Marine cargo", value: "Current" },
      { label: "Driver declarations", value: "8 of 9", tone: "warning" },
      { label: "Last review", value: "30 Jun 2026" },
    ],
  },
];

export interface ControlEvidence {
  label: string;
  value: string;
  state: "proved" | "partial" | "missing";
}

export interface RiskControl {
  id: string;
  pillar: Pillar;
  label: string;
  coverage: number;
  status: "effective" | "partial" | "weak";
  evidence: ControlEvidence[];
}

export const RISK_CONTROLS: RiskControl[] = [
  {
    id: "pre-start",
    pillar: "asset_management",
    label: "Drivers complete daily pre-start inspections",
    coverage: 63,
    status: "partial",
    evidence: [
      { label: "Pre-start procedure uploaded", value: "Current", state: "proved" },
      { label: "Driver training records", value: "27 of 29", state: "proved" },
      { label: "Pre-start logs found", value: "186", state: "proved" },
      { label: "Vehicle operating days", value: "294", state: "proved" },
      { label: "Completion rate", value: "63%", state: "partial" },
    ],
  },
  {
    id: "defect-closeout",
    pillar: "asset_management",
    label: "Safety-critical defects are repaired and closed",
    coverage: 78,
    status: "weak",
    evidence: [
      { label: "Defect procedure uploaded", value: "Current", state: "proved" },
      { label: "Defects raised this quarter", value: "9", state: "proved" },
      { label: "Repair records linked", value: "7", state: "partial" },
      { label: "Open safety-critical defects", value: "1", state: "missing" },
    ],
  },
  {
    id: "driver-current",
    pillar: "people_capability",
    label: "Drivers hold current licences and medical clearances",
    coverage: 94,
    status: "effective",
    evidence: [
      { label: "Active drivers", value: "29", state: "proved" },
      { label: "Current licences", value: "29", state: "proved" },
      { label: "Current medical clearances", value: "27", state: "partial" },
      { label: "Expiry alerts issued", value: "2", state: "proved" },
    ],
  },
];

export const RECENT_CHANGES = [
  {
    date: "25 Jul",
    type: "Critical",
    title: "Open brake defect linked to Truck 28",
    detail: "Service record added / repair evidence not found",
    tone: "critical",
    auditId: "extract-0248",
  },
  {
    date: "23 Jul",
    type: "Expiry",
    title: "Ravi Sandhu medical expires in 27 days",
    detail: "Medical clearance / Brisbane depot",
    tone: "warning",
    auditId: "extract-0219",
  },
  {
    date: "18 Jul",
    type: "Improved",
    title: "Pre-start completion rose from 57% to 63%",
    detail: "42 new logs linked across 11 vehicles",
    tone: "good",
    auditId: "extract-0231",
  },
] as const;

export const SOURCE_DOCUMENTS = [
  {
    name: "Truck_28_Walkaround.mp4",
    type: "Vision",
    linkedTo: "Truck 28",
    date: "25 Jul 2026",
    records: 8,
    status: "Processed",
  },
  {
    name: "Truck_28_Service_12-Jun-2026.pdf",
    type: "Maintenance",
    linkedTo: "Truck 28",
    date: "25 Jul 2026",
    records: 7,
    status: "Review",
  },
  {
    name: "Driver_Credentials_Jul-2026.zip",
    type: "Driver credentials",
    linkedTo: "29 drivers",
    date: "23 Jul 2026",
    records: 58,
    status: "Processed",
  },
  {
    name: "Prestart_Logs_Q2-2026.xlsx",
    type: "Pre-start logs",
    linkedTo: "18 vehicles",
    date: "18 Jul 2026",
    records: 186,
    status: "Processed",
  },
  {
    name: "Rocklea_Emergency_Plan_v4.2.pdf",
    type: "Emergency plan",
    linkedTo: "Rocklea depot",
    date: "11 Jul 2026",
    records: 12,
    status: "Processed",
  },
] as const;

export const PASSPORT_SUMMARY = {
  business: "Cooranbong Freight",
  abn: "ABN 74 621 903 118",
  lastReviewed: "30 Jun 2026",
  riskScore: 2.7,
  trend: -0.3,
  documents: 148,
  linkedRecords: 1246,
  openRisks: 4,
  expiringSoon: 3,
};
