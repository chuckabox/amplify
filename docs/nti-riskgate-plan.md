# NTI RiskGate

Hackathon plan, architecture and build guide for a tiered risk-audit platform that lets NTI's three risk engineers cover ten times the operators by only physically visiting the audits that actually need a human.

Working name is RiskGate. The "audit button" the operator taps is "Run a Guided Audit" (alternatives: SmartCheck, Self-Audit, Fast Audit). Rename freely.

---

## TL;DR

**What it is.** A mobile and tablet optimised web app with two dashboards. Transport operators run their own guided audit through a staged funnel. NTI's engineers only get pulled in when the funnel flags real risk. Everything else clears automatically with a human spot-check.

**The core insight.** The pasted competitor plan speeds up the engineer's paperwork but keeps a human on-site for every audit. We attack the real bottleneck NTI stated: audits are in-person only, and three engineers cannot physically travel to every operator in the country. So we stop sending them to the audits that do not need them.

**Who uses it.**
- **The operator** (the insured transport company) logs into their portal, sees their mileage, premium and next audit due, and taps "Run a Guided Audit".
- **The risk engineer** logs into an at-a-glance dashboard showing the audit queue, escalations that need a human, and portfolio risk across every operator.

**What actually happens.** A submitted audit runs through three tiers:
1. **Tier 1, Guided digital audit.** Operator (or an NTI-authorised workshop on their behalf) fills a short structured form and uploads photos and short video across the four NTI pillars. AI vision plus a standards-benchmarking model scores it. Clean submissions clear here. Anything uncertain or adverse escalates.
2. **Tier 2, Remote video verification.** For flagged submissions, the operator is asked to film specific items on request ("pan across the load restraints on rig 12"). AI plus an engineer review the footage. Resolved cases close. Still-suspicious ones escalate.
3. **Tier 3, In-person audit.** One of the three engineers physically visits, only now, with all prior evidence pre-loaded so the visit is fast.

**The scaling maths.** If roughly 70 percent of audits clear at Tier 1, 20 percent resolve at Tier 2 and only 10 percent reach Tier 3, three engineers effectively cover the workload of thirty. That is the pitch.

**The one-line pitch.** Everyone else automates the report. We change who does the audit, and only send a human where a human is actually needed.

**Why NTI cares.** They told us they have three engineers nationwide and cannot scale in-person. This does not make each audit faster. It removes most audits from the engineer's plate entirely, while keeping human sign-off on every outcome that touches a customer.

**The honest risk, addressed up front.** Self-reported evidence can be gamed. RiskGate assumes bad-faith submissions by default and layers trust controls: authorised-workshop attestation, photo metadata and GPS checks, telematics and mileage cross-referencing, video liveness, random in-person audits regardless of score, and the insurance reality that fraud voids the policy. This is baked into the architecture, not bolted on.

---

## 1. What we are building

**The one-liner.** A tiered audit funnel for NTI. Operators self-serve the routine audit through guided digital capture, an AI triage engine benchmarks their evidence against NTI standards and routes each audit to the cheapest tier that can safely clear it, and the three engineers spend their scarce time only on escalations and sign-off.

**Why the framing matters.** The obvious move on this brief is to build a capture-to-report tool for the engineer. Expect the other teams to do exactly that. It speeds up the write-up but the engineer still drives to every depot. We do not touch the report bottleneck first. We touch the travel-and-headcount bottleneck, which is the one NTI actually named as the constraint.

The product does three things in one flow.

**Triage.** Every submission gets an AI risk score per pillar and a routed tier. This is the engine. It decides who clears automatically, who films a video, and who gets a visit.

**Amplify.** The engineer stops being a field auditor for routine cases and becomes a reviewer of exceptions and the author of the rubric the AI triages against. Their expertise is concentrated where it moves the needle, not spread thin across every routine check. That is exactly "scale without losing human expertise".

**Capture.** Guided, structured, mobile-first evidence capture by the operator or an authorised workshop, mapped to the four NTI pillars (People and Capability, Asset Management, Emergency and Incident Management, Site Safety and Security). Photos, short video and a short form. No engineer required to collect it.

**Positioning.** Amplify the risk engineer, do not replace them. The AI never issues an adverse outcome or a final audit result to a customer without an engineer signing it.

---

## 2. Why this wins the hackathon

**The judge split.** Four judges, two from NTI, two from QUT Entrepreneurship. NTI judges want domain fidelity and "would we deploy this". QUT judges want "is this a venture, not a consulting gig". The tiered funnel serves both: NTI sees their exact scaling problem solved, QUT sees a platform with a partner-network moat and multiple revenue lines.

**The competitive picture.** Two other NTI teams, one of six and one of three. They almost certainly build capture-to-report for the engineer. If we build the same thing we lose on polish and manpower. We win by changing the audit model itself, not the paperwork inside it.

**Validation.** NTI has already articulated the problem. One call with a specialist engineer confirms the four pillars and the current time-per-audit. One call with an audited operator confirms they would rather submit photos than schedule an on-site visit. One call with an adjacent audit domain (marine survey, mining site) gives QUT the "market beyond NTI" line.

**Execution and design.** The demo has a clean wow moment. Submit an audit as an operator, watch the triage engine score it live and route it to a tier, then flip to the engineer dashboard and see only the escalated one waiting for a human. Three submissions in, one lands on the engineer's desk. That visibly is the scaling story.

**Business model.** Per-seat SaaS to NTI, priced on throughput multiplier. Per-operator subscription for the portal and benchmarks. An authorised-workshop partner network that is both a trust mechanism and a distribution channel. Anonymised risk telemetry to underwriters as the future line.

**What we learned from NTI.** They are stretched thin and cannot resource everything. So RiskGate is turnkey with zero NTI-side integration for the MVP: a shared login, a folder of NTI standards PDFs, and a demo phone. No SSO, no system integration, no internal change program on day one.

---

## 3. Target users

**Primary buyer.** NTI risk engineering leadership. They own the audit function's cost and headcount and feel the travel pain.

**Primary user.** The three specialist risk engineers. The tool has to make their day better, not add review load. It must clearly remove more work than it creates.

**Secondary user.** The audited transport operator. They run the guided audit, see their findings and benchmarks, and track remediation.

**Trust partner.** NTI-authorised workshops that perform a standardised basic physical check and attest to it, raising a submission's trust score.

**Future user.** NTI underwriters and product managers who want fleet-wide risk telemetry to price against.

---

## 4. Core user flows

**Flow A. Operator runs a guided audit.**
Operator logs into their portal, sees mileage, premium, fleet and "next audit due". Taps "Run a Guided Audit". The app walks them pillar by pillar through a short form and a required photo and video checklist (e.g. tyres, brakes, load restraint, fire equipment, maintenance log, site signage). Uploads are captured on phone or tablet with GPS and timestamp. Optionally the audit is run at an authorised workshop that adds an attestation.

**Flow B. The triage engine routes the audit.**
On submission, the engine runs vision analysis on every photo and video, scores the form against NTI standards via retrieval, computes a risk score per pillar and an overall confidence, and routes the audit to a tier. Green clears at Tier 1 subject to engineer spot-check. Amber requests a Tier 2 video. Red escalates to Tier 3 in-person. Every routing decision and its evidence is logged.

**Flow C. Remote video verification (Tier 2).**
The operator gets a request to film specific flagged items, either async recorded or a live call. The engine re-scores with the new footage. An engineer confirms clear or escalate. This resolves most amber cases without a site visit.

**Flow D. In-person audit (Tier 3).**
Only red cases reach here. An engineer is dispatched, arriving with all prior photos, video, form answers and the AI's flagged concerns pre-loaded, so the visit is targeted and short. The engineer signs the final audit.

**Flow E. Engineer dashboard.**
At-a-glance: audits by tier, escalations needing a human decision, portfolio risk by pillar and industry, benchmark cohorts, and an "engineer hours saved" counter derived from audits cleared without a visit.

**Flow F. Operator dashboard.**
Their details, current audit status in the funnel, findings with severity and recommended fixes, remediation tracker, and how they benchmark against anonymised peers of similar fleet size and region.

---

## 5. Architecture

### 5.0 Design constraints

Four constraints drive every choice below.

1. **Zero NTI-side integration for MVP.** No SSO, no ingestion from NTI systems. Onboard with a folder of NTI standards PDFs and a shared login.
2. **Mobile and tablet first, web only.** No native app. A responsive PWA. This is the operator's device and the engineer's tablet. Simpler to build, simpler to demo, and it matches the stated interface requirement.
3. **Assume bad-faith submissions.** Self-reported evidence is gameable, so trust controls are first-class, not an afterthought. See 5.11.
4. **Human sign-off on every adverse or final outcome.** The AI can auto-clear a clean audit into a spot-check queue, but it can never disapprove, penalise, or issue a final audit result to a customer without an engineer signing. Enforced in the schema, not just the UI.

### 5.1 High-level shape

```
                        +------------------------------+
                        |  Responsive web app (Next.js)|
                        |  operator portal + engineer  |
                        |  dashboard, mobile/tablet 1st |
                        +---------------+--------------+
                                        |
                                        | HTTPS, JWT
                                        v
+---------------------+     +-----------+------------------+     +----------------------+
| Object store (S3)   |<----+  API gateway (FastAPI)       +---->| Auth (Clerk)         |
| photos, video, PDFs |     |  /audits  /submissions       |     | roles: operator,     |
+----------+----------+     |  /triage  /findings          |     | engineer, admin      |
           |                |  /portal  /admin  /workshops |     +----------------------+
           |                +-----------+------------------+
           |                            | enqueues jobs
           |                            v
           |             +--------------+---------------+
           +------------>| Worker queue (Redis + RQ)    |
   vision reads blobs    |  - analyse_photo (vision)    |
                         |  - analyse_video             |
                         |  - score_submission (triage) |
                         |  - draft_findings (RAG)      |
                         |  - refresh_benchmarks        |
                         +--------------+---------------+
                                        |
                    reads standards, writes triage + findings
                                        v
                         +--------------+---------------+
                         | Postgres + pgvector          |
                         |  tenant-scoped, RLS          |
                         +--------------+---------------+
                                        |
          +-----------------------------+-----------------------------+
          v                                                           v
+---------+----------+                                     +----------+---------+
| Operator dashboard |                                     | Engineer dashboard |
| (mileage, audit,   |                                     | (queue, escalations|
|  findings, bench)  |                                     |  portfolio, saved) |
+--------------------+                                     +--------------------+
```

### 5.2 Components

**Web app.** Next.js 15 App Router, Tailwind, shadcn/ui. Two route groups: `(operator)` and `(engineer)`, plus `(admin)` for NTI ops and workshop management. Mobile and tablet first, responsive up to desktop. The guided-audit capture screens live under `(operator)/audit/[id]/capture` and use the device camera via the browser file and media APIs.

**API gateway.** FastAPI, async, single Docker container. Handles auth (JWT from Clerk), issues signed upload URLs, writes submission rows, enqueues triage jobs. Roughly 18 endpoints, see 5.4.

**Object store.** S3 or R2 (MinIO for local dev). Layout `s3://riskgate/<tenant_id>/<audit_id>/<submission_id>/(photo|video)/<uuid>.<ext>`. Server-side encryption on. We keep original EXIF metadata for trust checks.

**Worker queue.** Redis-backed RQ. Job types: `analyse_photo`, `analyse_video`, `score_submission`, `draft_findings`, `refresh_benchmarks`. Idempotent and retriable.

**Vision service.** A vision model (Claude with image input, or a hosted vision API) checks each required photo is present, legible, and non-duplicate, and flags visible risk indicators per pillar (worn tread, corrosion on a cargo vessel, oil leaks, missing fire equipment, poor load restraint, blocked exits). Output is structured tags plus a per-photo confidence, written to `submission_item`.

**Triage engine.** The crux. Combines vision tags, form answers, workshop attestation, and trust signals into a risk score per pillar and an overall recommended tier. Rules for hard gates (a missing mandatory photo forces at least Tier 2), an LLM pass for nuanced scoring against retrieved standards, and a trust multiplier from 5.11. Writes a `triage_result` row. See 5.5.

**NTI standards library.** PDFs of the NTI audit template and industry standards, chunked by clause, embedded with `text-embedding-3-large`, stored in pgvector, tenant-scoped. Never crosses tenants.

**Findings and report service.** For escalated or completed audits, retrieves top-K standard clauses per observation and calls Claude Sonnet with a strict JSON schema for the finding fields. Draft until an engineer signs.

**Database.** Postgres 16 with pgvector, RLS on `tenant_id` for every table.

### 5.3 Data schema

Full DDL for the load-bearing tables. Supporting tables (`user`, `tenant`, `session`, `audit_log`) omitted for brevity.

```sql
-- Tenants and users
CREATE TABLE tenant (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('nti', 'operator', 'workshop')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- The insured transport operator, e.g. Acme Transport
CREATE TABLE operator (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  name TEXT NOT NULL,
  industry_code TEXT NOT NULL,
  fleet_size INT,
  region TEXT
);

-- Policy-level detail shown on the operator dashboard
CREATE TABLE policy (
  id UUID PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES operator(id),
  premium_annual NUMERIC,
  odometer_total_km NUMERIC,       -- mileage across fleet, from telematics or declared
  next_audit_due DATE,
  last_audit_id UUID
);

-- An asset that can be audited (truck, trailer, cargo vessel)
CREATE TABLE asset (
  id UUID PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES operator(id),
  kind TEXT NOT NULL CHECK (kind IN ('prime_mover','trailer','rigid','cargo_vessel','site')),
  identifier TEXT,                 -- rego or vessel name
  odometer_km NUMERIC
);

-- An NTI-authorised workshop that can attest a submission
CREATE TABLE workshop (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  name TEXT NOT NULL,
  region TEXT,
  accreditation_ref TEXT,
  trust_weight NUMERIC DEFAULT 1.0 -- multiplier applied in triage
);

-- A single audit engagement, moves through tiers
CREATE TABLE audit (
  id UUID PRIMARY KEY,
  operator_id UUID NOT NULL REFERENCES operator(id),
  tier INT NOT NULL DEFAULT 1 CHECK (tier BETWEEN 1 AND 3),
  status TEXT NOT NULL CHECK (status IN
    ('open','submitted','triaged','video_requested','escalated',
     'in_person_scheduled','signed','published')),
  engineer_id UUID,                -- assigned only if escalated
  created_at TIMESTAMPTZ DEFAULT now(),
  signed_at TIMESTAMPTZ,
  signed_by UUID,
  published_at TIMESTAMPTZ
);

-- A submission is one round of evidence within an audit
-- (Tier 1 form+photos, Tier 2 requested video, etc.)
CREATE TABLE submission (
  id UUID PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES audit(id),
  tier INT NOT NULL,
  submitted_by TEXT NOT NULL CHECK (submitted_by IN ('operator','workshop','engineer')),
  workshop_id UUID REFERENCES workshop(id),
  submitted_at TIMESTAMPTZ NOT NULL,
  client_submission_id TEXT UNIQUE -- idempotency for flaky mobile uploads
);

-- One piece of evidence (photo, video, form field)
CREATE TABLE submission_item (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES submission(id),
  pillar TEXT NOT NULL CHECK (pillar IN
    ('people_capability','asset_management','emergency_incident','site_safety_security')),
  kind TEXT NOT NULL CHECK (kind IN ('photo','video','form_field')),
  s3_key TEXT,
  form_key TEXT, form_value TEXT,  -- for form_field kind
  gps_lat NUMERIC, gps_lon NUMERIC,
  captured_at TIMESTAMPTZ,
  exif_json JSONB,                 -- retained for trust checks
  vision_tags JSONB,               -- structured output from vision model
  vision_confidence NUMERIC
);

-- Trust signals computed per submission
CREATE TABLE trust_signal (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES submission(id),
  exif_present BOOLEAN,
  gps_consistent BOOLEAN,          -- photos cluster at one plausible site
  timestamps_fresh BOOLEAN,        -- taken during the audit window
  duplicate_image_detected BOOLEAN,
  telematics_mileage_consistent BOOLEAN,
  workshop_attested BOOLEAN,
  trust_score NUMERIC              -- 0..1, feeds the triage multiplier
);

-- The triage decision for a submission
CREATE TABLE triage_result (
  id UUID PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES submission(id),
  pillar_scores JSONB NOT NULL,    -- {people_capability: 2, asset_management: 4, ...}
  overall_score NUMERIC NOT NULL,
  recommended_tier INT NOT NULL CHECK (recommended_tier BETWEEN 1 AND 3),
  routed_reason TEXT NOT NULL,     -- human-readable why
  model TEXT, prompt_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- NTI standards library
CREATE TABLE standard_clause (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  source TEXT NOT NULL,
  clause_ref TEXT NOT NULL,
  pillar TEXT NOT NULL,
  heading TEXT NOT NULL,
  body TEXT NOT NULL,
  embedding VECTOR(3072)
);
CREATE INDEX ON standard_clause USING hnsw (embedding vector_cosine_ops);

-- Structured finding, the durable data asset
CREATE TABLE finding (
  id UUID PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES audit(id),
  pillar TEXT NOT NULL,
  observation_text TEXT NOT NULL,
  evidence_item_ids UUID[] NOT NULL,
  standard_clause_ref TEXT,
  severity INT NOT NULL CHECK (severity BETWEEN 1 AND 5),
  recommendation_text TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN
    ('draft','engineer_edited','signed','remediated','accepted_risk')),
  created_by TEXT NOT NULL CHECK (created_by IN ('llm','engineer')),
  reviewed_by UUID,
  signed_at TIMESTAMPTZ,
  llm_model TEXT, llm_prompt_version TEXT
);
CREATE INDEX ON finding (audit_id, pillar);

-- Remediation tracking, operator-facing
CREATE TABLE remediation_action (
  id UUID PRIMARY KEY,
  finding_id UUID NOT NULL REFERENCES finding(id),
  owner_operator_user UUID,
  target_date DATE,
  status TEXT NOT NULL CHECK (status IN ('open','in_progress','closed','overdue')),
  evidence_url TEXT,
  closed_at TIMESTAMPTZ
);

-- Peer benchmark buckets
CREATE TABLE benchmark_cohort (
  id UUID PRIMARY KEY,
  industry_code TEXT NOT NULL,
  fleet_size_band TEXT NOT NULL,
  region TEXT NOT NULL,
  UNIQUE (industry_code, fleet_size_band, region)
);
```

Enable RLS on every table with a `USING (tenant_id = current_setting('app.tenant_id')::uuid)` policy, set from JWT claims on connection.

### 5.4 API surface

Version prefix `/v1`, all endpoints JWT-authed.

```
POST   /audits                       -- operator starts an audit
GET    /audits/{id}                  -- audit with tier, status, counts
GET    /audits?operator_id=&status=  -- engineer queue, filterable

POST   /submissions/upload-url       -- pre-signed S3 URL + item_id
POST   /submissions                  -- confirm items, form answers, enqueue triage
POST   /submissions/bulk             -- flaky-network batch, idempotent
GET    /submissions?audit_id=

POST   /triage/{submission_id}/run   -- (re)run the triage engine
GET    /triage/{submission_id}       -- scores, tier, reason, trust signals
POST   /audits/{id}/request-video    -- Tier 2, ask operator for specific footage
POST   /audits/{id}/escalate         -- Tier 3, assign engineer
POST   /audits/{id}/sign             -- engineer sign-off, atomic
POST   /audits/{id}/publish          -- push result to operator portal

GET    /findings?audit_id=
PATCH  /findings/{id}                -- engineer edits
POST   /findings/{id}/regenerate

GET    /portal/operator/{id}         -- operator rollup: mileage, premium, findings
GET    /portal/benchmarks/{id}       -- peer benchmarks

GET    /admin/portfolio              -- NTI aggregate, risk by pillar and industry
GET    /admin/engineer-capacity      -- hours and visits saved counter
POST   /admin/workshops              -- manage authorised workshops
POST   /standards/upload             -- ingest a standards PDF (admin only)
```

### 5.5 Triage pipeline

The engine that decides the tier. Run as `score_submission`, one per submission.

1. **Ingest.** Gather the submission's items: form answers, vision tags per photo, video analysis, and the computed `trust_signal` row.
2. **Hard gates first (rules).** If a mandatory photo is missing or illegible, or a trust signal fails (no EXIF, GPS inconsistent, duplicate image, mileage mismatch), the submission cannot clear at Tier 1. It is forced to at least Tier 2 regardless of what the images show. This closes the obvious gaming holes before the model even runs.
3. **Retrieve.** For each pillar, embed the observation and cosine-search `standard_clause` filtered by pillar and tenant. Top K = 5.
4. **Score (LLM).** Send Claude Sonnet the form answers, vision tags, retrieved clauses, and the severity scale. It returns a per-pillar severity 1 to 5 and a short reason, in strict JSON.
5. **Apply trust multiplier.** Multiply the confidence of a clean result by the `trust_score`. A low-trust clean submission does not get to auto-clear. A workshop-attested clean submission clears more easily.
6. **Route.** Overall score plus confidence maps to a tier. Green (low severity, high trust, high confidence) clears Tier 1 into the engineer spot-check queue. Amber requests a Tier 2 video. Red escalates to Tier 3. Write `triage_result` with a human-readable `routed_reason`.
7. **Persist and draft.** For escalated or completed audits, run `draft_findings` to produce structured findings, all `status = 'draft'` until signed.

Scoring output schema (abbreviated):

```json
{
  "pillar_scores": {
    "asset_management": 4,
    "site_safety_security": 2,
    "people_capability": 1,
    "emergency_incident": 2
  },
  "overall_score": 3.1,
  "recommended_tier": 2,
  "routed_reason": "Tyre tread on rig 12 appears below limit; requesting close-up video."
}
```

### 5.6 The three tiers, explicitly

- **Tier 1, Guided digital audit.** Operator or authorised workshop submits form plus required photos and short video. Target: this clears the majority of audits. Engineer does a fast batch spot-check of green clears, and every green audit is eligible for random full re-audit.
- **Tier 2, Remote video verification.** Triggered by amber. The system asks the operator to film specific flagged items, async or live. Re-scored, then an engineer confirms clear or escalate. Target: resolves most amber cases without a site visit.
- **Tier 3, In-person audit.** Triggered by red or by a failed Tier 2. One of the three engineers visits, with all prior evidence pre-loaded, and signs the final audit. Target: the only tier that consumes travel, and it is the minority.

### 5.7 Auth and multi-tenancy

Clerk issues JWTs with `user_id`, `tenant_id`, `role` in {`operator_user`, `nti_engineer`, `nti_admin`, `workshop_user`}. FastAPI middleware sets `app.tenant_id` before every query. RLS enforces isolation. Operators see only their own audits. Engineers see NTI's whole portfolio. Standards never cross tenants.

### 5.8 Sequence: submission to routed audit

```
Operator     Web app        API          S3         Queue       Vision/LLM     DB
   |            |             |           |            |             |           |
   |--capture-->|             |           |            |             |           |
   |            |--upload_url->|          |            |             |           |
   |            |<-signed_url--|          |            |             |           |
   |            |-----PUT photo/video---->|            |             |           |
   |            |--submit----->|          |            |             |           |
   |            |              |--enqueue analyse+score->|           |           |
   |            |              |                        |--vision--->|           |
   |            |              |                        |<--tags-----|           |
   |            |              |                        |--trust+score(LLM)----->|
   |            |              |                        |<--tier+reason----------|
   |            |              |                        |------write triage----->|
   |            |<--routed: Tier N, reason--------------|                        |
Engineer sees only escalated audits in the queue; green clears to spot-check.
```

### 5.9 Deployment topology

- Vercel hosts the Next.js app (two route groups, one deployment).
- Fly.io hosts the FastAPI API and the RQ worker.
- Neon or Fly Postgres with pgvector.
- Upstash Redis for the queue.
- Cloudflare R2 or S3 for blobs.
- Clerk for auth. Anthropic API for LLM and vision. OpenAI or Voyage for embeddings.

Single `prod` environment for the hackathon. `.env` locally, Fly secrets in prod.

### 5.10 Repository layout

```
riskgate/
  apps/
    web/                    # Next.js, mobile/tablet first
      app/
        (operator)/
          dashboard/        # mileage, premium, next audit
          audit/[id]/capture/   # guided form + camera
          findings/
        (engineer)/
          queue/            # audits by tier, escalations
          audit/[id]/review/
          portfolio/        # aggregate + benchmarks + saved counter
        (admin)/
          workshops/
          standards/
      components/ui/        # shadcn
  services/
    api/                    # FastAPI
      routers/
      models/               # Pydantic
      db/                   # SQLAlchemy + Alembic
      workers/
        analyse_photo.py
        analyse_video.py
        score_submission.py
        draft_findings.py
        refresh_benchmarks.py
      prompts/
        triage_v1.md
        finding_v1.md
  packages/
    shared-types/           # generated from OpenAPI
  infra/
    docker-compose.yml
    fly.toml
    schema.sql
  scripts/
    seed_standards.py
    demo_data.py            # three operators, three tiers, for the pitch
```

### 5.11 Trust and anti-gaming (the section that wins or loses the pitch)

Self-reported evidence invites cheating. RiskGate assumes it and defends in layers. Show at least three of these live or on a slide, because the first NTI question will be "what stops them lying".

- **Authorised-workshop attestation.** An NTI-accredited workshop can run and attest the Tier 1 check. Workshop-attested submissions carry a higher `trust_weight` and clear more easily. Operator-only submissions carry lower trust and escalate more often. This turns the workshop network into both a trust layer and a distribution channel.
- **Metadata and GPS checks.** EXIF present, timestamps within the audit window, and photos clustering at one plausible location. Missing or inconsistent metadata forces escalation.
- **Duplicate and stock-image detection.** Perceptual hashing catches reused or lifted photos.
- **Telematics and mileage cross-check.** Declared condition is checked against odometer and telematics. A truck claimed pristine at 900,000 km gets scrutiny.
- **Video liveness.** Tier 2 asks for a specific, hard-to-fake action ("pan slowly from the rego plate to the front left tyre"), which resists pre-recorded fakes.
- **Random full audits.** A percentage of green clears are re-audited in person regardless of score, so gaming carries real risk of being caught.
- **Insurance reality.** Fraudulent submissions void cover. That is a genuine deterrent an ordinary SaaS does not have, and it belongs in the pitch.
- **Human gate on adverse outcomes.** The AI never disapproves or penalises a customer on its own. An engineer signs every adverse or final result, with the evidence and the AI's reasoning attached.

### 5.12 What we do not build for the MVP

Named so judges see deliberate cuts.

- SSO or integration with NTI's identity or policy systems.
- Real telematics integration. For the demo, mileage is a declared field and the "telematics cross-check" is stubbed with a plausible fixture.
- Native app store builds. Responsive web is the whole point.
- Live video calling. Tier 2 is async recorded upload for the MVP.
- Perfect PDF parity with NTI's report. Match the style, not the pixels.
- Fine-grained RBAC beyond the four roles.

---

## 6. Hackathon build plan

Team of three, roughly 24 to 36 hours.

### Hour 0 to 2. Validation and scope lock.
Call one NTI engineer and one operator. Confirm the four pillars, the current time-per-audit, and that operators would prefer submitting photos to scheduling a visit. Lock the demo to three operators and one pillar walked end to end, one landing green, one amber, one red.

### Hour 2 to 6. Skeleton and stubs.
Next.js app with operator and engineer route groups. FastAPI with health check, upload-url, and submissions endpoints. Postgres with the schema. Seed three operators, one site each, five NTI standard clauses in the vector store.

### Hour 6 to 14. Capture and vision.
Build the guided-audit capture screen (mobile-first, camera via browser, pillar checklist, form). Wire uploads to signed URLs. Run the vision model on submitted photos, write `vision_tags` and confidence. Compute `trust_signal` from EXIF and simple checks.

### Hour 14 to 22. Triage engine.
The centrepiece. Hard-gate rules, retrieval, LLM scoring, trust multiplier, tier routing, `triage_result` with a readable reason. This is what must work. Everything else supports it.

### Hour 22 to 28. Two dashboards.
Operator dashboard: mileage, premium, next audit, audit status in the funnel, findings, remediation. Engineer dashboard: audit queue by tier, escalations, one portfolio chart, and the "visits saved" counter.

### Hour 28 to 32. Benchmarks and polish.
Fake enough peer data to make benchmarks look real (say so in the pitch). Severity heatmap by pillar, peer percentile chart. Tidy empty states and typography.

### Hour 32 to 36. Demo script and pitch.
Rehearse the arc: submit three audits, watch them route to three tiers, flip to the engineer dashboard and show only one escalation waiting. Two slides on business model, one on validation naming who you spoke to.

### Cuttable if time slips
Tier 2 video can be a single uploaded clip. Benchmarks can be fully fixture. Remediation can be a static table. The trust layer can be three checks instead of eight, as long as at least the EXIF, GPS and workshop-attestation ones are real.

### Not cuttable
The path from an operator submitting evidence, through the triage engine scoring and routing it to a tier, to the engineer seeing only the escalated one. That single flow is the entire pitch.

---

## 7. Tech stack summary

| Layer | Choice | Why |
|---|---|---|
| Web | Next.js, Tailwind, shadcn/ui | One app, two dashboards, mobile and tablet first |
| Camera capture | Browser media and file APIs | No native app needed |
| API | FastAPI | Small, fast, good LLM ecosystem |
| DB | Postgres + pgvector | Structured findings and embeddings in one place |
| Object store | S3 or R2 (MinIO local) | Durable blob storage, keep EXIF |
| Vision | Claude image input or hosted vision API | Photo analysis and risk tagging |
| LLM | Claude Sonnet via API | Strong structured output for triage and findings |
| Queue | Redis + RQ | Idempotent async jobs |
| Auth | Clerk | Skip building auth, four roles out of the box |
| Hosting | Vercel + Fly.io | Fast to deploy and demo |

---

## 8. Business model

### 8.1 Revenue lines

**Line 1. Per-seat SaaS to NTI.** Priced on the throughput multiplier. If three engineers currently cover N operators in-person, and the funnel lets them cover 8 to 10 times as many by only visiting escalations, the tool pays for itself in avoided hiring and travel many times over. This is a stronger version of the pasted plan's Line 1 because we remove audits from the engineer entirely, not just speed up their write-up.

**Line 2. Per-operator subscription.** Operators pay a modest annual fee for the portal, guided audits, benchmarks and remediation tracking. Turns a one-off inspection into a year-round relationship.

**Line 3. Authorised-workshop network.** A revenue and trust layer. Workshops pay to be accredited and listed, operators pay for a workshop-run audit, and NTI gets higher-trust submissions. This is a moat the report-automation teams cannot copy without building the same network.

**Line 4 (future). Anonymised risk telemetry to underwriters.** Structured findings across the whole portfolio, licensed internally to NTI underwriting and product.

### 8.2 Unit economics sketch

NTI seat at $500 per engineer per month scaling to 30 effective-throughput engineers is around $180K ARR. 200 operators at $2K per year is $400K ARR. A workshop network adds a third line. North of $500K ARR in year one at modest penetration, with the throughput multiplier as the headline number NTI cares about most.

### 8.3 Why NTI cannot just build this internally

They could, but they told us they are stretched thin and cannot resource everything. NTI is an insurer, not a software company. A focused team ships in weeks what an internal IT project ships in quarters, and the same funnel resells to adjacent niche audit domains (marine survey, mining logistics, aviation ground handling) once proven.

### 8.4 Uniqueness

Capture-to-report tools stop at the report and still need a human on-site. Consulting-style audits (the Bain and McKinsey pattern the brief alludes to) do not scale by design. Nobody is building a tiered self-serve audit funnel with an AI triage engine and an accredited-workshop trust layer for a niche insurance vertical. That fusion is the bet.

---

## 9. Judging criteria alignment

Four judges, two NTI, two QUT. Every criterion needs both.

**Validation.**
NTI angle: named calls with an NTI engineer and an operator, exact four-pillar match, real NTI clause references in the demo.
QUT angle: one call with an adjacent audit domain so the market extends beyond NTI.

**Execution and design.**
NTI angle: the two dashboards match how NTI thinks, and human sign-off is visible in the demo, not just claimed.
QUT angle: polish over feature count. The three-tier routing animation is the memorable moment.

**Business model.**
NTI angle: the throughput multiplier arithmetic, three engineers covering ten times the operators.
QUT angle: four revenue lines, a workshop-network moat, and benchmarks that compound with every operator added.

---

## 10. Risks and mitigations

**Operators game the self-report.** Mitigation, the whole of 5.11: workshop attestation, metadata and GPS checks, duplicate detection, telematics cross-check, video liveness, random in-person re-audits, and fraud voiding cover.

**Vision model misreads real depot photos.** Mitigation, vision output is advisory, low confidence forces escalation rather than auto-clear, and a human signs every adverse outcome.

**Auto-clear feels like the AI is deciding cover.** Mitigation, green only clears into a human spot-check queue, adverse actions always need a signature, and every routing decision carries a readable reason and full evidence.

**Engineers end up reviewing more, not less.** Mitigation, design the green lane so spot-checking a clean batch takes seconds, and measure and show the net-hours-saved counter honestly.

**NTI standards are proprietary.** Mitigation, standards library is tenant-scoped and never enters another tenant's prompt.

---

## 11. What to demo, in order

1. Log in as an operator. Show the dashboard: mileage, premium, next audit due. Tap "Run a Guided Audit".
2. Walk the guided capture: pick a pillar, answer two form fields, snap the required photos and a short clip. Submit.
3. Watch the triage engine score live and route this audit. Repeat quickly with two pre-loaded submissions so one lands green, one amber, one red.
4. Show the amber operator being asked for a specific Tier 2 video.
5. Flip to the engineer dashboard. Three audits came in, only the red one is on the engineer's desk. The other two cleared without a visit.
6. Engineer opens the red audit, all evidence pre-loaded and flagged, edits one finding, clicks Sign Off.
7. Show the portfolio view and the "in-person visits saved" counter.

Ninety seconds, two dashboards, one unmistakable story: three audits in, one human visit out.

---

## 12. Next actions for the team

1. Book calls with an NTI engineer and an operator this week. Confirm current time-per-audit and appetite for self-serve.
2. Book one call with an adjacent audit domain for the QUT market slide.
3. Get a redacted NTI audit report and the audit template.
4. Assign owners: one on capture and vision, one on the triage engine and API, one on the two dashboards and pitch.
5. Lock the demo script (three audits, three tiers, one visit) before writing code.

---

## 13. Competitive positioning against the other two NTI teams

**The situation.** Two other teams build for NTI, one of six, one of three. Both likely attack "manual reporting" with a capture-to-report tool for the engineer.

**Why we do not fight there.** Feature-for-feature against six people we lose. So we do not build the same thing.

**Our angle.** We change the audit model, not the paperwork. The engineer stops being the person who runs every audit and becomes the person who handles exceptions and signs off. That answers the brief's actual headline, scale without losing human expertise, more directly than a faster report does.

**Note on the other visible plan.** There is a strong plan floating around that headlines a "data spine" of structured findings. It is good, but it still keeps a human on-site for every audit and only speeds up the write-up. Our tier funnel removes most site visits entirely. If a judge has seen that plan, the contrast is our friend: same structured-findings backend underneath, but we solve the travel-and-headcount constraint they leave untouched.

**Reinforce the difference in the pitch.**
- Open with "three engineers, one nation, and an audit model that requires them to be everywhere at once". Then show the funnel fixing exactly that.
- Say the line: "Everyone else automates the report. We change who runs the audit."
- Land the throughput line: "Three audits come in, one human visit goes out."

**If we learn what the other teams are actually building.**
If both are capture-to-report as expected, hold this plan. If either pivots to a triage or self-serve angle, lean harder into the trust and workshop-network layer (5.11 and Line 3), which is the part that is hardest to stand up in a weekend and hardest to copy.
