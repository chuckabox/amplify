import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import { WarehouseLottie } from "@/components/warehouse-lottie";
import { SiteFooter } from "@/app/(marketing)/page";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "TONNAGE is priced on the audits it clears without a site visit. One plan, built around your risk engineering team.",
};

type Plan = {
  name: string;
  tagline: string;
  price: string;
  unit: string;
  cta: string;
  featured?: boolean;
  features: string[];
  foot: string;
};

// Illustrative AUD figures. Replace with the validation-call numbers noted in
// docs/nti-riskgate-business-model.md before the pitch.
const PLANS: Plan[] = [
  {
    name: "Enterprise",
    tagline: "For the risk engineering team",
    price: "Custom",
    unit: "let us talk",
    cta: "Contact us",
    featured: true,
    features: [
      "Every submission routed by risk",
      "Engineer queue, escalations, and portfolio view",
      "An engineer signs off on every adverse result",
      "Trust checks on metadata, photo reuse, and gates",
      "Custom risk areas and standards packs",
      "Fleet wide risk data for underwriters",
      "Single sign on and data residency options",
      "No integration needed to start",
    ],
    foot: "Costs less than the site visits it removes.",
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main id="main" className="flex-1">
        {/* Hero */}
        <section className="border-b border-rule bg-transparent">
          <div className="mx-auto max-w-[1240px] px-6 pt-20 pb-24 md:pt-28 md:pb-32">
            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[1fr_0.55fr] lg:items-end">
                <div>
                  <h1 className="max-w-[15ch] text-[clamp(2.6rem,6vw,4.75rem)] font-display font-bold leading-[0.96] text-ink">
                    Pay for the visits you skip.
                  </h1>
                </div>
                <div className="lg:pb-1">
                  <p className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                    Most audits clear on the evidence alone. You pay for a
                    platform that costs less than the site visits it removes,
                    not for paperwork.
                  </p>
                  <Link
                    href="/audit"
                    className="mt-4 inline-flex text-sm font-semibold text-accent-deep underline decoration-rule-strong underline-offset-4 hover:decoration-accent-deep"
                  >
                    Run a guided audit instead
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Plans */}
        <section className="border-b border-rule bg-transparent">
          <div className="mx-auto max-w-[1240px] px-6 py-20 md:py-28">
            <div className="mx-auto grid max-w-[520px] gap-8">
              {PLANS.map((plan, i) => (
                <Reveal key={plan.name} delay={0.08 * (i + 1)}>
                  <div className="plate h-full">
                    <div className="plate-core flex h-full flex-col p-7">
                      <p className="field-label">
                        {plan.tagline}
                      </p>
                      <h2 className="mt-3 font-display text-2xl font-bold text-ink">
                        {plan.name}
                      </h2>

                      <div className="mt-6 flex items-baseline gap-2">
                        <span className={`font-display font-bold text-ink ${plan.price.startsWith("$") ? "text-3xl" : "text-xl"}`}>
                          {plan.price}
                        </span>
                        <span className="text-sm text-ink-muted">
                          {plan.unit}
                        </span>
                      </div>

                      <ul className="mt-6 space-y-3 text-sm text-ink-muted">
                        {plan.features.map((f) => (
                          <li key={f} className="flex gap-2.5">
                            <Check />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 flex flex-1 flex-col justify-end">
                        {/* Inert on purpose — no sales flow behind these yet. */}
                        <Button
                          variant={plan.featured ? "default" : "outline"}
                          className="w-full"
                        >
                          {plan.cta}
                        </Button>
                        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
                          {plan.foot}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

          </div>
        </section>

        {/* Thank you */}
        <section className="border-b border-rule bg-transparent">
          <div className="mx-auto max-w-[1240px] px-6 py-24 md:py-28">
            <Reveal>
              <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:items-center">
                <div>
                  <h2 className="text-[clamp(2rem,3.6vw,2.875rem)] font-display font-bold leading-[1.05] text-ink">
                    Thanks for watching.
                  </h2>
                  <div className="mt-8 space-y-5 text-[1.0625rem] leading-[1.7] text-ink-muted">
                    <p>
                      Thanks to the truck operators who stopped and talked to us,
                      and told us honestly what a site visit is actually like.
                      Everything here started with those conversations.
                    </p>
                    <p>
                      TONNAGE is here to make the risk engineer's job easier, not
                      to take it off them. The engineer still makes the call. We
                      just clear the routine work so they can spend their time on
                      the jobs that actually need them.
                    </p>
                    <p className="font-semibold text-ink">
                      And thanks for your time today.
                    </p>
                  </div>
                </div>
                <div className="mx-auto w-full max-w-[520px]">
                  <WarehouseLottie />
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="mt-0.5 size-4 shrink-0 text-accent-ink"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        d="M3 8.5l3.5 3.5L13 4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
