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
    detail: "Clean submission, metadata checks out, straight through.",
  },
  {
    share: 0.22,
    tier: 2,
    count: "416 of 1,888",
    name: "Verified remotely",
    detail: "One thing is unclear. We ask for a clip instead of a visit.",
  },
  {
    share: 0.1,
    tier: 3,
    count: "188 of 1,888",
    name: "Seen in person",
    detail: "Genuine risk, or evidence we do not believe. Send someone.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "The operator fills in the docket",
    body: "Four pillars, a handful of questions each, and photographs taken on the spot. It runs on a phone in a yard, not on a laptop in an office, because that is where the evidence is.",
    seed: "wb-depot-yard",
    alt: "A driver photographing a trailer's load restraints in a depot yard",
  },
  {
    n: "02",
    title: "The submission is read, not just received",
    body: "Vision analysis measures what the photographs actually show — tread depth, tag dates, strap condition — and the answers are scored against the insurer's own standards. Metadata is checked for the things people do when they would rather not re-do the work.",
    seed: "wb-tyre-detail",
    alt: "Close inspection of a heavy vehicle tyre showing tread depth",
  },
  {
    n: "03",
    title: "It gets routed, and a person signs it",
    body: "Every audit lands in one of three lanes with a written reason attached. No outcome reaches an operator without an engineer putting their name to it — the routing decides where attention goes, never what the finding is.",
    seed: "wb-engineer-desk",
    alt: "A risk engineer reviewing audit evidence on screen",
  },
];

const CHECKS = [
  {
    label: "Metadata",
    body: "GPS, capture time and device are read off every photograph and compared against the depot and the submission window.",
  },
  {
    label: "Re-use",
    body: "Images that have appeared in an earlier submission are flagged, including re-crops and re-saves.",
  },
  {
    label: "Hard gates",
    body: "Some findings cannot be cleared by a score. Restraint failures and lapsed accreditation go to a person regardless of what the rest of the audit looks like.",
  },
  {
    label: "Sign-off",
    body: "An engineer signs every adverse outcome. The model routes; it does not decide.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Masthead — set as a printed head, not a floating glass bar */}
      <header className="border-b-[3px] border-double border-rule-strong">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-end justify-between gap-4 px-6 py-6">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <span className="mr-3 hidden font-mono text-[11px] tracking-[0.1em] text-ink-muted sm:block">
              EST. FOR HEAVY MOTOR RISK
            </span>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Start an audit</Button>
            </Link>
          </div>
        </div>
      </header>

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
                <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                  A weighbridge does not stop every vehicle. It reads each one,
                  passes the ones that are fine, and pulls aside the few that
                  are not. Tonnage does the same thing for transport risk
                  audits — so a team of three can carry a portfolio that would
                  otherwise need thirty, without anyone losing the right to
                  overrule it.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link href="/login" className="sm:w-auto">
                    <Button variant="accent" size="lg" className="w-full sm:w-auto">
                      I run a fleet
                      <ButtonIconWell>
                        <Arrow />
                      </ButtonIconWell>
                    </Button>
                  </Link>
                  <Link href="/queue" className="sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      I&apos;m a risk engineer
                    </Button>
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Photograph offset below the headline baseline, deliberately not
                aligned to the top of the text column. */}
            <Reveal delay={0.28} className="lg:col-span-5 lg:mt-16">
              <PhotoPlate
                seed="wb-hero-road-train"
                alt="A loaded prime mover crossing a weighbridge deck at dusk"
                width={900}
                height={1120}
                priority
                imageClassName="aspect-[4/5]"
                caption="Berrimah, NT — 04:12. Submitted from the yard, cleared in eleven seconds."
              />
            </Reveal>
          </div>

          {/* Docket meta strip */}
          <Reveal delay={0.34}>
            <dl className="mt-20 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-rule pt-8 md:grid-cols-4">
              {[
                { k: "Median triage", v: "8.4", u: "seconds" },
                { k: "Portfolio audited", v: "1,888", u: "submissions" },
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
                  Three lanes, and only one of them costs a day.
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="lg:col-span-8 lg:pt-3">
                <p className="max-w-[62ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                  The expensive part of an audit has never been the assessment.
                  It is the drive. Routing on evidence quality rather than on a
                  calendar means the site visits that do happen are the ones
                  that were always going to matter.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.16} className="mt-16">
              <TierSplit lanes={LANES} intake="1,888 submissions · trailing 12 months" />
            </Reveal>
          </div>
        </section>

        {/* ---------- How it works: zig-zag, not three equal cards ---------- */}
        <section className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
          <Reveal>
            <p className="field-label">The pass</p>
            <h2 className="mt-5 max-w-[18ch] text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
              What happens between the yard and the decision.
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
                    <p className="mt-4 max-w-[54ch] leading-[1.7] text-ink-muted">
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
                <p className="field-label">On being gamed</p>
                <h2 className="mt-5 text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                  Assume some submissions are trying it on.
                </h2>
                <p className="mt-6 max-w-[46ch] leading-[1.7] text-ink-muted">
                  A system that prices risk on self-reported evidence invites
                  people to improve the evidence. That is a design constraint,
                  not an edge case, so it is handled in the routing rather than
                  in a disclaimer.
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
                <p className="field-label">The arithmetic</p>
                <h2 className="mt-5 text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05]">
                  Three engineers, thirty operators&apos; worth of coverage.
                </h2>
                <p className="mt-6 max-w-[54ch] leading-[1.7] text-ink-muted">
                  At ten per cent in-person, a portfolio that needed thirty
                  assessors needs three — and those three spend their week on
                  the audits where their judgement changes the outcome, instead
                  of confirming that a well-run fleet is still well run.
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
                        Same portfolio. Same standards. Same requirement that a
                        person signs the outcome.
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
                Everyone else automates the report.
                <span className="block text-paper/55">
                  We change who runs the audit.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.12} className="md:col-span-5 md:pt-4">
              <p className="max-w-[42ch] leading-[1.7] text-paper/70">
                Tonnage is built for insurers carrying more heavy-motor risk
                than they have people to inspect. NTI runs it across their
                transport book.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/login">
                  <Button variant="accent" size="lg" className="w-full sm:w-auto">
                    Start an audit
                    <ButtonIconWell>
                      <Arrow />
                    </ButtonIconWell>
                  </Button>
                </Link>
                <Link href="/queue">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-paper/25 bg-transparent text-paper hover:border-paper hover:bg-paper/10 sm:w-auto"
                  >
                    See the engineer queue
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
            Tiered risk-audit routing for heavy motor portfolios.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap gap-x-8 gap-y-3 text-sm"
        >
          <Link href="/login" className="text-ink-muted hover:text-ink">
            Operator portal
          </Link>
          <Link href="/queue" className="text-ink-muted hover:text-ink">
            Engineer queue
          </Link>
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
