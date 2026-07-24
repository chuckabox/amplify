// The guided-audit questionnaire, mapped to the four NTI pillars.
// Triggered when an operator takes out or renews a policy — the answers plus
// uploaded evidence are what the premium is priced on.
//
// Each option carries a riskWeight (1 = best practice, 5 = high risk). Routing
// is stubbed to always clear for the demo (see docs/audit-questionnaire-logic.md),
// but the weights are real so the model can be wired in later.

import type { Pillar } from "@/lib/data/operators";

export interface AnswerOption {
  value: string;
  label: string;
  riskWeight: 1 | 2 | 3 | 4 | 5;
}

export interface Question {
  id: string;
  prompt: string;
  help?: string;
  options: AnswerOption[];
}

export interface PillarSection {
  pillar: Pillar;
  title: string;
  why: string; // why we ask — the insurance/premium rationale
  questions: Question[];
  evidence: { id: string; label: string; hint: string };
}

export const QUESTIONNAIRE: PillarSection[] = [
  {
    pillar: "people_capability",
    title: "People & Capability",
    why: "Driver competency and fatigue management are the biggest predictors of at-fault heavy-vehicle claims. Strong controls here directly lower your premium.",
    questions: [
      {
        id: "pc_fatigue",
        prompt: "What share of your drivers hold current fatigue-management accreditation?",
        options: [
          { value: "all", label: "All drivers", riskWeight: 1 },
          { value: "most", label: "Most (80%+)", riskWeight: 2 },
          { value: "some", label: "Some (under 80%)", riskWeight: 4 },
          { value: "none", label: "Not tracked", riskWeight: 5 },
        ],
      },
      {
        id: "pc_review",
        prompt: "How often do you review licence and induction status?",
        options: [
          { value: "monthly", label: "Monthly", riskWeight: 1 },
          { value: "quarterly", label: "Quarterly", riskWeight: 2 },
          { value: "annually", label: "Annually", riskWeight: 3 },
          { value: "adhoc", label: "Ad-hoc / on incident", riskWeight: 5 },
        ],
      },
      {
        id: "pc_da",
        prompt: "Do you operate a documented drug & alcohol policy?",
        options: [
          { value: "yes_tested", label: "Yes, with random testing", riskWeight: 1 },
          { value: "yes", label: "Yes, policy only", riskWeight: 3 },
          { value: "no", label: "No", riskWeight: 5 },
        ],
      },
    ],
    evidence: {
      id: "pc_cert",
      label: "Driver training / accreditation record",
      hint: "Photo of a current fatigue-management certificate or training register.",
    },
  },
  {
    pillar: "asset_management",
    title: "Asset Management",
    why: "Roadworthiness — tyres, brakes and maintenance discipline — determines both breakdown and collision risk. Well-maintained fleets earn a lower rate.",
    questions: [
      {
        id: "am_inspection",
        prompt: "How often are pre-trip inspections logged?",
        options: [
          { value: "every", label: "Every trip", riskWeight: 1 },
          { value: "daily", label: "Daily", riskWeight: 2 },
          { value: "weekly", label: "Weekly", riskWeight: 4 },
          { value: "none", label: "Not logged", riskWeight: 5 },
        ],
      },
      {
        id: "am_tyre",
        prompt: "At what tyre tread depth do you replace?",
        help: "NTI standard AM-4.2.1 requires a minimum 1.6mm across the central three-quarters.",
        options: [
          { value: "3mm", label: "3mm or above", riskWeight: 1 },
          { value: "2mm", label: "Around 2mm", riskWeight: 2 },
          { value: "legal", label: "At the legal limit (1.6mm)", riskWeight: 3 },
          { value: "below", label: "Run until worn", riskWeight: 5 },
        ],
      },
      {
        id: "am_workshop",
        prompt: "Who services the fleet?",
        options: [
          { value: "accredited", label: "NTI-accredited workshop", riskWeight: 1 },
          { value: "licensed", label: "Licensed workshop", riskWeight: 2 },
          { value: "inhouse", label: "In-house mechanics", riskWeight: 3 },
          { value: "mixed", label: "Mixed / as needed", riskWeight: 4 },
        ],
      },
    ],
    evidence: {
      id: "am_tyre_photo",
      label: "Tyre tread close-up",
      hint: "Photo of a front tyre showing tread depth, ideally with a gauge.",
    },
  },
  {
    pillar: "emergency_incident",
    title: "Emergency & Incident",
    why: "Preparedness caps the severity of an incident once it happens. Tested plans and current equipment reduce claim size.",
    questions: [
      {
        id: "ei_fire",
        prompt: "When was your fire equipment last inspected?",
        help: "NTI standard EI-2.3.1 requires inspection within the past 12 months.",
        options: [
          { value: "6", label: "Within 6 months", riskWeight: 1 },
          { value: "12", label: "6–12 months ago", riskWeight: 2 },
          { value: "over", label: "Over 12 months ago", riskWeight: 5 },
          { value: "unsure", label: "Unsure", riskWeight: 4 },
        ],
      },
      {
        id: "ei_plan",
        prompt: "Do you have a documented incident-response plan?",
        options: [
          { value: "drilled", label: "Yes, and we drill it", riskWeight: 1 },
          { value: "yes", label: "Yes, not drilled", riskWeight: 3 },
          { value: "no", label: "No", riskWeight: 5 },
        ],
      },
      {
        id: "ei_firstaid",
        prompt: "First-aid trained staff on each site?",
        options: [
          { value: "yes", label: "Yes, every site", riskWeight: 1 },
          { value: "some", label: "Some sites", riskWeight: 3 },
          { value: "no", label: "No", riskWeight: 5 },
        ],
      },
    ],
    evidence: {
      id: "ei_fire_photo",
      label: "Fire equipment inspection tag",
      hint: "Photo of an extinguisher's inspection tag showing the last service date.",
    },
  },
  {
    pillar: "site_safety_security",
    title: "Site Safety & Security",
    why: "Load restraint and depot security drive third-party liability and theft claims. Disciplined controls here lower both frequency and cost.",
    questions: [
      {
        id: "ss_restraint",
        prompt: "How often is load restraint checked before departure?",
        help: "NTI standard SS-1.4.2 requires restraint inspection before each departure.",
        options: [
          { value: "every", label: "Every departure", riskWeight: 1 },
          { value: "random", label: "Random checks", riskWeight: 3 },
          { value: "rarely", label: "Rarely", riskWeight: 5 },
        ],
      },
      {
        id: "ss_access",
        prompt: "How is depot access controlled?",
        options: [
          { value: "gated_logged", label: "Gated and logged", riskWeight: 1 },
          { value: "gated", label: "Gated only", riskWeight: 2 },
          { value: "open", label: "Open access", riskWeight: 4 },
        ],
      },
      {
        id: "ss_cctv",
        prompt: "CCTV and lighting at the depot?",
        options: [
          { value: "both", label: "Both", riskWeight: 1 },
          { value: "one", label: "One of the two", riskWeight: 3 },
          { value: "neither", label: "Neither", riskWeight: 5 },
        ],
      },
    ],
    evidence: {
      id: "ss_restraint_photo",
      label: "Load restraint on a loaded vehicle",
      hint: "Photo showing straps/chains securing a typical load.",
    },
  },
];
