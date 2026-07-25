// The guided-audit questionnaire, mapped to the four risk pillars.
// Each option carries a riskWeight (1 = best, 5 = worst).

import type { Pillar } from "@/lib/data/audit";

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
  why: string;
  questions: Question[];
  evidence: { id: string; label: string; hint: string };
}

export const QUESTIONNAIRE: PillarSection[] = [
  {
    pillar: "people_capability",
    title: "People & Capability",
    why: "Driver training and fatigue management are the biggest predictors of claims.",
    questions: [
      {
        id: "pc_fatigue",
        prompt: "How many drivers have current fatigue accreditation?",
        options: [
          { value: "all", label: "All of them", riskWeight: 1 },
          { value: "most", label: "Most (80%+)", riskWeight: 2 },
          { value: "some", label: "Some (under 80%)", riskWeight: 4 },
          { value: "none", label: "Not tracked", riskWeight: 5 },
        ],
      },
      {
        id: "pc_review",
        prompt: "How often do you check licence and induction status?",
        options: [
          { value: "monthly", label: "Monthly", riskWeight: 1 },
          { value: "quarterly", label: "Quarterly", riskWeight: 2 },
          { value: "annually", label: "Annually", riskWeight: 3 },
          { value: "adhoc", label: "Only after incidents", riskWeight: 5 },
        ],
      },
      {
        id: "pc_da",
        prompt: "Do you have a drug & alcohol policy?",
        options: [
          { value: "yes_tested", label: "Yes, with random testing", riskWeight: 1 },
          { value: "yes", label: "Yes, policy only", riskWeight: 3 },
          { value: "no", label: "No", riskWeight: 5 },
        ],
      },
    ],
    evidence: {
      id: "pc_cert",
      label: "Training record",
      hint: "Photo of a current certificate or training register.",
    },
  },
  {
    pillar: "asset_management",
    title: "Asset Management",
    why: "Tyres, brakes, and maintenance discipline drive breakdown and collision risk.",
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
        prompt: "When do you replace tyres?",
        help: "Minimum 1.6mm tread across the central three-quarters.",
        options: [
          { value: "3mm", label: "At 3mm or above", riskWeight: 1 },
          { value: "2mm", label: "Around 2mm", riskWeight: 2 },
          { value: "legal", label: "At the legal limit", riskWeight: 3 },
          { value: "below", label: "Run until worn", riskWeight: 5 },
        ],
      },
      {
        id: "am_workshop",
        prompt: "Who services the fleet?",
        options: [
          { value: "accredited", label: "Accredited workshop", riskWeight: 1 },
          { value: "licensed", label: "Licensed workshop", riskWeight: 2 },
          { value: "inhouse", label: "In-house mechanics", riskWeight: 3 },
          { value: "mixed", label: "Mixed / as needed", riskWeight: 4 },
        ],
      },
    ],
    evidence: {
      id: "am_tyre_photo",
      label: "Tyre close-up",
      hint: "Photo of a front tyre showing tread depth.",
    },
  },
  {
    pillar: "emergency_incident",
    title: "Emergency & Incident",
    why: "Preparedness limits how bad things get when something goes wrong.",
    questions: [
      {
        id: "ei_fire",
        prompt: "When was fire equipment last inspected?",
        help: "Must be within the past 12 months.",
        options: [
          { value: "6", label: "Within 6 months", riskWeight: 1 },
          { value: "12", label: "6–12 months ago", riskWeight: 2 },
          { value: "over", label: "Over 12 months ago", riskWeight: 5 },
          { value: "unsure", label: "Unsure", riskWeight: 4 },
        ],
      },
      {
        id: "ei_plan",
        prompt: "Do you have an incident-response plan?",
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
      label: "Fire equipment tag",
      hint: "Photo of an extinguisher tag showing the last service date.",
    },
  },
  {
    pillar: "site_safety_security",
    title: "Site Safety & Security",
    why: "Load restraint and depot security drive liability and theft claims.",
    questions: [
      {
        id: "ss_restraint",
        prompt: "How often is load restraint checked before departure?",
        help: "Must be checked before each departure.",
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
      label: "Load restraint photo",
      hint: "Photo showing straps or chains securing a load.",
    },
  },
];
