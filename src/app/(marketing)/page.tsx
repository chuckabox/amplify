import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { Wordmark } from "@/components/logo";
import { HeroLottie } from "@/components/hero-lottie";
import { TierSplit, type Lane } from "@/components/tier-split";
import { StepTabs, type Step } from "@/components/step-tabs";
import { Reveal } from "@/components/motion";

const LANES: Lane[] = [
  {
    share: 0.68,
    tier: 1,
    name: "Cleared on evidence",
    detail: "Clean submission. Straight through.",
  },
  {
    share: 0.22,
    tier: 2,
    name: "Verified remotely",
    detail: "One thing unclear. Send a clip, not a person.",
  },
  {
    share: 0.1,
    tier: 3,
    name: "Seen in person",
    detail: "Real risk. Send someone.",
  },
];

const STEPS: Step[] = [
  {
    n: "01",
    title: "Upload existing records",
    body: "Drop in maintenance PDFs, driver credentials, incident reports, photos and walk-around videos. No forms to rebuild.",
    seed: "wb-depot-yard",
    alt: "Transport operator records ready for digital review",
  },
  {
    n: "02",
    title: "We structure the facts",
    body: "Tonnage extracts vehicles, drivers, dates, defects and actions, then links each fact to the entity and control it proves.",
    seed: "wb-tyre-detail",
    alt: "Structured transport compliance information extracted from source records",
  },
  {
    n: "03",
    title: "The passport stays current",
    body: "Every upload updates a living risk profile. Engineers see what changed, what is missing and which controls are actually working.",
    seed: "wb-engineer-desk",
    alt: "A risk engineer reviewing a living business risk profile",
  },
];

const STATS = [
  { value: "90%", label: "Cleared without a visit" },
  { value: "11s", label: "Average decision time" },
  { value: "10×", label: "More coverage, same team" },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main id="main" className="flex-1">
        {/* ---------- Hero ---------- */}
        <section className="mx-auto max-w-[1240px] px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
            <div>
              <Reveal>
                <h1 className="text-[clamp(2.75rem,6.4vw,5rem)] leading-[0.95]">
                  Most trucks roll straight over.
                  <span className="block text-ink-muted">
                    Only some get pulled aside.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-8 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                  Tonnage turns existing records, photos and videos into a living
                  Risk Passport, then pulls aside only the changes that need an
                  engineer. Three engineers do the work of thirty.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link href="/audit" className="sm:w-auto">
                    <Button variant="accent" size="lg" className="w-full sm:w-auto">
                      Upload records
                      <ButtonIconWell>
                        <Arrow />
                      </ButtonIconWell>
                    </Button>
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.28} className="flex items-center">
              <HeroLottie />
            </Reveal>
          </div>
        </section>

        {/* ---------- The split ---------- */}
        <section className="border-y border-rule bg-paper-sunk/50">
          <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
            <Reveal>
              <h2 className="max-w-[24ch] text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                Three lanes. Only one costs a day.
              </h2>
              <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                The drive costs more than the assessment. Route on evidence and
                only the visits that matter happen.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-16">
              <TierSplit lanes={LANES} />
            </Reveal>
          </div>
        </section>

        {/* ---------- How it works ---------- */}
        <section className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
          <Reveal>
            <div className="text-center">
              <p className="field-label">How it works</p>
              <h2 className="mx-auto mt-5 max-w-[18ch] text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                From source records to current risk.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-16">
            <StepTabs steps={STEPS} />
          </Reveal>
        </section>

        {/* ---------- The multiplier ---------- */}
        <section className="border-y border-rule bg-paper-sunk/50">
          <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
            <Reveal>
              <div className="text-center">
                <p className="field-label">The maths</p>
                <h2 className="mx-auto mt-5 max-w-[20ch] text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                  3 engineers. 30 operators&apos; worth of coverage.
                </h2>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mx-auto mt-16 grid max-w-[720px] grid-cols-3 gap-6">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="text-center"
                  >
                    <div className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-none tracking-tight">
                      {s.value}
                    </div>
                    <p className="mt-3 text-sm text-ink-muted">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mx-auto mt-12 max-w-[48ch] text-center text-[1.0625rem] leading-[1.7] text-ink-muted">
                At 10% in-person, those three spend their time on audits where
                their judgement changes the outcome. Same portfolio. Same
                standards. A person still signs every outcome.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ---------- Closing ---------- */}
        <section className="border-t border-rule">
          <div className="mx-auto max-w-[1240px] px-6 py-24 text-center md:py-32">
            <Reveal>
              <h2 className="mx-auto max-w-[20ch] text-[clamp(2rem,3.8vw,3rem)] leading-[1.05]">
                Others automate the report.
                <span className="block text-ink-muted">
                  We make the evidence reusable.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-[42ch] leading-[1.7] text-ink-muted">
                Built for insurers with more heavy-motor risk than people to
                inspect it.
              </p>
              <div className="mt-8 flex justify-center">
                <Link href="/audit">
                  <Button variant="accent" size="lg">
                    Build a Risk Passport
                    <ButtonIconWell>
                      <Arrow />
                    </ButtonIconWell>
                  </Button>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-[3px] border-double border-rule-strong">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 py-12 md:flex-row md:items-start md:justify-between">
        <div>
          <Wordmark size="sm" />
          <p className="mt-4 max-w-[38ch] text-sm leading-relaxed text-ink-muted">
            Risk-audit routing for heavy motor portfolios.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-8 gap-y-3 text-sm"
        >
          <Link href="/privacy" className="text-ink-muted hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="text-ink-muted hover:text-ink">
            Terms
          </Link>
        </nav>
      </div>
      <div className="mx-auto max-w-[1240px] px-6 pb-10">
        <p className="font-mono text-[11px] tracking-[0.08em] text-ink-faint">
          © {new Date().getFullYear()} TONNAGE · AUSTRALIA
        </p>
      </div>
    </footer>
  );
}
