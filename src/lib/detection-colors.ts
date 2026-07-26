import type { DetectionKind } from "@/lib/data/analysis";

// Detection colour by kind — pulled from the design tokens. Shared between
// the photo and video overlays so a "tyre" box means the same colour in both.
export const KIND_COLOR: Record<DetectionKind, string> = {
  vehicle: "var(--ink)",
  component: "var(--accent-deep)",
  tyre: "var(--tier-2-ink)",
  plate: "var(--tier-1-ink)",
  load: "var(--tier-1-ink)",
  hazard: "var(--tier-3-ink)",
};
