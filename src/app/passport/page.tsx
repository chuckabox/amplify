import type { Metadata } from "next";
import PassportClient from "./_client";

export const metadata: Metadata = {
  title: "Passport",
  description:
    "A living Passport that links extracted evidence to safety controls and shows engineers what changed since the last review.",
};

export default function PassportPage() {
  return <PassportClient />;
}
