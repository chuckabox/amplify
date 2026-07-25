import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { Wordmark } from "@/components/logo";
import { PhotoPlate } from "@/components/photo-plate";
import { HeroLottie } from "@/components/hero-lottie";
import { TierSplit, type Lane } from "@/components/tier-split";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

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

const STEPS = [
  {
    n: "01",
    title: "Answer the questions",
    body: "Four topics, a few questions each, plus photos from the yard. Works on a phone.",
    seed: "wb-depot-yard",
    alt: "A driver photographing a trailer's load restraints in a depot yard",
  },
  {
    n: "02",
    title: "We read the evidence",
    body: "AI checks what the photos actually show — tread depth, tag dates, strap condition — and scores the answers against safety standards.",
    seed: "wb-tyre-detail",
    alt: "Close inspection of a heavy vehicle tyre showing tread depth",
  },
  {
    n: "03",
    title: "You get a result",
    body: "Every audit lands in one of three lanes with a reason. An engineer signs every outcome — the AI routes, it doesn't decide.",
    seed: "wb-engineer-desk",
    alt: "A risk engineer reviewing audit evidence on screen",
  },
];

const CHECKS = [
  {
    label: "Metadata",
    body: "GPS, time, and device are checked against the depot and submission window.",
  },
  {
    label: "Re-use",
    body: "Photos from earlier submissions are flagged, including re-crops.",
  },
  {
    label: "Hard gates",
    body: "Some findings always go to a person, no matter what the score says.",
  },
  {
    label: "Sign-off",
    body: "An engineer signs every adverse outcome. The AI routes, not decides.",
  },
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
                  Tonnage reads every transport risk audit, passes the ones that
                  are fine, and pulls aside the few that aren&apos;t. Three
                  engineers do the work of thirty.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link href="/audit" className="sm:w-auto">
                    <Button variant="accent" size="lg" className="w-full sm:w-auto">
                      Start an audit
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
            <p className="field-label">How it works</p>
            <h2 className="mt-5 max-w-[18ch] text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
              From the yard to the decision.
            </h2>
          </Reveal>

          <div className="mt-20 flex flex-col gap-24 md:gap-32">
            {STEPS.map((step, i) => (
              <Reveal key={step.n}>
                <article className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
                  <div
                    className={`md:col-span-6 ${i % 2 === 1 ? "md:order-2" : ""}`}
                  >
                    <span
                      className="font-display text-[3.5rem] leading-none text-rule-strong"
                      aria-hidden
                    >
                      {step.n}
                    </span>
                    <h3 className="mt-4 max-w-[22ch] text-2xl leading-tight">
                      {step.title}
                    </h3>
                    <p className="mt-4 max-w-[48ch] leading-[1.7] text-ink-muted">
                      {step.body}
                    </p>
                  </div>
                  <PhotoPlate
                    seed={step.seed}
                    alt={step.alt}
                    width={1000}
                    height={700}
                    className={`md:col-span-6 ${i % 2 === 1 ? "md:order-1" : ""}`}
                    imageClassName="aspect-[7/5]"
                  />
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Anti-gaming ---------- */}
        <section className="border-y border-rule bg-paper-sunk/50">
          <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
            <Reveal>
              <p className="field-label">Trust</p>
              <h2 className="mt-5 max-w-[24ch] text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                Built for the submissions that try it on.
              </h2>
              <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                Self-reported evidence invites people to improve it. That&apos;s
                a design constraint, not an edge case.
              </p>
            </Reveal>

            <Stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {CHECKS.map((c, i) => (
                <StaggerItem
                  key={c.label}
                  className="relative border-t-2 border-ink/10 pt-6"
                >
                  <span
                    className="absolute top-0 left-0 h-[2px] w-8 bg-accent"
                    aria-hidden
                  />
                  <span className="font-mono text-[11px] tracking-[0.1em] text-ink-faint">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-[0.9375rem] font-semibold">
                    {c.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {c.body}
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ---------- The multiplier ---------- */}
        <section className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
          <Reveal>
            <div className="text-center">
              <p className="field-label">The maths</p>
              <h2 className="mx-auto mt-5 max-w-[20ch] text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                3 engineers. 30 operators&apos; worth of coverage.
              </h2>
            </div>

            <div className="mx-auto mt-16 flex max-w-[520px] items-center justify-center gap-6 md:gap-10">
              <div className="text-center">
                <span className="field-label">Before</span>
                <div className="mt-3 font-mono text-[clamp(4rem,8vw,6rem)] leading-none tabular-nums tracking-[-0.04em] text-ink-muted">
                  30
                </div>
                <span className="mt-2 block text-sm text-ink-muted">
                  assessors
                </span>
              </div>
              <span
                className="font-mono text-3xl text-rule-strong md:text-4xl"
                aria-hidden
              >
                →
              </span>
              <div className="text-center">
                <span className="field-label">After</span>
                <div className="mt-3 font-mono text-[clamp(4rem,8vw,6rem)] leading-none tabular-nums tracking-[-0.04em]">
                  3
                </div>
                <span className="mt-2 block text-sm text-ink-muted">
                  engineers
                </span>
              </div>
            </div>

            <p className="mx-auto mt-10 max-w-[48ch] text-center text-[1.0625rem] leading-[1.7] text-ink-muted">
              At 10% in-person, those three spend their time on audits where
              their judgement changes the outcome. Same portfolio. Same
              standards. A person still signs every outcome.
            </p>
          </Reveal>
        </section>

        {/* ---------- Closing ---------- */}
        <section className="border-t border-rule">
          <div className="mx-auto max-w-[1240px] px-6 py-24 text-center md:py-32">
            <Reveal>
              <h2 className="mx-auto max-w-[20ch] text-[clamp(2rem,3.8vw,3rem)] leading-[1.05]">
                Others automate the report.
                <span className="block text-ink-muted">
                  We change who runs the audit.
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
                    Start an audit
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
