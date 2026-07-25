"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import {
  PASSPORT_ENTITIES,
  PASSPORT_SUMMARY,
  RECENT_CHANGES,
  RISK_CONTROLS,
  SOURCE_DOCUMENTS,
  PASSPORT_STORAGE_KEY,
  type PassportEntity,
} from "@/lib/data/passport";
import { PILLAR_LABEL } from "@/lib/data/audit";
import { SiteFooter } from "@/app/(marketing)/page";

type View = "overview" | "entities" | "controls" | "documents";

const VIEWS: Array<{ id: View; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "entities", label: "People & assets" },
  { id: "controls", label: "Control evidence" },
  { id: "documents", label: "Source documents" },
];

export default function PassportClient() {
  const [view, setView] = useState<View>("overview");
  const [justUpdated, setJustUpdated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const hasSavedUpdate = window.localStorage.getItem(PASSPORT_STORAGE_KEY);
      setJustUpdated(
        params.get("updated") === "truck-28" && Boolean(hasSavedUpdate),
      );
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <main id="main" className="flex-1">
        {/* Update notification banner */}
        {justUpdated && (
          <section className="border-b border-rule bg-tier-1-wash">
            <div className="mx-auto max-w-[1240px] px-6">
              <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-sm font-bold text-tier-1-ink">✓</span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Truck 28 was updated from the maintenance PDF
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      Seven fields, one open defect and one control gap were added to
                      this passport.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="self-start rounded-[2px] px-2 py-1 font-mono text-[10px] text-ink-muted hover:bg-paper/50 hover:text-ink"
                  onClick={() => setJustUpdated(false)}
                >
                  DISMISS
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Hero header */}
        <section className="border-b border-rule bg-paper-raised">
          <div className="mx-auto max-w-[1240px] px-6 pt-20 pb-24 md:pt-24 md:pb-28">
            <Reveal>
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="field-label">Passport</p>
                    <span className="h-3 w-px bg-rule-strong" aria-hidden />
                    <span className="font-mono text-[10px] text-ink-faint">
                      UPDATED 25 JUL 2026 · 10:42
                    </span>
                  </div>
                  <h1 className="mt-3 text-[clamp(2.6rem,6vw,4.6rem)] font-display font-bold leading-[0.95] text-ink">
                    {PASSPORT_SUMMARY.business}
                  </h1>
                  <p className="mt-3 text-sm text-ink-muted">
                    {PASSPORT_SUMMARY.abn} · Heavy motor transport · Queensland
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="mr-2 text-xs text-ink-faint">
                    Last engineer review: {PASSPORT_SUMMARY.lastReviewed}
                  </p>
                  <Link href="/visual-evidence">
                    <Button variant="outline">Vision</Button>
                  </Link>
                  <Link href="/audit">
                    <Button variant="accent">
                      Upload records
                      <ButtonIconWell>
                        <Arrow />
                      </ButtonIconWell>
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Tab navigation */}
        <section className="border-b border-rule bg-paper">
          <div className="mx-auto max-w-[1240px] px-6">
            <nav
              aria-label="Passport sections"
              className="flex gap-1 overflow-x-auto"
            >
              {VIEWS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setView(item.id)}
                  className={`relative shrink-0 px-4 py-4 text-sm font-semibold transition-colors ${
                    view === item.id
                      ? "text-ink"
                      : "text-ink-faint hover:text-ink-muted"
                  }`}
                >
                  {item.label}
                  {view === item.id && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </section>

        {/* Content */}
        <div className="mx-auto w-full max-w-[1240px] px-6">
          {view === "overview" && <Overview setView={setView} />}
          {view === "entities" && <EntitiesView />}
          {view === "controls" && <ControlsView />}
          {view === "documents" && <DocumentsView />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Overview({ setView }: { setView: (view: View) => void }) {
  const criticalEntity = PASSPORT_ENTITIES[0];

  return (
    <>
      {/* Metrics bar */}
      <Reveal delay={0.06}>
        <section className="mt-10">
          <div className="plate">
            <div className="plate-core grid gap-px overflow-hidden bg-rule lg:grid-cols-[1.25fr_repeat(4,0.7fr)]">
              <div className="bg-ink px-6 py-6 text-paper lg:row-span-1">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-paper/60">
                  Portfolio risk
                </p>
                <div className="mt-4 flex items-end justify-between gap-6">
                  <div>
                    <span className="font-display text-6xl font-bold leading-none">
                      {PASSPORT_SUMMARY.riskScore.toFixed(1)}
                    </span>
                    <span className="ml-2 font-mono text-xs text-paper/50">/ 5</span>
                  </div>
                  <span className="mb-1 font-mono text-[10px] font-semibold text-accent">
                    ↓ {Math.abs(PASSPORT_SUMMARY.trend).toFixed(1)} SINCE REVIEW
                  </span>
                </div>
              </div>
              <Metric
                value={String(PASSPORT_SUMMARY.documents)}
                label="Source documents"
                detail="+4 this month"
              />
              <Metric
                value={PASSPORT_SUMMARY.linkedRecords.toLocaleString()}
                label="Structured records"
                detail="96% linked"
              />
              <Metric
                value={String(PASSPORT_SUMMARY.openRisks)}
                label="Open risks"
                detail="1 critical"
                tone="critical"
              />
              <Metric
                value={String(PASSPORT_SUMMARY.expiringSoon)}
                label="Expiring soon"
                detail="Next 45 days"
                tone="warning"
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* What changed + Critical review */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
        <Reveal delay={0.1}>
          <section aria-labelledby="changes-heading">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="field-label">Since the last review</p>
                <h2 id="changes-heading" className="mt-2 text-2xl font-semibold text-ink">
                  What changed
                </h2>
              </div>
              <span className="font-mono text-[10px] text-ink-faint">
                30 JUN → TODAY
              </span>
            </div>
            <div className="plate mt-5">
              <div className="plate-core overflow-hidden">
                {RECENT_CHANGES.map((change, index) => (
                  <article
                    key={change.title}
                    className={`grid grid-cols-[54px_1fr] gap-4 px-5 py-4 ${
                      index < RECENT_CHANGES.length - 1 ? "border-b border-rule" : ""
                    }`}
                  >
                    <time className="font-mono text-[10px] text-ink-faint">
                      {change.date}
                    </time>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`size-1.5 rounded-full ${
                            change.tone === "critical"
                              ? "bg-tier-3"
                              : change.tone === "warning"
                                ? "bg-tier-2"
                                : change.tone === "good"
                                  ? "bg-tier-1"
                                  : "bg-ink-faint"
                          }`}
                        />
                        <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-ink-faint">
                          {change.type}
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-sm font-semibold text-ink">
                        {change.title}
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        {change.detail}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.14}>
          <section aria-labelledby="critical-heading">
            <p className="field-label">Needs attention now</p>
            <h2 id="critical-heading" className="mt-2 text-2xl font-semibold text-ink">
              Critical review
            </h2>
            <div className="plate mt-5">
              <div className="plate-core overflow-hidden border border-tier-3-ink">
                <div className="bg-tier-3-wash px-5 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-tier-3-ink">
                        Open safety defect
                      </span>
                      <h3 className="mt-1 text-xl font-semibold text-ink">
                        {criticalEntity.label}
                      </h3>
                      <p className="mt-1 text-xs text-ink-muted">
                        {criticalEntity.meta}
                      </p>
                    </div>
                    <span className="flex size-9 items-center justify-center rounded-[2px] bg-tier-3-ink font-mono text-sm font-bold text-paper">
                      !
                    </span>
                  </div>
                </div>
                <dl className="divide-y divide-rule px-5">
                  {criticalEntity.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-center justify-between gap-4 py-3 text-sm"
                    >
                      <dt className="text-ink-muted">{fact.label}</dt>
                      <dd
                        className={`font-mono text-xs font-semibold ${
                          fact.tone === "critical"
                            ? "text-tier-3-ink"
                            : fact.tone === "warning"
                              ? "text-tier-2-ink"
                              : "text-ink"
                        }`}
                      >
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="border-t border-rule px-5 py-4">
                  <p className="text-xs leading-relaxed text-ink-muted">
                    Brake defect identified on 12 Jun 2026. No completed repair
                    record was found in 148 source documents.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>
      </div>

      {/* Evidence-to-control mapping */}
      <Reveal delay={0.16}>
        <section className="mt-12 border-t border-rule pt-10" aria-labelledby="coverage-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="field-label">Evidence-to-control mapping</p>
              <h2 id="coverage-heading" className="mt-2 text-2xl font-semibold text-ink">
                Are the controls actually happening?
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setView("controls")}
              className="self-start text-sm font-semibold text-accent-deep underline decoration-rule-strong underline-offset-4 hover:decoration-accent-deep sm:self-auto"
            >
              View all controls
            </button>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {RISK_CONTROLS.map((control) => (
              <ControlCard key={control.id} control={control} compact />
            ))}
          </div>
        </section>
      </Reveal>

      {/* Bottom spacer for footer rhythm */}
      <div className="pb-12" />
    </>
  );
}

function EntitiesView() {
  return (
    <section className="py-10" aria-labelledby="entities-heading">
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="field-label">Connected records</p>
            <h2 id="entities-heading" className="mt-2 text-3xl font-display font-bold text-ink">
              People, assets and partners
            </h2>
          </div>
          <p className="max-w-[46ch] text-sm leading-relaxed text-ink-muted">
            Every extracted fact resolves to a known entity, so evidence can be
            compared across documents and over time.
          </p>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {PASSPORT_ENTITIES.map((entity, index) => (
          <Reveal key={entity.id} delay={0.05 + index * 0.04}>
            <EntityCard entity={entity} />
          </Reveal>
        ))}
      </div>
      <div className="pb-12" />
    </section>
  );
}

function ControlsView() {
  return (
    <section className="py-10" aria-labelledby="controls-heading">
      <Reveal>
        <div className="grid gap-5 lg:grid-cols-[1fr_0.55fr] lg:items-end">
          <div>
            <p className="field-label">Evidence-to-control mapping</p>
            <h2 id="controls-heading" className="mt-2 text-3xl font-display font-bold text-ink">
              Policy, training, practice, close-out.
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-ink-muted">
            A document does not prove a control works. Tonnage looks for the
            rule, competency, operating evidence and corrective action.
          </p>
        </div>
      </Reveal>
      <div className="mt-8 space-y-6">
        {RISK_CONTROLS.map((control, index) => (
          <Reveal key={control.id} delay={0.06 + index * 0.04}>
            <ControlCard control={control} />
          </Reveal>
        ))}
      </div>
      <div className="pb-12" />
    </section>
  );
}

function DocumentsView() {
  return (
    <section className="py-10" aria-labelledby="documents-heading">
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="field-label">Evidence library</p>
            <h2 id="documents-heading" className="mt-2 text-3xl font-display font-bold text-ink">
              Source documents
            </h2>
          </div>
          <Link href="/audit">
            <Button variant="accent">Upload more records</Button>
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="plate mt-8">
          <div className="plate-core overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead className="border-b border-rule bg-paper-sunk/40">
                <tr className="field-label">
                  <th className="px-5 py-3.5 font-semibold">Document</th>
                  <th className="px-5 py-3.5 font-semibold">Type</th>
                  <th className="px-5 py-3.5 font-semibold">Linked to</th>
                  <th className="px-5 py-3.5 font-semibold">Added</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Records</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule">
                {SOURCE_DOCUMENTS.map((document) => (
                  <tr key={document.name} className="text-sm hover:bg-paper-sunk/25">
                    <td className="px-5 py-4 font-medium text-ink">
                      {document.name}
                    </td>
                    <td className="px-5 py-4 text-ink-muted">{document.type}</td>
                    <td className="px-5 py-4 text-ink-muted">{document.linkedTo}</td>
                    <td className="px-5 py-4 font-mono text-xs text-ink-faint">
                      {document.date}
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-xs text-ink">
                      {document.records}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-mono text-[10px] font-semibold uppercase ${
                          document.status === "Review"
                            ? "text-tier-3-ink"
                            : "text-tier-1-ink"
                        }`}
                      >
                        {document.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
      <div className="pb-12" />
    </section>
  );
}

function Metric({
  value,
  label,
  detail,
  tone = "default",
}: {
  value: string;
  label: string;
  detail: string;
  tone?: "default" | "warning" | "critical";
}) {
  return (
    <div className="bg-paper-raised px-5 py-5">
      <p
        className={`font-display text-3xl font-bold leading-none ${
          tone === "critical"
            ? "text-tier-3-ink"
            : tone === "warning"
              ? "text-tier-2-ink"
              : "text-ink"
        }`}
      >
        {value}
      </p>
      <p className="mt-3 text-xs font-semibold text-ink">{label}</p>
      <p className="mt-1 font-mono text-[9px] text-ink-faint">{detail}</p>
    </div>
  );
}

function EntityCard({ entity }: { entity: PassportEntity }) {
  return (
    <article className="plate">
      <div className="plate-core overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b border-rule bg-paper-sunk/35 px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-ink-faint">
                {entity.type}
              </span>
              {entity.changed && (
                <span className="rounded-[2px] bg-accent px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase text-ink">
                  Updated
                </span>
              )}
            </div>
            <h3 className="mt-1 text-xl font-semibold text-ink">{entity.label}</h3>
            <p className="mt-1 text-xs text-ink-muted">{entity.meta}</p>
          </div>
          <span
            className={`font-mono text-[9px] font-semibold uppercase tracking-wider ${
              entity.status === "critical"
                ? "text-tier-3-ink"
                : entity.status === "watch"
                  ? "text-tier-2-ink"
                  : "text-tier-1-ink"
            }`}
          >
            {entity.statusLabel}
          </span>
        </div>
        <dl className="grid sm:grid-cols-2">
          {entity.facts.map((fact) => (
            <div
              key={fact.label}
              className="border-b border-rule px-5 py-3.5 sm:[&:nth-child(odd)]:border-r"
            >
              <dt className="field-label">{fact.label}</dt>
              <dd
                className={`mt-1.5 text-sm font-semibold ${
                  fact.tone === "critical"
                    ? "text-tier-3-ink"
                    : fact.tone === "warning"
                      ? "text-tier-2-ink"
                      : "text-ink"
                }`}
              >
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}

function ControlCard({
  control,
  compact = false,
}: {
  control: (typeof RISK_CONTROLS)[number];
  compact?: boolean;
}) {
  const statusLabel =
    control.status === "effective"
      ? "Effective"
      : control.status === "partial"
        ? "Partial"
        : "Weak";

  return (
    <article className="plate">
      <div className="plate-core overflow-hidden">
        <div className="px-5 py-5">
          <div className="flex items-center justify-between gap-4">
            <span className="field-label">{PILLAR_LABEL[control.pillar]}</span>
            <span
              className={`font-mono text-[9px] font-semibold uppercase ${
                control.status === "effective"
                  ? "text-tier-1-ink"
                  : control.status === "partial"
                    ? "text-tier-2-ink"
                    : "text-tier-3-ink"
              }`}
            >
              {statusLabel}
            </span>
          </div>
          <h3 className="mt-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-ink">
            {control.label}
          </h3>
          <div className="mt-5 flex items-end gap-4">
            <span className="font-display text-4xl font-bold leading-none text-ink">
              {control.coverage}%
            </span>
            <div className="mb-1 h-1.5 flex-1 overflow-hidden rounded-[1px] bg-paper-sunk">
              <div
                className={`h-full ${
                  control.status === "effective"
                    ? "bg-tier-1"
                    : control.status === "partial"
                      ? "bg-tier-2"
                      : "bg-tier-3"
                }`}
                style={{ width: `${control.coverage}%` }}
              />
            </div>
          </div>
        </div>
        <div className="divide-y divide-rule border-t border-rule">
          {control.evidence
            .slice(0, compact ? 3 : control.evidence.length)
            .map((evidence) => (
              <div
                key={evidence.label}
                className="flex items-center justify-between gap-3 px-5 py-3 text-xs"
              >
                <span className="flex items-center gap-2 text-ink-muted">
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      evidence.state === "proved"
                        ? "text-tier-1-ink"
                        : evidence.state === "partial"
                          ? "text-tier-2-ink"
                          : "text-tier-3-ink"
                    }`}
                  >
                    {evidence.state === "proved"
                      ? "✓"
                      : evidence.state === "partial"
                        ? "△"
                        : "×"}
                  </span>
                  {evidence.label}
                </span>
                <span className="shrink-0 font-mono text-[9px] font-semibold text-ink">
                  {evidence.value}
                </span>
              </div>
            ))}
        </div>
      </div>
    </article>
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
