import type { Metadata } from "next";
import AuditClient from "./_client";

export const metadata: Metadata = {
  title: "Upload records",
  description:
    "Upload business records. TONNAGE extracts facts, connects them to assets or people, and maps findings to risk controls.",
};

export default function AuditPage() {
  return <AuditClient />;
}
