import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { Logo, Wordmark } from "@/components/logo";
import { PhotoPlate } from "@/components/photo-plate";
import { TierSplit, type Lane } from "@/components/tier-split";
import { Reveal, Stagger, StaggerItem, Ticker } from "@/components/motion";

const LANES: Lane[] = [
  {
    share: 0.68,
    tier: 1,
    count: "1,284 of 1,888",
    name: "Cleared on evidence",
    detail: "Clean submission. Straight through.",
  },
  {
    share: 0.22,
    tier: 2,
    count: "416 of 1,888",
    name: "Verified remotely",
    detail: "One thing unclear. Send a clip, not a person.",
  },
  {
    share: 0.1,
    tier: 3,
    count: "188 of 1,888",
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
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-7">
              <Reveal>
                <p className="field-label">Risk audit routing</p>
                <h1 className="mt-6 text-[clamp(2.75rem,6.4vw,5rem)] leading-[0.95]">
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

            <Reveal delay={0.28} className="lg:col-span-5 lg:mt-16">
              <PhotoPlate
                seed="wb-hero-road-train"
                alt="A loaded prime mover crossing a weighbridge deck at dusk"
                width={900}
                height={1120}
                priority
                imageClassName="aspect-[4/5]"
                caption="Berrimah, NT — 04:12. Submitted from the yard, cleared in 11 seconds."
              />
            </Reveal>
          </div>

          {/* Stats strip */}
          <Reveal delay={0.34}>
            <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-rule pt-8 md:grid-cols-4">
              {[
                { k: "Triage time", v: "8.4", u: "seconds" },
                { k: "Audits run", v: "1,888", u: "total" },
                { k: "Sent to a person", v: "10", u: "per cent" },
                { k: "Engineer sign-off", v: "100", u: "per cent" },
              ].map((s) => (
                <div key={s.k}>
                  <dt className="field-label">{s.k}</dt>
                  <dd className="mt-2.5 font-mono text-[1.625rem] leading-none tabular-nums tracking-[-0.03em]">
                    <Ticker
                      to={Number(s.v.replace(/,/g, ""))}
                      decimals={s.v.includes(".") ? 1 : 0}
                    />
                    <span className="ml-1.5 text-xs font-normal tracking-normal text-ink-muted">
                      {s.u}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>

        {/* ---------- The split ---------- */}
        <section className="border-y border-rule bg-paper-sunk/50">
          <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
            <div className="grid gap-10 lg:grid-cols-12">
              <Reveal className="lg:col-span-4">
                <p className="field-label">Where the work goes</p>
                <h2 className="mt-5 text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                  Three lanes. Only one costs a day.
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-8 lg:pt-3">
                <p className="max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                  The expensive part of an audit is the drive, not the
                  assessment. Route on evidence quality and the site visits that
                  happen are the ones that matter.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.16} className="mt-16">
              <TierSplit lanes={LANES} intake="1,888 submissions · trailing 12 months" />
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
                      style={{
                        fontVariationSettings: '"SOFT" 0, "WONK" 1, "opsz" 144',
                      }}
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
            <div className="grid gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <p className="field-label">Trust</p>
                <h2 className="mt-5 text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                  Built for the submissions that try it on.
                </h2>
                <p className="mt-6 max-w-[42ch] leading-[1.7] text-ink-muted">
                  Self-reported evidence invites people to improve it. That&apos;s
                  a design constraint, not an edge case.
                </p>
              </Reveal>

              <Stagger className="grid gap-px overflow-hidden rounded-[4px] border border-rule bg-rule sm:grid-cols-2 lg:col-span-7">
                {CHECKS.map((c) => (
                  <StaggerItem key={c.label} className="bg-paper-raised p-7">
                    <div className="flex items-baseline gap-3">
                      <span className="h-2 w-2 shrink-0 bg-accent" aria-hidden />
                      <h3 className="text-[0.9375rem] font-semibold">
                        {c.label}
                      </h3>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {c.body}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </section>

        {/* ---------- The multiplier ---------- */}
        <section className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
          <Reveal>
            <div className="grid items-end gap-12 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="field-label">The maths</p>
                <h2 className="mt-5 text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                  3 engineers. 30 operators&apos; worth of coverage.
                </h2>
                <p className="mt-6 max-w-[48ch] leading-[1.7] text-ink-muted">
                  At 10% in-person, those three spend their time on audits where
                  their judgement changes the outcome.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="plate">
                  <div className="plate-core p-8">
                    <div className="flex items-end justify-between gap-6">
                      <div>
                        <span className="field-label">Before</span>
                        <div className="mt-3 font-mono text-[3.5rem] leading-none tabular-nums tracking-[-0.04em] text-ink-muted">
                          30
                        </div>
                        <span className="mt-2 block text-xs text-ink-muted">
                          assessors
                        </span>
                      </div>
                      <span
                        className="mb-6 font-mono text-2xl text-rule-strong"
                        aria-hidden
                      >
                        →
                      </span>
                      <div className="text-right">
                        <span className="field-label">After</span>
                        <div className="mt-3 font-mono text-[3.5rem] leading-none tabular-nums tracking-[-0.04em]">
                          3
                        </div>
                        <span className="mt-2 block text-xs text-ink-muted">
                          engineers
                        </span>
                      </div>
                    </div>
                    <div className="mt-7 border-t border-rule pt-5">
                      <p className="text-sm leading-relaxed text-ink-muted">
                        Same portfolio. Same standards. A person still signs
                        every outcome.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------- Closing ---------- */}
        <section className="border-t border-rule bg-ink text-paper">
          <div className="mx-auto grid max-w-[1240px] gap-10 px-6 py-24 md:grid-cols-12 md:py-32">
            <Reveal className="md:col-span-7">
              <h2 className="text-[clamp(2rem,3.8vw,3rem)] leading-[1.05] text-paper">
                Others automate the report.
                <span className="block text-paper/55">
                  We change who runs the audit.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.12} className="md:col-span-5 md:pt-4">
              <p className="max-w-[42ch] leading-[1.7] text-paper/70">
                Built for insurers with more heavy-motor risk than people to
                inspect it.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/audit">
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
