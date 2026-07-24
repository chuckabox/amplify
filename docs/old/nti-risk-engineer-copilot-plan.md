# NTI Risk Engineer Copilot

Hackathon plan, architecture and build guide for a B2B SaaS that scales NTI's risk engineering capability without losing the human expert.

---

## TL;DR

**What it is.** A phone app plus a website that lets NTI's risk engineers do more audits with the same three people, and turns the results into a live data product NTI can sell to customers and underwriters.

**Who uses it.**
- **The risk engineer** uses a phone app on-site to capture what they see and hear during the depot walkaround.
- **The customer** (the audited transport operator) logs in to a website to see their findings and how they compare to their peers.
- **NTI leadership** logs in to see all audits, all customers, all findings in one dashboard.

**What actually happens, step by step.**
1. Engineer arrives at a transport depot. Opens the phone app. Picks the customer and site.
2. Engineer walks the site. Taps a pillar (e.g. "Asset Management"), speaks their observation ("front left tyre on rig 12 is worn below the legal tread"), snaps a photo. Repeats for every issue. No typing.
3. Engineer taps "Complete walkaround" and drives home. On the drive, the backend transcribes the audio, cross-references each observation against NTI's standards, and drafts a full audit report structured to NTI's existing format.
4. Engineer opens their laptop, reviews the draft, edits anything wrong, clicks Sign Off. What used to take days of desk work is done in an hour.
5. The customer receives an email. They log in to their portal and see their findings, severity ratings, recommended fixes, and a benchmark chart showing how they compare to other fleets of similar size in similar regions.
6. NTI leadership sees the audit rolled up into their portfolio dashboard alongside every other customer, with trends by industry and a counter showing engineer hours saved.

**The one-line pitch.** Every other team will automate the audit report. We turn every audit NTI has ever done into a live risk data product.

**Why NTI cares.** They told us they are stretched thin. This ships as a turnkey product with zero integration burden on their side. Three engineers deliver the throughput of thirty.

**Why the judges care.** NTI judges see a product they would deploy. QUT judges see two revenue lines (SaaS to NTI, subscription to customers) with a third data-licensing line waiting behind a data-network moat.

---

## 1. What we are building

**The one-liner.** A risk data spine for NTI. Every audit, every finding, every remediation stored as structured data, feeding a customer benchmarking portal and an NTI portfolio dashboard, with a voice-first capture app as the front door.

**Why the framing matters.** Most teams tackling this brief will attack the "manual reporting" bullet and build a capture-to-report tool. That is table stakes and easy to copy. Our headline is bullet 3 of NTI's brief, "insights stay siloed", reframed as a data product play. Capture is the demo moment. The data spine is the company.

The product does three things in one flow.

**Unsilo.** Every finding is stored as structured data, not PDF text. That unlocks portfolio views for customers, benchmarking against anonymised peers, trend analysis for NTI, and a data feed NTI's underwriters can price against. This is the moat.

**Draft.** An LLM benchmarks captured evidence against NTI's internal standards and industry references, then generates a first-draft report the engineer reviews and signs off. What used to take days of desk work happens in the truck on the drive home.

**Capture.** Voice, photo and short video during the walkaround, structured against the four NTI audit pillars (People and Capability, Asset Management, Emergency and Incident Management, Site Safety and Security). Feels great on stage, one of several inputs to the spine.

**Positioning.** Amplify the risk engineer, do not replace them. The engineer is always in the loop and always signs the final report.

---

## 2. Why this wins the hackathon

**The judge split.** Four judges. Two from NTI, two from QUT Entrepreneurship. That drives every design decision. NTI judges want domain fidelity and "would we deploy this". QUT judges want "is this a venture or a consulting project". Same product satisfies both if we frame it right.

**The competitive picture.** Two other teams (one of six, one of three) are also building for NTI. They almost certainly attack the "manual reporting" bullet with a capture-to-report tool. If we do the same, we lose on polish and manpower. We win by attacking a different bullet on the same brief.

**Validation.** The problem is already articulated by NTI. Talking to any one of the three specialist engineers or to one audited fleet operator gives us direct-from-customer validation before we write a line of code. Add one call to an adjacent audit firm (marine, mining, aviation) so the QUT judges see a market beyond NTI.

**Execution and Design.** The demo has a clear wow moment. Speak into a phone at a mock depot, watch a structured NTI-benchmarked report generate live, then open the customer portal and NTI portfolio dashboard. Three screens, sixty seconds, but the last two screens are what judges remember.

**Business Model.** Two revenue lines from one build, third line waiting behind the data moat. Per-seat SaaS to NTI. Per-customer benchmarking subscription to audited operators. Anonymised risk telemetry to underwriters. QUT judges hear "data-network moat", NTI judges hear "product our underwriters would pay for internally".

**What we learned from NTI.** In our conversation with the NTI representative one signal came through clearly. They are stretched thin across many concurrent initiatives and cannot resource everything they want to build. That reshapes our pitch in two ways. First, we position the product as turnkey. "You told us you cannot build this internally right now. We ship it to you as a product, not a project." Second, the MVP requires zero NTI-side integration work. Laptop, phone, and a folder of NTI standards docs is all we need to onboard. No SSO, no system integrations, no internal change program on day one. That constraint is baked into the architecture below.

---

## 3. Target users

**Primary buyer.** NTI risk engineering leadership. They own the P&L of the audit function and feel the scaling pain.

**Primary user.** The three NTI specialist risk engineers. They must love the tool or it does not get used.

**Secondary user.** The audited fleet operator. They log in to see their own findings, benchmarks and remediation status.

**Future user.** NTI underwriters and product managers who want fleet-wide risk telemetry to inform pricing and product design.

---

## 4. Core user flows

**Flow A. On-site capture.**
Engineer opens the app, selects the customer and site. The app shows a pillar-by-pillar checklist derived from the NTI audit template. Engineer walks the site, taps a pillar, speaks their observation and snaps a photo. Voice is transcribed on-device or via streaming API. Photos are tagged with GPS, timestamp and pillar. No typing required.

**Flow B. Drive-home draft.**
When the engineer marks the walkaround complete, the backend assembles the transcripts, photos and checklist state, runs each observation against the NTI standards library and generates a first-draft report structured to NTI's existing PDF format. The engineer reviews on a laptop or tablet, edits inline, then signs off.

**Flow C. Customer portal.**
The audited operator logs in and sees their findings, severity ratings, recommended actions, remediation status and how they benchmark against the anonymised peer set (same fleet size, same vehicle class, same region).

**Flow D. NTI portfolio view.**
NTI ops sees all customers, all findings, trending risks by industry segment, engineer utilisation and audit throughput.

---

## 5. Architecture

### 5.0 Design constraints

Three constraints drive every choice below.

1. **Zero NTI-side integration for MVP.** No SSO, no ingestion from their systems, no change to their existing tooling. Onboard with a folder of NTI standards PDFs and a shared login.
2. **Offline-first mobile.** Depots and rural sites have poor signal. The engineer must be able to complete an entire walkaround with no connection and sync later.
3. **Human sign-off is a hard gate.** No LLM output reaches a customer without an engineer signing it. This is enforced in the schema, not just the UI.

### 5.1 High-level shape

```
                                +----------------------+
                                |  Mobile capture app  |
                                |  (Expo, offline-first)|
                                +----------+-----------+
                                           |
                                           | HTTPS, JWT
                                           v
+---------------------+     +--------------+---------------+     +----------------------+
| Object store (S3)   |<----+  API gateway (FastAPI)       +---->| Auth (Clerk)         |
| audio, photos, PDFs |     |  - /captures  - /audits      |     |                      |
+----------+----------+     |  - /findings  - /reports     |     +----------------------+
           |                |  - /portal    - /admin       |
           |                +--------------+---------------+
           |                               |
           |                               | enqueues jobs
           v                               v
+---------------------+     +--------------+---------------+
| Transcription       +---->+ Worker queue (Redis + RQ)    |
| (Whisper)           |     |  - transcribe                |
+---------------------+     |  - draft_finding             |
                            |  - assemble_report           |
                            |  - refresh_benchmarks        |
                            +--------------+---------------+
                                           |
                       reads standards, writes findings
                                           v
                            +--------------+---------------+
                            | Postgres + pgvector          |
                            |  tenant-scoped, RLS          |
                            +--------------+---------------+
                                           |
        +----------------------------------+----------------------------------+
        v                                  v                                  v
+-------+-------+                +---------+---------+                +-------+-------+
| Engineer web  |                | Customer portal   |                | NTI admin     |
| (Next.js)     |                | (Next.js /portal) |                | (Next.js /admin)|
+---------------+                +-------------------+                +---------------+
```

### 5.2 Components

**Hackathon stack summary (zero cost).** Single Next.js 15 app on Vercel, Supabase for DB and file storage and auth and realtime, Groq (Llama 3.3 70B) for the LLM, browser SpeechRecognition for transcription. No FastAPI, no Redis, no Docker, no worker queue, no money spent. Everything below describes the production shape and how the hackathon MVP compresses it.

**Mobile capture (web, not native).** Next.js route at `/capture` styled at phone dimensions. Uses browser `MediaRecorder` for audio and `<input type="file" capture="environment">` for photos. On a phone browser (Chrome, Edge, iOS Safari) it looks and behaves like a native app. Zero React Native, zero Expo, zero app store.

**API layer.** Next.js API routes (serverless functions on Vercel) for anything that needs a secret (LLM calls, standards ingestion). Everything else the client speaks to Supabase directly via the JS SDK. No separate API service to host.

**Object store.** Supabase Storage bucket per tenant. Free tier gives 1GB, enough for a hackathon. Path layout `<tenant_id>/<audit_id>/<capture_id>.<ext>`. Row-level security policies match the DB.

**Background work.** No worker queue for the MVP. LLM calls run inline in a Next.js API route triggered from the client after the capture uploads. If they take more than a few seconds, use a "processing" state in the UI. For production, this becomes a proper queue (RQ, BullMQ, or Supabase Edge Functions).

**Transcription.** Browser `SpeechRecognition` API on Chrome and Edge, on-device and free. Fallback for iOS Safari is Groq's hosted Whisper endpoint, also free within their limits. Store the resulting text as a `transcript_segment` row.

**NTI standards library.** Ten to fifteen NTI standard clauses stored as a JSON file in the repo. Included in full in every LLM prompt. This skips embeddings and pgvector entirely for the hackathon. Production version is chunked and embedded in pgvector, see 5.5.

**Report generation service.** A single Next.js API route `/api/generate-finding`. Takes an observation ID, reads the transcript and photo captions from Supabase, calls Groq's Llama 3.3 70B with a strict JSON schema, validates the response and writes the finding row back to Supabase. Retries on schema failure. Realtime subscription pushes the new row to any open browser.

**Findings database.** Supabase Postgres with RLS on `tenant_id` for every table. Same schema as 5.3 minus pgvector for the MVP.

**Engineer web app.** Same Next.js app, routes at `/audits/[id]/review`, `/audits/[id]/report`, `/audits/[id]/sign`. shadcn/ui plus Tailwind for polish.

**Customer portal.** Same Next.js app under `/portal`. Tenant-scoped by the logged-in user's `customer_id`. Read-only.

**NTI admin.** Same Next.js app under `/admin`. Aggregated views, filters, benchmark cohort management, engineer capacity metrics.

### 5.3 Data schema

Full DDL for the crown-jewel tables. Others (`user`, `tenant`, `session`, `audit_log`) omitted for brevity.

```sql
-- Tenants and users
CREATE TABLE tenant (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('nti', 'customer', 'audit_firm')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- The customer being audited, e.g. Acme Transport
CREATE TABLE customer (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  name TEXT NOT NULL,
  industry_code TEXT NOT NULL,
  fleet_size INT,
  region TEXT
);

-- A physical location we audit
CREATE TABLE site (
  id UUID PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES customer(id),
  name TEXT NOT NULL,
  address TEXT,
  lat NUMERIC, lon NUMERIC
);

-- A single audit engagement
CREATE TABLE audit (
  id UUID PRIMARY KEY,
  site_id UUID NOT NULL REFERENCES site(id),
  engineer_id UUID NOT NULL,
  status TEXT NOT NULL CHECK (status IN
    ('scheduled', 'in_progress', 'draft', 'signed', 'published')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signed_by UUID,
  published_at TIMESTAMPTZ
);

-- A single capture event during a walkaround (voice or photo)
CREATE TABLE capture (
  id UUID PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES audit(id),
  pillar TEXT NOT NULL CHECK (pillar IN
    ('people_capability', 'asset_management',
     'emergency_incident', 'site_safety_security')),
  kind TEXT NOT NULL CHECK (kind IN ('audio', 'photo', 'video', 'note')),
  s3_key TEXT NOT NULL,
  gps_lat NUMERIC, gps_lon NUMERIC,
  captured_at TIMESTAMPTZ NOT NULL,
  client_capture_id TEXT UNIQUE  -- for offline sync idempotency
);

-- Transcribed voice segments
CREATE TABLE transcript_segment (
  id UUID PRIMARY KEY,
  capture_id UUID NOT NULL REFERENCES capture(id),
  start_ms INT NOT NULL,
  end_ms INT NOT NULL,
  text TEXT NOT NULL,
  confidence NUMERIC
);

-- NTI standards library
CREATE TABLE standard_clause (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  source TEXT NOT NULL,          -- e.g. 'NTI Audit Template v3.2'
  clause_ref TEXT NOT NULL,      -- e.g. 'AM-4.2.1'
  pillar TEXT NOT NULL,
  heading TEXT NOT NULL,
  body TEXT NOT NULL,
  embedding VECTOR(3072)         -- pgvector, text-embedding-3-large
);
CREATE INDEX ON standard_clause USING hnsw (embedding vector_cosine_ops);

-- The crown jewel. Structured findings.
CREATE TABLE finding (
  id UUID PRIMARY KEY,
  audit_id UUID NOT NULL REFERENCES audit(id),
  pillar TEXT NOT NULL,
  sub_control TEXT,
  observation_text TEXT NOT NULL,
  evidence_capture_ids UUID[] NOT NULL,
  standard_clause_id UUID REFERENCES standard_clause(id),
  standard_clause_ref TEXT,      -- denormalised for fast reads
  severity INT NOT NULL CHECK (severity BETWEEN 1 AND 5),
  recommendation_text TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN
    ('draft', 'engineer_edited', 'signed', 'remediated', 'accepted_risk')),
  created_by TEXT NOT NULL CHECK (created_by IN ('llm', 'engineer')),
  reviewed_by UUID,
  signed_at TIMESTAMPTZ,
  llm_model TEXT,
  llm_prompt_version TEXT
);
CREATE INDEX ON finding (audit_id, pillar);
CREATE INDEX ON finding (status);

-- Remediation tracking, customer-facing
CREATE TABLE remediation_action (
  id UUID PRIMARY KEY,
  finding_id UUID NOT NULL REFERENCES finding(id),
  owner_customer_user UUID,
  target_date DATE,
  status TEXT NOT NULL CHECK (status IN ('open', 'in_progress', 'closed', 'overdue')),
  evidence_url TEXT,
  closed_at TIMESTAMPTZ
);

-- Peer benchmark buckets
CREATE TABLE benchmark_cohort (
  id UUID PRIMARY KEY,
  industry_code TEXT NOT NULL,
  fleet_size_band TEXT NOT NULL,   -- e.g. '50-200'
  region TEXT NOT NULL,
  UNIQUE (industry_code, fleet_size_band, region)
);

CREATE MATERIALIZED VIEW cohort_pillar_score AS
SELECT
  bc.id AS cohort_id,
  f.pillar,
  percentile_cont(0.5) WITHIN GROUP (ORDER BY f.severity) AS p50,
  percentile_cont(0.9) WITHIN GROUP (ORDER BY f.severity) AS p90,
  count(*) AS n_findings
FROM finding f
JOIN audit a ON a.id = f.audit_id
JOIN site s ON s.id = a.site_id
JOIN customer c ON c.id = s.customer_id
JOIN benchmark_cohort bc ON
  bc.industry_code = c.industry_code
  AND bc.region = c.region
  AND bc.fleet_size_band = fleet_size_band_for(c.fleet_size)
WHERE f.status IN ('signed', 'remediated', 'accepted_risk')
GROUP BY bc.id, f.pillar;
```

Enable RLS on every table with a `USING (tenant_id = current_setting('app.tenant_id')::uuid)` policy. Set `app.tenant_id` from JWT claims on connection.

### 5.4 API surface

Version prefix `/v1`. All endpoints require JWT auth. Full OpenAPI spec is generated from FastAPI decorators.

```
POST   /audits                    -- start a new audit
GET    /audits/{id}               -- get audit with counts
PATCH  /audits/{id}               -- update status, e.g. complete_walkaround
POST   /audits/{id}/sign          -- engineer sign-off, atomic
POST   /audits/{id}/publish       -- push to customer portal

POST   /captures/upload-url       -- returns pre-signed S3 URL + capture_id
POST   /captures                  -- confirm upload, metadata, enqueue transcribe
POST   /captures/bulk             -- offline sync, idempotent by client_capture_id
GET    /captures?audit_id=        -- list captures for an audit

GET    /findings?audit_id=        -- list findings
PATCH  /findings/{id}             -- engineer edits fields
POST   /findings/{id}/regenerate  -- re-run LLM with new context

GET    /portal/customer/{id}      -- customer read-only rollup
GET    /portal/benchmarks/{id}    -- peer benchmarks for a customer

GET    /admin/portfolio           -- NTI aggregate view
GET    /admin/engineer-capacity   -- hours saved counter

POST   /standards/upload          -- ingest a standards PDF (admin only)
```

### 5.5 RAG pipeline

Each observation is turned into a draft finding by a five-step pipeline. Run as a `draft_finding` worker job, one per observation.

1. **Group.** Collect all transcript segments for the capture (or a cluster of nearby captures within the same pillar) into one observation blob.
2. **Retrieve.** Embed the observation with `text-embedding-3-large`, do a cosine-similarity search on `standard_clause` filtered by `pillar` and `tenant_id`. Top K = 5.
3. **Prompt.** Send Claude Sonnet a system prompt that names the four pillars, the accepted severity scale, and the exact JSON schema. User prompt contains the observation text, timestamps, GPS, photo captions (generated by a vision model if needed), and the retrieved clauses.
4. **Validate.** Parse the JSON output against a Pydantic model. On validation failure, retry once with the error included in the prompt. On second failure, insert a `finding` row with `status = 'draft'` and `observation_text` only, flagged for engineer manual review.
5. **Persist.** Insert the finding, denormalise `standard_clause_ref`, record `llm_model` and `llm_prompt_version` for auditability.

Prompt schema (abbreviated):

```json
{
  "pillar": "asset_management",
  "sub_control": "AM-4.2 tyre condition",
  "standard_clause_ref": "AM-4.2.1",
  "severity": 3,
  "observation_text": "...",
  "recommendation_text": "..."
}
```

### 5.6 Offline sync

The mobile app writes every capture to a local SQLite queue with a UUID `client_capture_id`. When network is available, the app batches uploads to `POST /captures/bulk`. The server treats `client_capture_id` as an idempotency key. Photo and audio bytes are uploaded direct to S3 via pre-signed URLs, so a partial network drop only loses one blob, not the whole walkaround. On successful server ack, the local queue row is marked synced.

### 5.7 Auth and multi-tenancy

Clerk handles login and issues JWTs. JWT claims include `user_id`, `tenant_id`, `role` (one of `nti_engineer`, `nti_admin`, `customer_user`). FastAPI middleware sets Postgres session variable `app.tenant_id` from the JWT before every query. RLS policies on every table enforce isolation. No cross-tenant queries possible without a privileged role that requires an explicit admin action logged to `audit_log`.

### 5.8 Sequence: capture to signed finding

```
Engineer      Mobile app        API           S3         Queue        LLM        DB
   |              |               |            |            |           |          |
   |--speak/tap-->|               |            |            |           |          |
   |              |--upload_url-->|            |            |           |          |
   |              |<-signed_url---|            |            |           |          |
   |              |------PUT blob------------->|            |           |          |
   |              |--confirm----->|            |            |           |          |
   |              |               |--enqueue transcribe---->|           |          |
   |              |               |                         |--Whisper->|          |
   |              |               |                         |<--text----|          |
   |              |               |                         |------write segments->|
   |              |               |                         |--enqueue draft------>|
   |              |               |                         |---retrieve+prompt--->|
   |              |               |                         |<---finding JSON------|
   |              |               |                         |------write finding-->|
   |              |               |                                                |
Engineer opens web app, reviews drafts, edits, POST /audits/{id}/sign
```

### 5.9 Deployment topology

**Hackathon MVP (zero cost).**

- **Vercel free tier** hosts the Next.js app. One deploy, four route groups (`/capture`, `/(engineer)`, `/portal`, `/admin`), plus API routes for LLM calls.
- **Supabase free tier** provides Postgres, auth, file storage, realtime subscriptions. 500MB DB, 1GB storage, plenty for a demo.
- **Groq free tier** for the LLM (Llama 3.3 70B) and Whisper fallback. OpenAI-compatible API, blazing fast.
- **Browser SpeechRecognition** for transcription on Chrome/Edge, no service required.
- **GitHub free** for the repo.

Total ongoing cost: $0. All configuration lives in `.env.local` for dev and Vercel env vars for deploy.

**Production shape (post-hackathon).**

- Same Vercel + Supabase base (they scale a long way on paid tiers).
- Swap Groq for Anthropic Claude Sonnet when you need larger context or tool-use reliability.
- Add pgvector to Supabase for the standards library.
- Add Supabase Edge Functions or a small worker (BullMQ + Upstash Redis) for long-running LLM chains.
- Add Clerk if Supabase Auth becomes limiting.

**Why no FastAPI/Fly/Docker/Redis for the MVP.** Every hour spent on backend infra is an hour not spent on the demo. The Next.js API route pattern gives you server-side secrets and inline LLM calls with zero deployment overhead. Say this out loud in the pitch so judges know it's a deliberate choice, not a missing piece.

### 5.10 Repository layout (hackathon MVP)

Single Next.js repo, no monorepo, no separate services.

```
nti-copilot/
  app/                              # Next.js App Router
    (capture)/capture/page.tsx      # mobile-optimised capture screen
    (engineer)/audits/[id]/
      review/page.tsx               # draft findings review
      sign/page.tsx                 # sign-off page
    (portal)/portal/[customerId]/page.tsx
    (admin)/admin/page.tsx
    api/
      generate-finding/route.ts     # Groq LLM call
      transcribe/route.ts           # iOS Safari fallback
      standards/upload/route.ts     # ingest NTI PDF text (dev only)
    layout.tsx
    globals.css
  components/
    ui/                             # shadcn/ui
    capture/                        # RecordButton, PhotoButton, PillarPicker
    findings/                       # FindingCard, SeverityBadge, StandardRef
    charts/                         # BenchmarkChart, PortfolioHeatmap
  lib/
    supabase/                       # client + server helpers
    groq.ts                         # LLM client wrapper
    prompts/
      finding_v1.md
    standards.json                  # NTI standard clauses fixture
    fixtures/
      demo_customer.ts
      demo_peer_benchmarks.ts
  supabase/
    migrations/                     # SQL migrations
    seed.sql                        # demo data
  .env.local.example
  README.md
```

### 5.11 Trust and safety

Every LLM-generated finding starts at `status = 'draft'` and `created_by = 'llm'`. Only a signed row (`status = 'signed'`) can be published. The `audit_log` table records every edit with actor, timestamp and diff. Photos and audio are retained per NTI's existing retention policy. Standards library never crosses tenants. LLM prompts do not include cross-customer data. Model and prompt version are recorded per finding so if a prompt regresses we can replay affected findings.

### 5.12 What we do not build for the MVP

Explicitly out of scope for the hackathon so we can hit the demo. Named here so judges see we made deliberate cuts.

- SSO or SCIM integration with NTI's identity provider.
- Two-way sync with NTI's existing systems (claims, policy, CRM).
- Native iOS or Android app store builds. Expo Go on a demo phone is enough.
- Fine-grained RBAC beyond the three roles above.
- On-prem or Australian-region deployment (production concern, not a hackathon concern).
- Custom report PDF pixel-matching. Match the visual style, do not chase perfect parity.

---

## 6. Hackathon build plan

Assumed team of three, working roughly 24 to 36 hours.

### Hour 0 to 2. Validation and scope lock.
Call one NTI risk engineer or one audited fleet operator. Confirm the pain, confirm the four pillars, confirm the report shape. Lock the demo scope to one customer, one site, one pillar walkthrough end to end. Everything else is faked or stubbed for the demo.

### Hour 2 to 6. Skeleton and stubs.
Stand up the Next.js app with three routes (engineer, customer portal, admin). Stand up FastAPI with health check and one capture endpoint. Wire Postgres with the schema above. Seed one customer, one site, five NTI standard clauses in the vector store.

### Hour 6 to 14. Capture and transcription.
Build the mobile capture screen (Expo, one screen, record button, photo button, pillar picker). Wire uploads to signed URLs. Run Whisper on the audio. Land structured transcript segments in the DB against the capture event.

### Hour 14 to 22. Report generation.
Write the RAG prompt. For each observation, retrieve top standards, generate the finding fields, insert as `finding` rows. Render the draft report on the engineer web app in the same visual style as NTI's existing PDF.

### Hour 22 to 28. Customer portal and benchmarks.
Build the customer read-only view. Fake enough peer data to make benchmarks look real (this is a hackathon, be honest about the fixture in the pitch). Show a severity heatmap by pillar and a peer percentile chart.

### Hour 28 to 32. NTI portfolio dashboard.
Aggregate findings by customer and pillar. One chart, one filterable table. Include an "engineer capacity saved" counter, calculated from time-per-report before and after.

### Hour 32 to 36. Polish, demo script, pitch.
Rehearse the sixty-second wow arc: speak into the phone, watch the report generate, open the dashboard. Prepare a two-slide business model and one-slide validation summary that names the engineer or operator you spoke to.

### Cuttable if time slips
The mobile app can be a PWA on a laptop microphone. The benchmarking peer data can be fully fixture. The remediation tracker can be a static table. The customer portal can be a single page.

### Not cuttable
The end-to-end path from voice to structured finding to a signed-off report. That is the demo.

---

## 7. Tech stack summary

**Hackathon MVP, zero dollars, one codebase.**

| Layer | Choice | Why | Cost |
|---|---|---|---|
| Frontend | Next.js 15 (App Router) + shadcn/ui + Tailwind | One app, four route groups (capture, engineer, portal, admin), plus API routes | Free |
| "Mobile" | Same Next.js app at `/capture`, mobile-optimised | Browser MediaRecorder + camera input, no native code | Free |
| Hosting | Vercel | Click-deploy, edge functions, custom URL | Free tier |
| DB + Auth + Storage + Realtime | Supabase | Postgres with RLS, auth, file bucket, realtime subscriptions in one dashboard | Free tier |
| LLM | Groq (Llama 3.3 70B) | OpenAI-compatible API, extremely fast, generous free tier | Free |
| Transcription | Browser SpeechRecognition (Chrome/Edge), Groq Whisper as iOS fallback | On-device where possible, free hosted fallback | Free |
| Standards library | JSON file in repo, included in prompts | Skip pgvector for MVP, ten clauses fit in context | Free |
| Repo | GitHub | Standard | Free |

**Deliberate omissions for the MVP:** React Native/Expo, FastAPI, Redis, Docker, worker queues, pgvector, Clerk, S3 direct, Fly.io. Every one of those adds setup hours without moving the demo forward.

---

## 8. Business model

### 8.1 Revenue lines

**Line 1. Per-seat SaaS to NTI.** Price per risk engineer per month. The pitch is throughput. If three engineers currently deliver X audits per year and the tool lifts each to 3X, the tool pays for itself many times over in avoided hiring and travel.

**Line 2. Per-customer benchmarking subscription.** Audited fleet operators pay a modest annual fee for the portal, the peer benchmarks and the remediation tracker. This turns a one-off PDF into a live product relationship and gives NTI a reason to stay in front of the customer year-round.

**Line 3 (future). Anonymised risk data to underwriters.** Aggregated, anonymised fleet risk data sold or licensed internally to NTI underwriting and product. This is the moat and it only exists because the findings are structured.

### 8.2 Unit economics sketch

Assume NTI seat price of $500 per engineer per month scaling to 30 engineers, that is $180K ARR from NTI alone. Assume 200 audited operators at $2K per year for the portal, that is $400K ARR. Total north of $500K ARR in year one at modest penetration, with a defensible data moat forming underneath.

### 8.3 Why NTI cannot just build this internally

They could, and this is the honest counter. The answer is time, focus and product craft. NTI is an insurance business, not a software business. A dedicated hackathon team ships in weeks what an internal IT project ships in quarters, and the same product can be resold or licensed to other niche audit firms in adjacent verticals (marine, aviation ground handling, mining logistics) once proven at NTI.

### 8.4 Uniqueness

Nobody in the YC W25 through S26 cohorts, a16z Speedrun SR006, or the broader vertical-SaaS landscape is fusing voice-first field capture, structured audit findings, cross-customer benchmarking and a customer-facing portal in a single vertical stack. Each piece exists in isolation.

**Closest named competitors and how we differ.**

- **Denki (YC F25, $4.1M raised).** Automates internal financial audits (SOX 404, BSA/AML). Structural pattern is similar (99% software, structured audit data) but vertical is completely different. They live inside AuditBoard and Workiva. We live at the depot.
- **InspectMind AI (YC W24, $2.1M revenue).** AI plan check for construction drawings plus a generic Field Reports product. Stops at the report. No customer portal, no benchmarks, no portfolio view. Different vertical (AEC, not commercial motor).
- **Kebra (YC S26).** Voice-first field service operating layer for HVAC, plumbing, electricians. Same UX pattern, opposite end of the value chain (service execution vs risk audit).
- **Panta (YC W26).** AI commercial insurance broker automating 95% of back-office. Same industry, different function (they broker policies, we assess risk upstream). Complementary, not competing.

The bet is that fusion (field capture + structured audit spine + customer portal + vertical depth) targeted at niche high-expertise audit domains is the unique play.

### 8.5 Market tailwind

Two data points to cite on the moat slide:

- **46% of SaaS M&A activity in Q2 2025 was in vertical SaaS.** Consolidation is happening in the exact segment we're building in.
- **"Domain data is the single most valuable asset in 2026"** is the L40 / SaaS Mag consensus on vertical AI. Our structured findings database is that argument made concrete.

We are not fighting an unproven category. We are picking an unclaimed slice of a proven one.

---

## 9. Judging criteria alignment

Four judges, split 2 NTI and 2 QUT Entrepreneurship. Every criterion needs both.

**Validation.**
NTI angle. Named calls with two of the three NTI risk engineers and one audited operator. Match the four pillars exactly and reference NTI standard clauses in the demo.
QUT angle. One or two conversations with adjacent audit firms (marine surveyors, mining site auditors, aviation ground handling). Even a fifteen-minute call each earns the "we validated the pattern beyond one customer" line.

**Execution and Design.**
NTI angle. Match the visual style of NTI's existing PDF so judges recognise the output. Human sign-off must be visible in the demo, not just claimed.
QUT angle. Polish above features. Typography, spacing, empty states and the pitch deck itself get the last two hours, not more scope.

**Business Model.**
NTI angle. Clear ROI arithmetic. Three engineers becoming thirty in effective throughput. A data feed underwriting would pay to consume internally.
QUT angle. Two revenue lines from one build with a third behind the moat. Standards library plus structured findings plus benchmark cohort compound across customers. Every new audit firm added makes the peer benchmark more valuable for every existing customer. Data-network moat, not a workflow tool.

---

## 10. Risks and mitigations

**LLM hallucinates a finding.** Mitigation, every finding is draft until the engineer signs it, and every finding cites the standard clause it references so the engineer can verify in one click.

**Poor signal at depots.** Mitigation, offline-first mobile app with background sync.

**NTI standards are proprietary.** Mitigation, standards library is tenant-scoped and never leaves NTI's tenant. No cross-tenant leakage in the RAG prompt.

**"Amplify not replace" is a promise that must be visibly kept.** Mitigation, human sign-off is a hard gate, audit trail is visible, no auto-publish anywhere in the product.

---

## 11. What to demo, in order

1. Open the mobile app on a phone. Select "Acme Transport, Brisbane Depot".
2. Walk to a mock asset. Tap "Asset Management", speak an observation, snap a photo.
3. Tap "Complete walkaround".
4. Switch to laptop. Draft report has generated, structured to NTI's four pillars, with the observation cited against a standard clause.
5. Edit one sentence, click Sign Off.
6. Open the customer portal. Show the finding, the severity, the peer benchmark.
7. Open the NTI admin dashboard. Show the same finding rolled up into the portfolio view and the "engineer hours saved" counter.

Ninety seconds, three screens, one clear story.

---

## 12. Next actions for the team

1. Book calls with two NTI risk engineers and one audited operator this week.
2. Book one short call with an adjacent audit firm (marine, mining or aviation) for the QUT market slide.
3. Get a copy of a redacted NTI audit report and the audit template.
4. Assign one owner to mobile, one to backend and RAG, one to web and dashboards.
5. Lock the demo script before writing code so the build serves the pitch, not the other way around.

---

## 13. Competitive positioning against the other two NTI teams

**The situation.** Two other teams are building for NTI. One group of six, one group of three. Both are almost certainly attacking the same brief we are.

**Their likely angle.** The most obvious AI-shaped bullet on NTI's brief is "manual reporting". Expect one or both teams to build a capture-to-report tool along the InspectMind pattern. The group of six will out-feature and out-polish us on that angle by sheer manpower.

**Why we do not fight there.** Feature-for-feature we lose. Instead we headline a different bullet on the same brief.

**Our angle.** Bullet 3, "insights stay siloed", reframed as the data spine. Capture is still in the demo because it looks great on stage, but the pitch narrative is the structured findings database, the customer benchmarking portal, and the NTI portfolio view. That is the story judges remember after thirty minutes of pitches.

**How to reinforce the difference in the pitch.**
- Open with the data-spine one-liner, not with the mobile app.
- Show capture for thirty seconds max. Spend the rest of the demo on the customer portal and NTI portfolio dashboard.
- Say the exact sentence, "Everyone else automates the report. We turn every audit NTI has ever done into a live risk data product."
- Land the moat sentence, "Every new customer we add makes the peer benchmark more valuable for every existing customer."

**If we learn what the other teams are actually building.**
Chat to them at lunch or ask organisers. If they are building capture-to-report as expected, hold the current plan. If either surprises us and heads for the benchmarking angle, pivot the demo emphasis to the remote pre-audit triage angle (bullet 1, cut engineer travel time via dashcam and telematics scoring). Both angles share the same backend so the pivot cost is only the demo script.
