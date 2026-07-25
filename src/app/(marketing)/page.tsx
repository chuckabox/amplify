import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { Wordmark } from "@/components/logo";
import { HeroLottie } from "@/components/hero-lottie";
import { TierSplit, type Lane } from "@/components/tier-split";
import { StepTabs, type Step } from "@/components/step-tabs";
import { Reveal } from "@/components/motion";
import { PhotoPlate } from "@/components/photo-plate";
import { SpeedLines } from "@/components/speed-lines";
import { asset } from "@/lib/asset";

const LANES: Lane[] = [
  {
    share: 0.68,
    tier: 1,
    name: "Cleared on evidence",
    detail: "Perfect submission. Approved instantly.",
  },
  {
    share: 0.22,
    tier: 2,
    name: "Verified remotely",
    detail: "Minor issues. Request a photo or video upload instead of a visit.",
  },
  {
    share: 0.10,
    tier: 3,
    name: "Seen in person",
    detail: "Genuine risk. Send an inspector.",
  },
];

const STEPS: Step[] = [
  {
    n: "01",
    title: "Upload documents",
    body: "Upload files to get information on the business.",
    seed: "/samples/IMG_2316.jpg",
    alt: "A driver uploading transport documents and assessment records",
  },
  {
    n: "02",
    title: "Tonnage reads evidence",
    body: "The system reviews answers, photos, and metadata against safety standards.",
    seed: "/samples/IMG_2322.jpg",
    alt: "Close inspection of a heavy-vehicle tyre during an assessment",
  },
  {
    n: "03",
    title: "Engineer reviews outcome",
    body: "Submissions route into cleared, remote, or in-person lanes. The engineer signs or overrides.",
    seed: "/samples/IMG_4871.webp",
    alt: "A risk engineer reviewing operator evidence and assessment findings",
  },
];

const TRUST_CHECKS = [
  {
    title: "Metadata checks",
    desc: "Verifies time and location data.",
  },
  {
    title: "Photo reuse",
    desc: "Flags duplicate or re-saved images.",
  },
  {
    title: "Consistency",
    desc: "Spots differences between answers and photos.",
  },
  {
    title: "Hard gates",
    desc: "Forces manual review for serious safety issues.",
  },
  {
    title: "Engineer sign-off",
    desc: "An engineer reviews every warning before a decision is made.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col relative">
      <SpeedLines />
      <main id="main" className="flex-1 relative z-10">
        {/* ---------- Hero ---------- */}
        <section className="mx-auto max-w-[1240px] px-6 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
            <div>
              <Reveal>
                <h1 className="text-[clamp(2.25rem,5.2vw,3.5rem)] leading-[1.05] font-display font-bold">
                  Most trucks roll straight through.
                  <span className="block text-ink-muted mt-2 font-display">
                    Only the exceptions get pulled aside.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <p className="mt-8 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                  Tonnage reviews every transport risk assessment, clears strong evidence, and escalates genuine risk to an engineer, without removing human judgement.
                </p>
              </Reveal>

              <Reveal delay={0.18}>
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

            <Reveal delay={0.24} className="flex items-center">
              <HeroLottie />
            </Reveal>
          </div>
        </section>

        {/* ---------- How It Works ---------- */}
        <section className="border-t border-rule bg-paper-raised">
          <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
            <Reveal>
              <div>
                <h2 className="text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05] font-display font-bold">
                  How it works
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-muted font-display">
                  From submission to engineer sign-off.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="mt-16">
              <StepTabs steps={STEPS} />
            </Reveal>
          </div>
        </section>

        {/* ---------- Statistics ---------- */}
        <section className="border-t border-rule bg-paper">
          <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
            <Reveal className="text-center">
              <div>
                <h2 className="text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05] font-display font-bold">
                  How routing works
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-muted max-w-[50ch] mx-auto">
                  We sort audits automatically so engineers only travel when there is real risk.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="mt-16">
              <TierSplit lanes={LANES} />
            </Reveal>
          </div>
        </section>

        {/* ---------- Research & Trust ---------- */}
        <section className="border-t border-rule bg-paper-sunk/35">
          <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-32">
            <Reveal className="text-center">
              <h2 className="text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05] font-display font-bold">
                Built for honest results
              </h2>
              <p className="mt-5 max-w-[65ch] text-[1.0625rem] leading-[1.7] text-ink-muted mx-auto">
                We check every detail to make sure self-reported evidence is genuine.
              </p>
            </Reveal>

            {/* Grid of Trust Checks: 3 on top row, 2 on bottom row layout */}
            <div className="mt-16 space-y-5">
              {/* Top Row: 3 items */}
              <div className="grid gap-5 md:grid-cols-3">
                {/* Metadata checks */}
                <Reveal className="plate bg-paper-sunk" delay={0.05}>
                  <div className="plate-core p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{TRUST_CHECKS[0].title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{TRUST_CHECKS[0].desc}</p>
                    </div>
                  </div>
                </Reveal>

                {/* Photo reuse */}
                <Reveal className="plate bg-paper-sunk" delay={0.1}>
                  <div className="plate-core p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{TRUST_CHECKS[1].title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{TRUST_CHECKS[1].desc}</p>
                    </div>
                    <div className="mt-4 flex flex-col gap-1.5 font-mono text-[9px] text-ink-faint border-t border-rule border-dashed pt-4">
                      <div className="flex justify-between items-center bg-paper px-2 py-0.5 rounded-[2px] border border-rule">
                        <span>IMG_2314.jpg</span>
                        <span className="text-accent-deep font-semibold">ORIGINAL</span>
                      </div>
                      <div className="flex justify-between items-center bg-accent/5 px-2 py-0.5 rounded-[2px] border border-accent/20">
                        <span>IMG_2314_crop.jpg</span>
                        <span className="text-tier-3-ink font-semibold">FLAGGED</span>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Consistency */}
                <Reveal className="plate bg-paper-sunk" delay={0.15}>
                  <div className="plate-core p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{TRUST_CHECKS[2].title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{TRUST_CHECKS[2].desc}</p>
                    </div>
                    <div className="mt-4 space-y-1 font-mono text-[9px] text-ink-faint border-t border-rule border-dashed pt-4">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-tier-1-ink" />
                        <span>Form: "Restraints certified"</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-tier-3-ink" />
                        <span>Photo: Expired 2025</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Bottom Row: 2 items */}
              <div className="grid gap-5 md:grid-cols-2 max-w-[820px] mx-auto">
                {/* Hard gates */}
                <Reveal className="plate bg-paper-sunk" delay={0.2}>
                  <div className="plate-core p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{TRUST_CHECKS[3].title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{TRUST_CHECKS[3].desc}</p>
                    </div>
                  </div>
                </Reveal>

                {/* Engineer sign-off */}
                <Reveal className="plate bg-paper-sunk" delay={0.25}>
                  <div className="plate-core p-6 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{TRUST_CHECKS[4].title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{TRUST_CHECKS[4].desc}</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* ---------- The Capacity Equation ---------- */}
            <div className="mt-28 border-t border-rule pt-20">
              <Reveal>
                <h2 className="text-[clamp(2rem,3.6vw,2.875rem)] leading-[1.05] font-display font-bold">
                  Stop sending engineers to tick boxes
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-ink-muted font-display">
                  There aren't enough risk engineers. Stop wasting the ones you have.
                </p>
              </Reveal>

              {/* 2-Column layout: animation on left, stacked cards on right */}
              <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] items-stretch mt-12">
                {/* Left: Supporting illustration image */}
                <Reveal className="flex items-center justify-center" delay={0.05}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset("/samples/group-communicating.svg")}
                    alt="Supporting visual representing engineering capacity allocation"
                    className="max-w-full h-auto object-contain"
                  />
                </Reveal>

                {/* Right: Stacked cards */}
                <div className="flex flex-col justify-between gap-6">
                  {/* Before */}
                  <Reveal className="rounded-[4px] border border-rule bg-paper-sunk/20 p-6 flex-1 flex flex-col justify-center" delay={0.1}>
                    <span className="field-label text-ink-muted">Today</span>
                    <h4 className="font-display text-2xl font-bold mt-2 text-ink">Every operator gets a site visit</h4>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      Engineers drive hours to confirm what a photo could prove.
                    </p>
                  </Reveal>

                  {/* After */}
                  <Reveal className="rounded-[4px] border-[2px] border-accent bg-paper-raised p-6 flex-1 flex flex-col justify-center shadow-plate" delay={0.15}>
                    <span className="field-label text-accent-deep">With Tonnage</span>
                    <h4 className="font-display text-2xl font-bold mt-2 text-ink">Only real risk gets a visit</h4>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      Evidence clears the straightforward cases remotely. Engineers only travel when something needs investigating.
                    </p>
                  </Reveal>
                </div>
              </div>

              <Reveal delay={0.2}>
                <div className="mt-12 text-center max-w-[80ch] mx-auto">
                  <p className="text-[1.0625rem] leading-[1.7] text-ink-muted font-medium">
                    Engineers spend time investigating real risk, not confirming compliance.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------- Closing / CTA ---------- */}
        <section className="border-t border-rule bg-paper">
          <div className="mx-auto max-w-[1240px] px-6 py-24 text-center md:py-32">
            <Reveal>
              <h2 className="text-[clamp(2rem,3.8vw,3rem)] leading-[1.05] font-display font-bold text-ink">
                Tonnage
              </h2>
              <p className="mt-4 text-lg text-ink-muted">
                Risk-routing for heavy-motor portfolios.
              </p>
              
              <div className="mt-8 flex justify-center">
                <Link href="/audit">
                  <Button variant="accent" size="lg" className="py-6 px-12">
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
    <footer className="border-t-[3px] border-double border-rule-strong bg-paper">
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
