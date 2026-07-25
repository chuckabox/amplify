import type { Finding } from "@/lib/data/audit";

export type Outcome = "cleared" | "remote_video" | "site_visit";

export type EvidenceSource = "upload" | "truckA" | "truckB";

export const OUTCOME_LABEL: Record<Outcome, string> = {
  cleared: "Cleared on evidence",
  remote_video: "Remote video verification",
  site_visit: "Site visit",
};

export interface ScoreResult {
  /** Mean evidence risk, 1 (low) to 5 (high). */
  score: number;
  outcome: Outcome;
  findings: Finding[];
}

const RESULTS: Record<EvidenceSource, ScoreResult> = {
  truckA: {
    score: 2.8,
    outcome: "remote_video",
    findings: [
      {
        pillar: "asset_management",
        observation:
          "Steer tyre tread is approximately 7.4 mm and comfortably above the minimum.",
        severity: 1,
        recommendation: "No action needed.",
        status: "clear",
      },
      {
        pillar: "site_safety_security",
        observation:
          "Load restraints are visible, but one rear corner is obscured in the supplied photo.",
        severity: 3,
        recommendation:
          "Send a short walk-around clip that clearly shows the rear restraint point.",
        status: "advisory",
      },
      {
        pillar: "people_capability",
        observation:
          "The vehicle images do not include a readable driver or training record.",
        severity: 2,
        recommendation:
          "Include the current driver credential in the verification clip.",
        status: "advisory",
      },
      {
        pillar: "emergency_incident",
        observation:
          "No emergency-equipment defect is visible in the supplied vehicle evidence.",
        severity: 1,
        recommendation: "No action needed.",
        status: "clear",
      },
    ],
  },
  truckB: {
    score: 1.9,
    outcome: "cleared",
    findings: [
      {
        pillar: "asset_management",
        observation:
          "Vehicle identity, axle configuration and registration plate are consistent across the photo and video.",
        severity: 1,
        recommendation: "No action needed.",
        status: "clear",
      },
      {
        pillar: "site_safety_security",
        observation:
          "The walk-around video is consistent with the still image and shows no sign of reused evidence.",
        severity: 1,
        recommendation: "No action needed.",
        status: "clear",
      },
      {
        pillar: "people_capability",
        observation:
          "The submitted evidence is complete enough for an engineer to review without an interview.",
        severity: 1,
        recommendation: "No action needed.",
        status: "clear",
      },
      {
        pillar: "emergency_incident",
        observation:
          "No emergency-equipment defect is visible in the submitted walk-around.",
        severity: 2,
        recommendation: "No action needed.",
        status: "clear",
      },
    ],
  },
  upload: {
    score: 2.6,
    outcome: "remote_video",
    findings: [
      {
        pillar: "asset_management",
        observation:
          "Vehicle-condition evidence was received and is ready for engineer review.",
        severity: 2,
        recommendation:
          "Keep close-up tyre and registration images in the evidence set.",
        status: "clear",
      },
      {
        pillar: "site_safety_security",
        observation:
          "The supplied media requires a brief remote verification before it can clear.",
        severity: 3,
        recommendation:
          "Join a short video check so an engineer can confirm the visible safety controls.",
        status: "advisory",
      },
      {
        pillar: "people_capability",
        observation:
          "No written answers are required; supporting records can be provided as images.",
        severity: 2,
        recommendation:
          "Add a clear image of any credential an engineer requests.",
        status: "clear",
      },
      {
        pillar: "emergency_incident",
        observation:
          "Emergency-equipment details will be confirmed from the submitted imagery.",
        severity: 2,
        recommendation: "Keep service tags legible and fully in frame.",
        status: "clear",
      },
    ],
  },
};

export function scoreEvidence(source: EvidenceSource): ScoreResult {
  return RESULTS[source];
}
