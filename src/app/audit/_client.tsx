"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, ButtonIconWell } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import {
  DOCUMENT_TYPES,
  PAST_AUDITS,
  SAMPLE_EXTRACTION,
  PASSPORT_STORAGE_KEY,
  type DocumentKind,
  type ExtractedRecord,
} from "@/lib/data/passport";
import { SiteFooter } from "@/app/(marketing)/page";

interface QueuedDocument {
  name: string;
  size: string;
  kind: DocumentKind;
}

const EXTRACTION_STAGES = [
  "Reading document layout and text",
  "Identifying vehicles, drivers and dates",
  "Extracting defects, actions and expiries",
  "Linking records to known entities",
  "Mapping evidence to risk controls",
] as const;

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function inferKind(name: string): DocumentKind {
  const value = name.toLowerCase();
  if (value.includes("licen") || value.includes("medical") || value.includes("driver")) return "driver";
  if (value.includes("incident") || value.includes("near-miss")) return "incident";
  if (value.includes("fatigue") || value.includes("diary")) return "fatigue";
  if (value.includes("rego") || value.includes("registration")) return "registration";
  if (value.includes("subcontract")) return "subcontractor";
  if (value.includes("training") || value.includes("induction")) return "training";
  if (value.includes("emergency")) return "emergency";
  if (value.includes("contract") || value.includes("insurance")) return "contract";
  return "maintenance";
}

export default function AuditClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<"upload" | "extracting" | "review">("upload");
  const [record, setRecord] = useState<ExtractedRecord>(SAMPLE_EXTRACTION);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [phase]);

  // Deep link from the passport: /audit?past=<record id> opens that past audit.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("past");
    const past = PAST_AUDITS.find((item) => item.id === id);
    if (past) {
      setRecord(past);
      setPhase("review");
    }
  }, []);
  const [documents, setDocuments] = useState<QueuedDocument[]>([]);
  const [stageIndex, setStageIndex] = useState(0);
  const [selectedKind, setSelectedKind] = useState<DocumentKind>("maintenance");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const next = Array.from(files).map((file) => ({
      name: file.name,
      size: formatBytes(file.size),
      kind: inferKind(file.name),
    }));
    setDocuments((current) => [...current, ...next]);
  }

  function removeDocument(index: number) {
    setDocuments((current) => current.filter((_, idx) => idx !== index));
  }

  function processDocuments() {
    setRecord(SAMPLE_EXTRACTION);
    setStageIndex(0);
    setPhase("extracting");
    const interval = window.setInterval(() => {
      setStageIndex((current) => {
        if (current >= EXTRACTION_STAGES.length - 1) {
          window.clearInterval(interval);
          setTimeout(() => setPhase("review"), 600);
          return current + 1;
        }
        return current + 1;
      });
    }, 900);
  }

  function addToPassport() {
    window.localStorage.setItem(PASSPORT_STORAGE_KEY, "true");
    window.localStorage.setItem(
      "tonnage-record-latest",
      JSON.stringify({
        recordId: record.id,
        entityId: record.entityId,
        updatedAt: new Date().toISOString(),
      }),
    );
    // Only the fresh maintenance extraction triggers the "just updated" banner.
    router.push(
      record.id === SAMPLE_EXTRACTION.id
        ? "/passport?updated=truck-28"
        : "/passport",
    );
  }

  if (phase === "upload") {
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
                      Upload the records you already keep.
                    </h1>
                  </div>
                  <div className="lg:pb-1">
                    <p className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                      TONNAGE extracts the important facts, connects them to the right
                      vehicle, driver, subcontractor or depot, and updates one living
                      risk profile.
                    </p>
                    <Link
                      href="/visual-evidence"
                      className="mt-4 inline-flex text-sm font-semibold text-accent-deep underline decoration-rule-strong underline-offset-4 hover:decoration-accent-deep"
                    >
                      Analyse photo and video evidence instead
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* Upload area */}
          <section className="border-b border-rule bg-transparent">
            <div className="mx-auto max-w-[1240px] px-6 py-20 md:py-28">
              <Reveal delay={0.08}>
                <section aria-labelledby="upload-records-title">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div>
                      <h2 id="upload-records-title" className="text-2xl font-display font-bold text-ink">
                        Drop a document batch
                      </h2>
                    </div>
                    <span className="text-xs text-ink-faint">
                      Accepts pdf, xlsx, docx, jpg, zip
                    </span>
                  </div>

                  {/* Dropzone — plate/plate-core nested */}
                  <div className="plate mt-5">
                    <div
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={(event) => {
                        event.preventDefault();
                        setDragging(false);
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        setDragging(false);
                        addFiles(event.dataTransfer.files);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`plate-core flex min-h-[360px] cursor-pointer flex-col items-center justify-center gap-6 border-2 border-dashed p-10 text-center transition-all ${
                        dragging
                          ? "border-accent-deep bg-accent-wash/50"
                          : "border-rule-strong bg-paper-raised hover:border-accent-deep"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.zip,image/*"
                        className="hidden"
                        onChange={(event) => addFiles(event.target.files)}
                      />
                      <DocumentStackIcon />
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-ink">
                          Drop records here
                        </p>
                        <p className="text-sm text-ink-muted">
                          or click to browse from your computer
                        </p>
                      </div>
                      <p className="max-w-[46ch] text-xs leading-relaxed text-ink-faint">
                        Mix document types in one batch. Source files stay attached
                        to every extracted record.
                      </p>
                    </div>
                  </div>

                  {documents.length > 0 && (
                    <div className="plate mt-5">
                      <div className="plate-core overflow-hidden">
                        <div className="flex items-center justify-between border-b border-rule bg-paper-sunk/40 px-4 py-3">
                          <span className="field-label">Ready to process</span>
                          <span className="text-[10px] text-ink-muted">
                            {documents.length} FILE{documents.length === 1 ? "" : "S"}
                          </span>
                        </div>
                        <div className="divide-y divide-rule">
                          {documents.map((document, index) => {
                            const type = DOCUMENT_TYPES.find(
                              (item) => item.kind === document.kind,
                            );
                            return (
                              <div
                                key={`${document.name}-${index}`}
                                className="flex items-center gap-3 px-4 py-3"
                              >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-[2px] bg-paper-sunk text-[9px] font-semibold text-accent-deep">
                                  {document.name.split(".").pop()?.toUpperCase()}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-medium text-ink">
                                    {document.name}
                                  </p>
                                  <p className="mt-0.5 text-xs text-ink-faint">
                                    {type?.shortLabel} / {document.size}
                                  </p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(index)}
                                  className="rounded-[2px] px-2 py-1 text-xs text-ink-faint transition-colors hover:bg-paper-sunk hover:text-ink"
                                  aria-label={`Remove ${document.name}`}
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex justify-end border-t border-rule pt-6">
                    <Button
                      variant="default"
                      disabled={documents.length === 0}
                      onClick={processDocuments}
                    >
                      Extract records
                      <ButtonIconWell>
                        <Arrow />
                      </ButtonIconWell>
                    </Button>
                  </div>
                </section>
              </Reveal>
            </div>
          </section>

          {/* Past audits */}
          <section className="border-b border-rule bg-transparent">
            <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-20">
              <Reveal delay={0.1}>
                <section aria-labelledby="past-audits-title">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <h2 id="past-audits-title" className="text-2xl font-display font-bold text-ink">
                      Past audits
                    </h2>
                    <span className="text-xs text-ink-faint">
                      Open a previous extraction without uploading again
                    </span>
                  </div>
                  <div className="plate mt-5">
                    <div className="plate-core divide-y divide-rule overflow-hidden">
                      {PAST_AUDITS.map((past) => (
                        <button
                          key={past.id}
                          type="button"
                          onClick={() => {
                            setRecord(past);
                            setPhase("review");
                          }}
                          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-paper-sunk/45"
                        >
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-[2px] bg-paper-sunk text-[9px] font-semibold text-accent-deep">
                            {past.source.format}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-ink">
                              {past.historyLabel}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-ink-faint">
                              {past.sourceName} / {past.entityLabel}
                            </span>
                          </span>
                          <span className="hidden shrink-0 text-xs text-ink-faint sm:block">
                            {past.extractedAt}
                          </span>
                          <span
                            className={`shrink-0 text-[9px] font-semibold uppercase tracking-wider ${
                              past.alert.severity === "critical"
                                ? "text-tier-3-ink"
                                : "text-tier-2-ink"
                            }`}
                          >
                            {past.alert.severity === "critical" ? "Critical" : "Watch"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </Reveal>
            </div>
          </section>

          {/* Understood record types listing */}
          <section className="border-b border-rule bg-transparent">
            <div className="mx-auto max-w-[1240px] px-6 py-16 md:py-20">
              <Reveal delay={0.14}>
                <div className="grid gap-10 lg:grid-cols-[0.4fr_1fr] lg:items-start">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      Supported types
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      Our document parsing model extracts data points from these standard formats:
                    </p>
                  </div>
                  <div className="plate">
                    <div className="plate-core overflow-hidden max-h-[480px] divide-y divide-rule overflow-y-auto">
                      {DOCUMENT_TYPES.map((type, index) => (
                        <button
                          key={type.kind}
                          type="button"
                          onClick={() => setSelectedKind(type.kind)}
                          className={`flex w-full items-start gap-3 px-5 py-3.5 text-left transition-colors ${
                            selectedKind === type.kind
                              ? "bg-accent-wash/45"
                              : "hover:bg-paper-sunk/45"
                          }`}
                        >
                          <span
                            className={`mt-0.5 text-[10px] ${
                              selectedKind === type.kind
                                ? "text-accent-deep"
                                : "text-ink-faint"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-ink">
                              {type.label}
                            </span>
                            <span className="mt-0.5 block text-xs text-ink-faint">
                              {type.accepts}
                            </span>
                          </span>
                        </button>
                      ))}
                    </div>
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

  if (phase === "extracting") {
    const total = EXTRACTION_STAGES.length;
    const progress = Math.min(stageIndex + 1, total);
    return (
      <div className="flex min-h-screen flex-col">
        <main id="main" className="flex-1">
          <section className="border-b border-rule bg-transparent">
            <div className="mx-auto flex w-full max-w-[540px] flex-col justify-center px-6 py-28 md:py-36">
              <Reveal>
                <div>
                  <p className="field-label text-center">DOCUMENT ENGINE</p>
                  <h1 className="mt-4 text-center text-[clamp(1.75rem,4vw,2.25rem)] font-display font-bold leading-tight text-ink">
                    Building structured records
                  </h1>
                  <p className="mt-3 text-center text-sm text-ink-muted">
                    Reading {documents.length} source file
                    {documents.length === 1 ? "" : "s"} and connecting the facts to
                    the existing Passport.
                  </p>
                </div>

                <div className="plate mt-12">
                  <div className="plate-core p-6">
                    <ProgressBar current={progress} total={total} />

                    <div className="mt-8 space-y-4">
                      {EXTRACTION_STAGES.map((label, idx) => {
                        const pending = idx > progress - 1;
                        const active = idx === progress - 1;
                        return (
                          <div
                            key={label}
                            className={`flex items-center justify-between text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                              active
                                ? "text-ink font-bold"
                                : pending
                                  ? "text-ink-faint opacity-40"
                                  : "text-ink-muted"
                            }`}
                          >
                            <span>{label}</span>
                            <span>
                              {pending ? "PENDING" : active ? "RUNNING" : "DONE"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
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

  const extraction = record;
  const isPast = extraction.id !== SAMPLE_EXTRACTION.id;

  return (
    <div className="flex min-h-screen flex-col">
      <main id="main" className="flex-1">
        {/* Extraction Complete Hero */}
        <section className="border-b border-rule bg-transparent">
          <div className="mx-auto max-w-[1240px] px-6 pt-20 pb-24 md:pt-24 md:pb-28">
            <Reveal>
              <div className="flex flex-col gap-6 border-b border-rule pb-8 md:flex-row md:items-end md:justify-between">
                <div>
                  {isPast && (
                    <p className="field-label">
                      {`Past audit / ${extraction.historyLabel} / ${extraction.extractedAt}`}
                    </p>
                  )}
                  <h1 className={`text-[clamp(2.3rem,5vw,4rem)] font-display font-bold leading-none text-ink ${isPast ? "mt-3" : ""}`}>
                    One document. {extraction.fields.length} useful facts.
                  </h1>
                  <p className="mt-4 max-w-[62ch] text-[1.0625rem] leading-[1.7] text-ink-muted">
                    The source remains attached. The extracted values become
                    searchable records linked to {extraction.entityLabel}.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Content detail layout */}
        <section className="border-b border-rule bg-transparent">
          <div className="mx-auto max-w-[1240px] px-6 py-20 md:py-24">
            <div className="space-y-8">
              {/* Row 1: Critical review required */}
              <Reveal delay={0.08}>
                <div
                  className={`plate border ${
                    extraction.alert.severity === "critical"
                      ? "border-tier-3-ink bg-tier-3-wash"
                      : "border-tier-2-ink bg-tier-2-wash"
                  }`}
                >
                  <div className="plate-core p-5">
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex size-8 shrink-0 items-center justify-center rounded-[2px] text-sm font-bold text-paper ${
                          extraction.alert.severity === "critical"
                            ? "bg-tier-3-ink"
                            : "bg-tier-2-ink"
                        }`}
                      >
                        !
                      </span>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            extraction.alert.severity === "critical"
                              ? "text-tier-3-ink"
                              : "text-tier-2-ink"
                          }`}
                        >
                          {extraction.alert.label}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-muted">
                          {extraction.alert.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Row 2: Structured record */}
              <Reveal delay={0.12}>
                <div className="plate">
                  <div className="plate-core overflow-hidden">
                    <div className="flex flex-col gap-3 border-b border-rule bg-paper-sunk/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="field-label">Structured record</p>
                        <h2 id="structured-record-title" className="mt-1 text-xl font-semibold text-ink">
                          {extraction.entityLabel}
                        </h2>
                      </div>
                      <span className="self-start text-[10px] text-ink-faint">
                        LINKED TO {extraction.entityType.toUpperCase()} RECORD
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-2">
                      {extraction.fields.map((field) => (
                        <div
                          key={field.label}
                          className="border-b border-rule px-5 py-4 sm:[&:nth-child(odd)]:border-r"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="field-label">{field.label}</span>
                            <span className="text-[9px] text-ink-faint">
                              {Math.round(field.confidence * 100)}%
                            </span>
                          </div>
                          <p
                            className={`mt-2 text-base font-semibold ${
                              field.tone === "critical"
                                ? "text-tier-3-ink"
                                : field.tone === "warning"
                                  ? "text-tier-2-ink"
                                  : "text-ink"
                            }`}
                          >
                            {field.value}
                          </p>
                        </div>
                      ))}
                      <div className="border-b border-rule px-5 py-4">
                        <span className="field-label">Entity match</span>
                        <p className="mt-2 text-base font-semibold text-ink">
                          99% (Existing vehicle)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Row 3: Evidence-to-control mapping */}
              <Reveal delay={0.16}>
                <div className="plate">
                  <div className="plate-core overflow-hidden">
                    <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5">
                      <p className="field-label">Evidence-to-control mapping</p>
                    </div>
                    <div className="px-5 py-5">
                      <p className="text-sm font-semibold text-ink">
                        {extraction.control.label}
                      </p>
                      <div className="mt-4 space-y-3">
                        {extraction.control.rows.map((row) => (
                          <MappingRow key={row.label} {...row} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Row 4: Source evidence */}
              <Reveal delay={0.2}>
                <div className="plate">
                  <div className="plate-core overflow-hidden">
                    <div className="border-b border-rule bg-paper-sunk/40 px-5 py-3.5">
                      <p className="field-label">Source evidence</p>
                    </div>
                    <div className="p-5">
                      <div className="flex flex-col border border-rule-strong bg-[#fbfcfd] p-6 shadow-plate">
                        <div className="flex items-start justify-between border-b-2 border-ink pb-4">
                          <div>
                            <p className="font-display text-xl font-bold text-ink">
                              {extraction.source.title}
                            </p>
                            <p className="mt-1 text-[9px] text-ink-faint">
                              {extraction.source.ref}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-ink">
                            {extraction.source.format}
                          </span>
                        </div>
                        <dl className="mt-6 space-y-4 text-[10px] leading-relaxed">
                          {extraction.fields.map((field) => (
                            <SourceRow
                              key={field.label}
                              label={field.label}
                              value={field.value}
                              marked={field.tone === "critical" || field.tone === "warning"}
                            />
                          ))}
                        </dl>
                        <div className="mt-6 border-t border-rule pt-3 text-[8px] leading-relaxed text-ink-faint">
                          {extraction.source.signedBy}
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="break-all text-xs font-medium text-ink">
                          {extraction.sourceName}
                        </p>
                        <p className="mt-1 text-xs text-ink-faint">
                          {extraction.source.typeLabel} /{" "}
                          {isPast ? extraction.extractedAt : "uploaded today"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Bottom save bar */}
            <Reveal delay={0.16} className="mt-8 flex flex-col gap-4 border-t border-rule pt-6">
              <p className="text-xs leading-relaxed text-ink-muted">
                Saving updates {extraction.entityLabel}, attaches the source file and
                records this as a change since the last engineer review.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDocuments([]);
                    setRecord(SAMPLE_EXTRACTION);
                    setPhase("upload");
                    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
                  }}
                >
                  Analyse another batch
                </Button>
                <Button variant="default" onClick={addToPassport}>
                  Go to Passport
                  <ButtonIconWell>
                    <Arrow />
                  </ButtonIconWell>
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function SourceRow({
  label,
  value,
  marked = false,
}: {
  label: string;
  value: string;
  marked?: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-dotted border-rule pb-2">
      <dt className="text-ink-faint">{label}</dt>
      <dd className={marked ? "bg-accent-wash px-1 font-bold text-ink" : "font-semibold text-ink"}>
        {value}
      </dd>
    </div>
  );
}

function MappingRow({
  label,
  value,
  state,
}: {
  label: string;
  value: string;
  state: "good" | "bad";
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="flex items-center gap-2 text-ink-muted">
        <span
          className={`flex size-4 items-center justify-center rounded-[1px] text-[9px] font-bold ${
            state === "good"
              ? "bg-tier-1-wash text-tier-1-ink"
              : "bg-tier-3-wash text-tier-3-ink"
          }`}
        >
          {state === "good" ? "✓" : "×"}
        </span>
        {label}
      </span>
      <span className="text-[10px] font-semibold text-ink">
        {value}
      </span>
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

function DocumentStackIcon() {
  return (
    <span className="relative block h-14 w-12" aria-hidden>
      <span className="absolute left-0 top-2 h-11 w-9 -rotate-6 rounded-[2px] border border-rule-strong bg-paper-sunk" />
      <span className="absolute right-0 top-1 h-11 w-9 rotate-3 rounded-[2px] border border-rule-strong bg-paper" />
      <span className="absolute left-1.5 top-0 flex h-11 w-9 flex-col gap-1.5 rounded-[2px] border border-ink bg-paper-raised p-2">
        <span className="h-1 w-full bg-ink" />
        <span className="h-px w-full bg-rule-strong" />
        <span className="h-px w-3/4 bg-rule-strong" />
        <span className="h-px w-5/6 bg-rule-strong" />
      </span>
    </span>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
        <span>Step {current} of {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {Array.from({ length: total }).map((_, idx) => {
          const active = idx < current;
          return (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-[1px] transition-colors duration-300 ${
                active ? "bg-ink" : "bg-paper-sunk"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
