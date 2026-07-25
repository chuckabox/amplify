import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion";

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-[720px] px-6 py-16 flex-1">
      <Reveal>
        <p className="field-label">LEGAL REGISTER</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-ink">
          Terms of Service
        </h1>
        <div className="mt-4 border-t-[3px] border-double border-rule-strong" />
      </Reveal>

      <Reveal delay={0.08}>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-ink-muted">
          <p>
            These Terms of Service govern your use of the TONNAGE demonstration platform.
            By entering the platform, you acknowledge that this is a simulated
            product environment created for demonstration purposes.
          </p>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              1. Simulated Use Only
            </h2>
            <p>
              TONNAGE is provided &quot;as is&quot; to show the visual redesign of the heavy-vehicle
              risk-audit platform (formerly RiskGate). No real insurance coverage is offered,
              implied, or modified through the usage of this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              2. Accuracy of Calculations
            </h2>
            <p>
              The premium adjustments, mileage loadings, and audit outcome scores displayed in
              TONNAGE are simulated calculation routines running client-side. They do not reflect NTI
              underwriting policies or actual heavy vehicle premium schedules.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold text-ink">
              3. Demonstration Uploads
            </h2>
            <p>
              Uploaded photos do not represent official compliance document submissions.
              Please do not upload sensitive, personal, or proprietary business documents.
            </p>
          </section>
        </div>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-12 border-t border-rule pt-6 flex justify-between items-center">
          <p className="text-xs text-ink-faint">
            REF: REG-TERMS-v1
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
