// Real scoring engine. Uses the riskWeight (1..5) baked into every questionnaire
// option to compute a score and per-pillar findings, replacing the old
// FORCED_TIER lookup.

import type { Pillar, Finding, FindingStatus } from "@/lib/data/audit";
import { PILLAR_LABEL } from "@/lib/data/audit";
import type { PillarSection, AnswerOption } from "@/lib/data/questionnaire";

// ---------- Types ----------

export type Outcome = "cleared" | "remote_video" | "site_visit";

export const OUTCOME_LABEL: Record<Outcome, string> = {
  cleared: "Cleared on evidence",
  remote_video: "Remote video verification",
  site_visit: "Site visit",
};

export interface ScoreResult {
  /** Mean riskWeight across all answers, 1..5. */
  score: number;
  /** Which outcome band the score falls into. */
  outcome: Outcome;
  /** One finding per pillar. */
  findings: Finding[];
}

// ---------- Scoring logic ----------

/**
 * Score an audit from the answers and the questionnaire structure.
 *
 * @param answers  Record<questionId, selectedValue>
 * @param sections The QUESTIONNAIRE array.
 */
export function scoreAudit(
  answers: Record<string, string>,
  sections: PillarSection[],
): ScoreResult {
  let totalWeight = 0;
  let totalQuestions = 0;
  const findings: Finding[] = [];

  for (const section of sections) {
    let worstWeight = 0;
    let worstQuestion = section.questions[0];

    for (const q of section.questions) {
      const selected = answers[q.id];
      const opt: AnswerOption | undefined = q.options.find(
        (o) => o.value === selected,
      );
      const w = opt ? opt.riskWeight : 1; // default to best if unanswered
      totalWeight += w;
      totalQuestions += 1;

      if (w > worstWeight) {
        worstWeight = w;
        worstQuestion = q;
      }
    }

    // Determine finding status from worst answered weight in this pillar.
    let status: FindingStatus;
    if (worstWeight >= 4) {
      status = "action";
    } else if (worstWeight === 3) {
      status = "advisory";
    } else {
      status = "clear";
    }

    const topic = worstQuestion.prompt.toLowerCase().replace(/\?$/, "");

    findings.push({
      pillar: section.pillar as Pillar,
      observation:
        status === "action"
          ? `${PILLAR_LABEL[section.pillar as Pillar]}: "${topic}" scored high-risk and needs attention.`
          : status === "advisory"
            ? `${PILLAR_LABEL[section.pillar as Pillar]}: "${topic}" is borderline, keep an eye on it.`
            : `${PILLAR_LABEL[section.pillar as Pillar]} meets safety standards.`,
      severity: worstWeight as Finding["severity"],
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
    totalQuestions > 0 ? Math.round((totalWeight / totalQuestions) * 10) / 10 : 1;

  let outcome: Outcome;
  if (score < 2.5) {
    outcome = "cleared";
  } else if (score < 3.5) {
    outcome = "remote_video";
  } else {
    outcome = "site_visit";
  }

  return { score, outcome, findings };
}
