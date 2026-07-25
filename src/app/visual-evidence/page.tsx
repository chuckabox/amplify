import type { Metadata } from "next";
import VisualEvidenceClient from "./_client";

export const metadata: Metadata = {
  title: "Vision",
  description:
    "Upload truck photos and walk-around videos. Tonnage scans image metadata, checks photo reuse, reads plates, estimates tyre tread and maps findings to risk controls.",
};

export default function VisualEvidencePage() {
  return <VisualEvidenceClient />;
}
