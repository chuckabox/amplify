"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";
import { Logo, Wordmark } from "@/components/logo";
import { PhotoPlate } from "@/components/photo-plate";
import { useStore } from "@/lib/operator-store";
import { INITIAL_OPERATORS } from "@/lib/data/operators";

type Mode = "signin" | "register";
type Errors = Partial<Record<"company" | "email" | "password", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useStore();
  const [mode, setMode] = useState<Mode>("signin");
  const [values, setValues] = useState({
    company: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<string | null>(null);

  function set(field: keyof typeof values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setNotice(null);
  }

  function validate(): Errors {
    const next: Errors = {};
    if (mode === "register" && !values.company.trim()) {
      next.company = "Enter the name your policy is held under.";
    }
    if (!values.email.trim()) {
      next.email = "Enter the email address on your policy.";
    } else if (!EMAIL.test(values.email.trim())) {
      next.email = "That address is missing an @ or a domain.";
    }
    if (!values.password) {
      next.password = "Enter your password.";
    } else if (mode === "register" && values.password.length < 8) {
      next.password = "Use at least 8 characters.";
    }
    return next;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setNotice(
      "Credentials aren't wired up in this build. Pick a fleet below to open the portal.",
    );
  }

  function chooseDemo(id: string) {
    login(id);
    router.push("/dashboard");
  }

  return (
    <div className="grid min-h-[100dvh] lg:grid-cols-[1.05fr_1fr]">
      {/* ---------- Brand panel ---------- */}
      <aside className="relative hidden overflow-hidden bg-ink px-12 py-14 text-paper lg:flex lg:flex-col lg:justify-between">
        <PhotoPlate
          seed="wb-hero-road-train"
          alt=""
          width={1200}
          height={1600}
          bare
          className="pointer-events-none absolute inset-0"
          imageClassName="h-full w-full opacity-25"
        />
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171a14] via-[#171a14]/85 to-[#171a14]/60"
          aria-hidden
        />

        <Link href="/" className="relative w-fit">
          <Wordmark size="md" tone="paper" />
        </Link>

        <div className="relative max-w-md">
          <p className="field-label text-paper/45">For operators</p>
          <h1 className="mt-5 text-[2.5rem] leading-[1.05] text-paper">
            Your audit, done from the yard.
          </h1>
          <p className="mt-5 leading-[1.7] text-paper/70">
            Take out or renew an NTI policy and the audit comes to you. Four
            pillars, a few photographs, and a premium priced on what you
            actually showed us — usually with nobody needing to drive out.
          </p>

          <ul className="mt-9 space-y-4 border-t border-paper/15 pt-7">
            {[
              "Evidence captured on a phone, in the yard, in about ten minutes",
              "A premium figure and the arithmetic behind it, immediately",
              "Findings you can work through before the next one comes due",
            ].map((item) => (
              <li key={item} className="flex gap-3.5 text-sm text-paper/75">
                <span
                  className="mt-[7px] h-2 w-2 shrink-0 bg-accent"
                  aria-hidden
                />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative font-mono text-[11px] tracking-[0.1em] text-paper/40">
          QLD · NT · NSW — 1,888 SUBMISSIONS ROUTED
        </p>
      </aside>

      {/* ---------- Form panel ---------- */}
      <main id="main" className="flex flex-col justify-center px-6 py-14 sm:px-12">
        <div className="mx-auto w-full max-w-[26rem]">
          <Logo className="mb-10 lg:hidden" size="md" />

          <p className="field-label">
            {mode === "signin" ? "Operator portal" : "New operator"}
          </p>
          <h2 className="mt-4 text-[2rem] leading-tight">
            {mode === "signin" ? "Sign in" : "Register your fleet"}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
            {mode === "signin"
              ? "Use the email address your policy is held under."
              : "You'll need your policy number to hand."}
          </p>

          {/* Mode switch — a ruled tab pair, not a pill toggle */}
          <div
            role="tablist"
            aria-label="Sign in or register"
            className="mt-8 flex border-b border-rule-strong"
          >
            {(
              [
                ["signin", "Sign in"],
                ["register", "Register"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                role="tab"
                aria-selected={mode === value}
                onClick={() => {
                  setMode(value);
                  setErrors({});
                  setNotice(null);
                }}
                className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 ease-docket ${
                  mode === value
                    ? "border-ink text-ink"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form className="mt-7 space-y-5" onSubmit={submit} noValidate>
            {mode === "register" && (
              <div className="space-y-2">
                <Label htmlFor="company">Registered business name</Label>
                <Input
                  id="company"
                  value={values.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder="Halloran Haulage Pty Ltd"
                  aria-invalid={!!errors.company}
                  aria-describedby={errors.company ? "company-error" : undefined}
                />
                <FieldError id="company-error">{errors.company}</FieldError>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="ops@halloranhaulage.com.au"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              <FieldError id="email-error">{errors.email}</FieldError>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                value={values.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <FieldError id="password-error">{errors.password}</FieldError>
            </div>

            <Button type="submit" className="w-full">
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>

            {notice && (
              <p
                role="status"
                className="border-l-2 border-accent bg-accent-wash/40 px-3.5 py-2.5 text-[13px] leading-relaxed text-ink"
              >
                {notice}
              </p>
            )}
          </form>

          <div className="my-9 flex items-center gap-4">
            <span className="h-px flex-1 bg-rule" />
            <span className="field-label">Or open a demo fleet</span>
            <span className="h-px flex-1 bg-rule" />
          </div>

          <ul className="divide-y divide-rule border-y border-rule">
            {INITIAL_OPERATORS.map((op) => (
              <li key={op.id}>
                <button
                  onClick={() => chooseDemo(op.id)}
                  className="group flex w-full items-center gap-4 py-4 text-left transition-colors duration-200 ease-docket hover:bg-paper-sunk/60"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[2px] bg-ink font-mono text-xs font-medium text-paper">
                    {op.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{op.name}</span>
                    <span className="block truncate text-xs text-ink-muted">
                      {op.vehicles.length} vehicles · {op.region} ·{" "}
                      {op.policy.riskRating}
                    </span>
                  </span>
                  <span
                    className="font-mono text-sm text-ink-faint transition-transform duration-200 ease-docket group-hover:translate-x-1 group-hover:text-ink"
                    aria-hidden
                  >
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-xs leading-relaxed text-ink-muted">
            <Link href="/" className="underline underline-offset-4 hover:text-ink">
              Back to tonnage.au
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
