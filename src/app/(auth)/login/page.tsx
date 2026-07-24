"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStore } from "@/lib/operator-store";
import { INITIAL_OPERATORS } from "@/lib/data/operators";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [mode, setMode] = useState<"signin" | "register">("signin");

  function chooseDemo(id: string) {
    login(id);
    router.push("/dashboard");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
            <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.25} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            RiskGate
          </span>
        </Link>

        <div className="relative max-w-md">
          <h1 className="text-3xl font-semibold leading-tight">
            Your insurance safety check, done from your phone.
          </h1>
          <p className="mt-4 text-primary-foreground/80">
            When you take out or renew an NTI policy, RiskGate walks you through
            a quick safety check and sets your price from what you show us — no
            inspector visit needed for most fleets.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Snap a few photos across the four safety areas",
              "See your price straight away, with nothing hidden",
              "Keep track of what to fix, all year round",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/15">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-primary-foreground/70">
          Trusted by transport operators across QLD, NT & NSW.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </span>
            <span className="text-[17px] font-semibold tracking-tight">
              RiskGate
            </span>
          </Link>

          <h2 className="text-2xl font-semibold text-foreground">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to your operator portal."
              : "Register your fleet to get started."}
          </p>

          {/* Tabs */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-card p-1">
            <button
              onClick={() => setMode("signin")}
              className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode("register")}
              className={`rounded-md py-1.5 text-sm font-medium transition-colors ${
                mode === "register"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form (decorative — demo mode) */}
          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => e.preventDefault()}
          >
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="company">Company name</Label>
                <Input id="company" placeholder="Acme Transport Pty Ltd" />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com.au" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled>
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo mode — pick a fleet below to explore the portal.
            </p>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Continue as a demo fleet
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-2.5">
            {INITIAL_OPERATORS.map((op) => (
              <button
                key={op.id}
                onClick={() => chooseDemo(op.id)}
                className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-accent-foreground">
                  {op.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-foreground">
                    {op.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {op.vehicles.length} vehicles · {op.region}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
