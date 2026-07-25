import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-6 py-16 flex-1">
      <Reveal>
        <p className="field-label">LEGAL REGISTER</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink">
          Privacy Policy
        </h1>
        <div className="mt-4 border-t-[3px] border-double border-rule-strong" />
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-muted">
          <p>
            This privacy notice is for demonstration purposes only. Tonnage is a
            simulation of a heavy-vehicle risk-audit platform for NTI. No actual
            personal data is stored or processed on behalf of any commercial entity.
          </p>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              1. Information We Demo
            </h2>
            <p>
              For the purpose of showcasing the Tonnage user flow, we collect
              simulated fleet metadata, audit responses, and demonstration photos.
              This data is persisted locally in your browser&apos;s local storage and is
              not transmitted to any external servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              2. Security & Verification
            </h2>
            <p>
              In a production environment, Tonnage/NTI relies on multi-layered trust
              controls including EXIF photo metadata, GPS checks, and telematics.
              In this demo, all uploaded files are processed only in-memory to simulate
              the triage engine.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              3. Your Rights
            </h2>
            <p>
              You can wipe all stored data at any time by clearing your browser&apos;s site data
              or using the reset features within the demo operator topbar interface.
            </p>
          </section>
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-12 border-t border-rule pt-6 flex justify-between items-center">
          <p className="font-mono text-xs text-ink-faint">
            REF: REG-PRIVACY-v1
          </p>
          <Link href="/">
            <Button variant="outline" size="sm">
              Return Home
            </Button>
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
