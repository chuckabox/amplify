import Link from "next/link";
import {
  ArrowRight,
  ScanLine,
  Cpu,
  Gauge,
  Check,
  MoveRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const features = [
  {
    icon: ScanLine,
    title: "Guided capture",
    body: "Operators submit structured evidence — photos, video and short forms — mapped to the four NTI pillars, straight from a phone.",
  },
  {
    icon: Cpu,
    title: "AI triage engine",
    body: "Vision analysis and standards-benchmarked scoring route every submission to the right tier in seconds, with a readable reason.",
  },
  {
    icon: Gauge,
    title: "Engineer amplification",
    body: "Engineers review only escalations and sign off outcomes, concentrating scarce expertise where it actually moves risk.",
  },
];

const tiers = [
  {
    pct: "70%",
    name: "Tier 1 — Auto-clear",
    desc: "Clean submissions clear to a fast spot-check.",
    dot: "bg-emerald-500",
  },
  {
    pct: "20%",
    name: "Tier 2 — Remote video",
    desc: "Flagged items verified over a short requested clip.",
    dot: "bg-amber-500",
  },
  {
    pct: "10%",
    name: "Tier 3 — In-person",
    desc: "Only genuine risk reaches a site visit.",
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
          Built for NTI risk engineering
        </div>

        <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.05] text-foreground sm:text-6xl">
          Send a human only where a human is needed.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          RiskGate triages every audit and routes it to the cheapest tier that
          can safely clear it — so three engineers can cover the workload of
          thirty, without losing human sign-off.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/login" className="w-full sm:w-auto">
            <Button size="lg" className="w-full gap-2 sm:w-auto">
              I&apos;m an operator
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/queue" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
            >
              I&apos;m an NTI engineer
            </Button>
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {["AI vision analysis", "Trust & anti-gaming controls", "Human sign-off enforced"].map(
            (item) => (
              <span key={item} className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                {item}
              </span>
            ),
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-8">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/15"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <f.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <h3 className="mt-5 text-base font-semibold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The funnel / scaling math */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <div className="grid items-center gap-10 p-10 md:grid-cols-[auto_1fr] md:p-12">
            {/* Left: the multiplier */}
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
                  Operators covered
                </div>
              </div>
            </div>

            {/* Right: the split */}
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

      {/* Footer */}
      <footer className="mt-auto border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Everyone else automates the report. We change who runs the audit.
          </p>
        </div>
      </footer>
    </div>
  );
}
