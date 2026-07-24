import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Search,
  UserCheck,
  Check,
  MoveRight,
  Truck,
  ShieldCheck,
  Wrench,
  Star,
  Clock,
  MapPin,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const steps = [
  {
    icon: Camera,
    title: "1 · Take photos & answer a few questions",
    body: "The operator opens the app on their phone and follows a short checklist — a few photos of tyres, brakes, load straps and fire gear, plus quick questions. About 15 minutes.",
  },
  {
    icon: Search,
    title: "2 · The system checks it in seconds",
    body: "RiskGate looks at the photos, compares the answers to NTI's safety rules, and gives the fleet a risk score — then decides what happens next.",
  },
  {
    icon: UserCheck,
    title: "3 · A human only steps in when needed",
    body: "Safe results clear on their own. Unclear ones ask for a quick video. Only the genuinely risky ones get a visit from an NTI engineer.",
  },
];

const useCases = [
  {
    icon: Truck,
    who: "For transport operators",
    body: "Do your insurance safety check from the yard instead of booking a visit. See your price, your results, and what to fix — all in one place.",
    points: ["No waiting for an inspector", "Instant price result", "Clear list of what to improve"],
  },
  {
    icon: ShieldCheck,
    who: "For NTI risk engineers",
    body: "Stop driving to every depot. See every fleet's result in one queue and spend your time only on the ones that actually need a person.",
    points: ["One queue, every fleet", "Only real risks reach you", "Sign off with one click"],
  },
  {
    icon: Wrench,
    who: "For approved workshops",
    body: "Run the check on an operator's behalf and vouch for it. A workshop-backed check is trusted more and clears faster.",
    points: ["New revenue line", "Builds operator trust", "Faster approvals"],
  },
];

const testimonials = [
  {
    quote:
      "We used to block out half a day for an inspection visit. Now I do the whole safety check from the yard in my lunch break and see the price straight away.",
    name: "Dave R.",
    role: "Fleet manager, 40-truck operator",
  },
  {
    quote:
      "I cover a whole state on my own. RiskGate means I only drive out for the fleets that genuinely need me — the rest I clear from my desk.",
    name: "Priya S.",
    role: "NTI risk engineer",
  },
  {
    quote:
      "Being an approved workshop sends us new business every week, and our customers get a better price for it. Win–win.",
    name: "Marco T.",
    role: "Owner, heavy-vehicle workshop",
  },
];

const tiers = [
  {
    pct: "70%",
    name: "Cleared automatically",
    desc: "Safe fleets pass on their own, with a quick spot-check.",
    dot: "bg-emerald-500",
  },
  {
    pct: "20%",
    name: "Quick video check",
    desc: "A short clip settles anything that looks unclear.",
    dot: "bg-amber-500",
  },
  {
    pct: "10%",
    name: "In-person visit",
    desc: "Only the genuinely risky fleets get a site visit.",
    dot: "bg-rose-500",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <div className="flex items-center gap-1.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Sign in
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-20 text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Safety audits for truck & transport insurance
        </div>

        <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl">
          Send an inspector only where one is really needed.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          NTI has three safety engineers for the whole country — they can&apos;t
          visit every fleet. RiskGate lets operators do the routine safety check
          themselves from a phone, and only sends an engineer to the fleets that
          truly need one.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              I&apos;m an operator
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/queue" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              I&apos;m an NTI engineer
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {["Done from a phone", "Instant result", "A person signs off every decision"].map(
            (item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-foreground">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps replace a full-day inspection visit.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <s.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-foreground">
            Who it&apos;s for
          </h2>
          <p className="mt-3 text-muted-foreground">
            One tool, three groups — each getting time or money back.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {useCases.map((u) => (
            <div
              key={u.who}
              className="flex flex-col rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <u.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {u.who}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {u.body}
              </p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4">
                {u.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Scaling band */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-20">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="grid items-center gap-10 p-10 md:grid-cols-[auto_1fr] md:p-12">
            <div className="flex items-center gap-5">
              <div className="text-center">
                <div className="text-5xl font-semibold text-foreground">3</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Engineers
                </div>
              </div>
              <MoveRight className="h-6 w-6 shrink-0 text-muted-foreground/60" />
              <div className="text-center">
                <div className="text-5xl font-semibold text-primary">30</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Fleets covered
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {tiers.map((t) => (
                <div
                  key={t.name}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${t.dot}`} />
                    <span className="text-2xl font-semibold text-foreground">
                      {t.pct}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium text-foreground">
                    {t.name}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-card/50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold text-foreground">
              What people say
            </h2>
            <p className="mt-3 text-muted-foreground">
              Feedback from the people who&apos;d use it every day.
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-2xl border border-border bg-card p-6"
              >
                <div className="flex gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 border-t border-border pt-4">
                  <div className="text-sm font-medium text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* Quick stats */}
          <div className="mt-12 grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-8 text-center">
            <div>
              <Clock className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-2 text-2xl font-semibold text-foreground">
                15 min
              </div>
              <div className="text-xs text-muted-foreground">
                to finish a check
              </div>
            </div>
            <div>
              <MapPin className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-2 text-2xl font-semibold text-foreground">
                90%
              </div>
              <div className="text-xs text-muted-foreground">
                fewer site visits
              </div>
            </div>
            <div>
              <Wallet className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-2 text-2xl font-semibold text-foreground">
                Lower
              </div>
              <div className="text-xs text-muted-foreground">
                price for safe fleets
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold text-foreground">
          Try it in two minutes
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Pick a demo fleet and walk through the whole thing — no sign-up needed.
        </p>
        <Link href="/login" className="mt-6 inline-block">
          <Button size="lg" className="gap-2">
            Open the demo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Everyone else speeds up the paperwork. We change who does the check.
          </p>
        </div>
      </footer>
    </div>
  );
}
