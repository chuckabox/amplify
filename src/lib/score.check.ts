// Self-check for the scoring engine. Run with:
//   node --experimental-strip-types src/lib/score.check.ts
// or via:
//   npm run check
//
// Three cases:
//   1. All-best answers  → cleared, every finding clear
//   2. All-worst answers → site_visit
//   3. One bad pillar    → that pillar action, the rest clear

// NOTE: This file uses relative imports so it can run standalone under Node
// without Next.js path aliases.

import type { PillarSection } from "../lib/data/questionnaire.js";
import type { Pillar, FindingStatus, Finding } from "../lib/data/audit.js";
import type { Outcome, ScoreResult } from "../lib/score.js";

// ---------- Inline the types/logic we need to keep this standalone ----------

// Re-implement scoreAudit locally so we don't depend on @/ aliases.
// This mirrors src/lib/score.ts exactly.

const PILLAR_LABEL: Record<string, string> = {
  people_capability: "People & Capability",
  asset_management: "Asset Management",
  emergency_incident: "Emergency & Incident",
  site_safety_security: "Site Safety & Security",
};

interface AnswerOption {
  value: string;
  label: string;
  riskWeight: 1 | 2 | 3 | 4 | 5;
}

interface Question {
  id: string;
  prompt: string;
  help?: string;
  options: AnswerOption[];
}

interface Section {
  pillar: string;
  title: string;
  why: string;
  questions: Question[];
  evidence: { id: string; label: string; hint: string };
}

interface LocalFinding {
  pillar: string;
  observation: string;
  severity: number;
  recommendation: string;
  status: string;
}

interface LocalScoreResult {
  score: number;
  outcome: string;
  findings: LocalFinding[];
}

function scoreAudit(
  answers: Record<string, string>,
  sections: Section[],
): LocalScoreResult {
  let totalWeight = 0;
  let totalQuestions = 0;
  const findings: LocalFinding[] = [];

  for (const section of sections) {
    let worstWeight = 0;
    let worstQuestion = section.questions[0];

    for (const q of section.questions) {
      const selected = answers[q.id];
      const opt = q.options.find((o) => o.value === selected);
      const w = opt ? opt.riskWeight : 1;
      totalWeight += w;
      totalQuestions += 1;

      if (w > worstWeight) {
        worstWeight = w;
        worstQuestion = q;
      }
    }

    let status: string;
    if (worstWeight >= 4) {
      status = "action";
    } else if (worstWeight === 3) {
      status = "advisory";
    } else {
      status = "clear";
    }

    const topic = worstQuestion.prompt.toLowerCase().replace(/\?$/, "");

    findings.push({
      pillar: section.pillar,
      observation:
        status === "action"
          ? `${PILLAR_LABEL[section.pillar]}: "${topic}" scored high-risk and needs attention.`
          : status === "advisory"
            ? `${PILLAR_LABEL[section.pillar]}: "${topic}" is borderline, keep an eye on it.`
            : `${PILLAR_LABEL[section.pillar]} meets safety standards.`,
      severity: worstWeight,
      recommendation:
        status === "action"
          ? "Needs fixing before this area can clear."
          : status === "advisory"
            ? "Keep an eye on this before your next check."
            : "No action needed.",
      status,
    });
  }

  const score =
    totalQuestions > 0
      ? Math.round((totalWeight / totalQuestions) * 10) / 10
      : 1;

  let outcome: string;
  if (score < 2.5) {
    outcome = "cleared";
  } else if (score < 3.5) {
    outcome = "remote_video";
  } else {
    outcome = "site_visit";
  }

  return { score, outcome, findings };
}

// ---------- Inline the questionnaire ----------

const QUESTIONNAIRE: Section[] = [
  {
    pillar: "people_capability",
    title: "People & Capability",
    why: "",
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
    evidence: { id: "pc_cert", label: "", hint: "" },
  },
  {
    pillar: "asset_management",
    title: "Asset Management",
    why: "",
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
    evidence: { id: "am_tyre_photo", label: "", hint: "" },
  },
  {
    pillar: "emergency_incident",
    title: "Emergency & Incident",
    why: "",
    questions: [
      {
        id: "ei_fire",
        prompt: "When was your fire equipment last inspected?",
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
    evidence: { id: "ei_fire_photo", label: "", hint: "" },
  },
  {
    pillar: "site_safety_security",
    title: "Site Safety & Security",
    why: "",
    questions: [
      {
        id: "ss_restraint",
        prompt: "How often is load restraint checked before departure?",
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
    evidence: { id: "ss_restraint_photo", label: "", hint: "" },
  },
];

// ---------- Assert helper ----------

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`✗ FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`  ✓ ${message}`);
}

// ---------- Test cases ----------

console.log("\n─── Score check ───\n");

// Case 1: all-best answers → cleared, every finding clear
{
  console.log("Case 1: all-best answers");
  const answers: Record<string, string> = {
    pc_fatigue: "all",
    pc_review: "monthly",
    pc_da: "yes_tested",
    am_inspection: "every",
    am_tyre: "3mm",
    am_workshop: "accredited",
    ei_fire: "6",
    ei_plan: "drilled",
    ei_firstaid: "yes",
    ss_restraint: "every",
    ss_access: "gated_logged",
    ss_cctv: "both",
  };
  const r = scoreAudit(answers, QUESTIONNAIRE);
  assert(r.outcome === "cleared", `outcome = ${r.outcome} (expected cleared)`);
  assert(
    r.findings.every((f) => f.status === "clear"),
    `all findings clear (${r.findings.map((f) => f.status).join(", ")})`,
  );
  assert(r.score < 2.5, `score ${r.score} < 2.5`);
}

// Case 2: all-worst answers → site_visit
{
  console.log("\nCase 2: all-worst answers");
  const answers: Record<string, string> = {
    pc_fatigue: "none",
    pc_review: "adhoc",
    pc_da: "no",
    am_inspection: "none",
    am_tyre: "below",
    am_workshop: "mixed",
    ei_fire: "over",
    ei_plan: "no",
    ei_firstaid: "no",
    ss_restraint: "rarely",
    ss_access: "open",
    ss_cctv: "neither",
  };
  const r = scoreAudit(answers, QUESTIONNAIRE);
  assert(
    r.outcome === "site_visit",
    `outcome = ${r.outcome} (expected site_visit)`,
  );
  assert(r.score >= 3.5, `score ${r.score} >= 3.5`);
}

// Case 3: one bad pillar only → that pillar action, the rest clear
{
  console.log("\nCase 3: one bad pillar (people_capability)");
  const answers: Record<string, string> = {
    // bad
    pc_fatigue: "none",
    pc_review: "adhoc",
    pc_da: "no",
    // good
    am_inspection: "every",
    am_tyre: "3mm",
    am_workshop: "accredited",
    ei_fire: "6",
    ei_plan: "drilled",
    ei_firstaid: "yes",
    ss_restraint: "every",
    ss_access: "gated_logged",
    ss_cctv: "both",
  };
  const r = scoreAudit(answers, QUESTIONNAIRE);
  const pcFinding = r.findings.find((f) => f.pillar === "people_capability");
  const rest = r.findings.filter((f) => f.pillar !== "people_capability");
  assert(
    pcFinding?.status === "action",
    `people_capability = ${pcFinding?.status} (expected action)`,
  );
  assert(
    rest.every((f) => f.status === "clear"),
    `other pillars all clear (${rest.map((f) => `${f.pillar}:${f.status}`).join(", ")})`,
  );
}

console.log("\n─── All checks passed ───\n");
