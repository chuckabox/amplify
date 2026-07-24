# RiskGate Implementation Plan

Hour-by-hour, file-by-file build guide for the RiskGate hackathon MVP. Team of 3, 24 to 36 hours, zero dollars spent. This document assumes you have already read `nti-riskgate-plan.md` and `decisions.md`.

Working directory in commands is the repo root.

---

## 0. Goals of this document

Turn the RiskGate strategy into an executable plan any of the three teammates can pick up and start on. Every hour block below specifies:

- Which teammate is doing what
- Which files are being created or touched
- The concrete acceptance test that lets you say "done"

If you finish an hour block early, skip to the next task for your role. Do not silently expand scope.

---

## 1. Stack recap (zero cost)

| Layer | Choice | Notes |
|---|---|---|
| Web | Next.js 15 (App Router) + Tailwind + shadcn/ui | One codebase, two route groups |
| Auth | Supabase Auth | Email magic link for hackathon |
| DB | Supabase Postgres | RLS on tenant_id, no pgvector for MVP |
| Storage | Supabase Storage | One bucket, RLS by tenant |
| Realtime | Supabase Realtime | For live routing on engineer dashboard |
| LLM text | Groq (Llama 3.3 70B via OpenAI-compatible endpoint) | Free tier, fast |
| LLM vision | Google Gemini 2.0 Flash | Free tier, strong at image analysis |
| Transcription | Not needed (no voice for RiskGate) | Skipped |
| Hosting | Vercel | Free tier, one deploy |
| Repo | GitHub | Free |

**Explicit non-choices for MVP:** FastAPI, Redis, RQ, Docker, Fly.io, Clerk, Anthropic API, pgvector, real vector embeddings, perceptual hashing, telematics integration, live video calling, native mobile.

---

## 2. Team roles

Three teammates. Assign one owner per role. Cross-help is welcome but ownership is single-threaded.

- **Dev A (Capture and Vision).** Owns the operator side. Guided-audit capture screen, camera integration, upload flow, Gemini vision analysis.
- **Dev B (Triage and API).** Owns the brain. Next.js API routes, Groq scoring, hard-gate rules, trust scoring, tier routing, findings drafting.
- **Dev C (Dashboards and Polish).** Owns the engineer side and the demo. Engineer queue, portfolio view, operator dashboard, landing page, pitch deck, demo data seed, rehearsal.

---

## 3. Pre-clock setup (30 min if possible before hackathon starts)

Do these once, ideally before hour zero, so nobody wastes the first hour on account creation.

1. **GitHub repo.** Create `riskgate` (private). Add all three as collaborators.
2. **Vercel project.** Connect GitHub repo. Enable auto-deploy from `main`.
3. **Supabase project.** Create free-tier project in the Sydney region if available. Note the project URL, anon key, service role key.
4. **Groq account.** Sign up, get API key. Note free-tier rate limits.
5. **Google AI Studio.** Sign up, enable Gemini API, get API key.
6. **Local env.** Everyone clones the repo and creates `.env.local` from `.env.local.example` (added at hour 0).

---

## 4. Hour-by-hour build plan

### Hours 0 to 2 — Foundation (all three, in parallel)

**Dev A:** Scaffold Next.js app.
```bash
npx create-next-app@latest riskgate --typescript --tailwind --app --src-dir --import-alias "@/*"
cd riskgate
npx shadcn@latest init
npx shadcn@latest add button card input label textarea badge progress table dialog
```
Commit and push. Confirm Vercel auto-deploys and the default page is live.

**Dev B:** Supabase schema and Next.js server client.
- Install: `npm install @supabase/supabase-js @supabase/ssr`
- Create `supabase/migrations/0001_init.sql` with the schema from section 5 below.
- Run migrations against the Supabase project.
- Create `lib/supabase/server.ts` and `lib/supabase/client.ts` following the standard SSR pattern.
- Add `.env.local.example` with all keys.

**Dev C:** Layout, nav, empty routes.
- Create route groups: `app/(operator)/`, `app/(engineer)/`, `app/(marketing)/`.
- Landing page at `app/(marketing)/page.tsx` with a hero, one-line pitch and two CTAs ("I'm an operator" and "I'm an NTI engineer") that link to the two dashboards.
- Empty dashboards at `app/(operator)/dashboard/page.tsx` and `app/(engineer)/queue/page.tsx` that render "coming soon".

**Acceptance test at hour 2.** Vercel deploy is live. Landing page renders. Both dashboards render placeholder text. Supabase has the schema, verified in the Supabase table view.

---

### Hours 2 to 6 — Auth, seed, and API skeletons

**Dev B (lead) + Dev A (helper):**
- Wire up Supabase Auth. Magic link only, no email verification for demo (Supabase has a setting for this).
- Create three demo users manually in the Supabase dashboard: `operator@demo.com`, `engineer@demo.com`, `admin@demo.com`. Add a `user_role` column on `auth.users` metadata or use a `user_profile` table with `role`.
- Create middleware in `middleware.ts` that redirects unauthenticated users to `/login` and routes them to the right dashboard based on role after login.
- Create `supabase/seed.sql` with three operators, one policy each, one audit each, five NTI standard clauses. See section 6 below.

**Dev A (lead):**
- Create Supabase Storage bucket `evidence`. Add RLS policy: users can insert to path `${their_tenant_id}/*`, and read from same.
- Create helper `lib/supabase/storage.ts` with `getSignedUploadUrl(auditId, kind)` function.

**Dev C:**
- Build shared UI: `<PillarBadge pillar={p}/>`, `<TierBadge tier={n}/>`, `<SeverityBadge severity={n}/>`, `<TrustScore score={x}/>`.
- Skeleton the engineer queue table (empty state and mock row).

**Acceptance test at hour 6.** Login as `engineer@demo.com`, land on `/queue`, see three mock audits from seed data. Login as `operator@demo.com`, land on `/dashboard`, see one active audit.

---

### Hours 6 to 14 — Capture screen and vision (Dev A leads, Dev B in parallel)

**Dev A (Capture screen).**

Path: `app/(operator)/audit/[id]/capture/page.tsx`.

Structure:
- Top: audit meta (operator name, site).
- Pillar picker: four buttons for the four NTI pillars.
- For the selected pillar: a checklist of required items (e.g. "Photo of front tyre tread", "Photo of load restraint on rig 12", "Answer: date of last service").
- Each item has a big "Add photo" button that opens the camera, and a preview once added.
- "Submit" button becomes active only when all mandatory items are captured.

Camera capture: use `<input type="file" accept="image/*" capture="environment" />` for maximum compatibility. Preview with `URL.createObjectURL`.

Upload flow:
1. On file selected, call `POST /api/upload-url` to get a signed URL.
2. PUT the file directly to Supabase Storage using the signed URL.
3. On success, insert a row into `submission_item` with the S3 key, GPS (from `navigator.geolocation`), timestamp, and pillar.
4. Show green checkmark next to the item.

On Submit: call `POST /api/submissions` which finalises the submission and enqueues triage (see Dev B).

**Dev B (Vision API and triage stubs).**

Create `app/api/upload-url/route.ts` returning a signed upload URL scoped to the current user's tenant.

Create `lib/gemini.ts`:
```typescript
// Wraps Google AI Studio Gemini 2.0 Flash for vision analysis.
export async function analysePhoto(imageUrl: string, pillar: string, requiredItem: string) {
  // Fetches the image, sends to Gemini with a structured JSON schema prompt
  // Returns { tags: string[], risk_indicators: string[], confidence: number, legible: boolean }
}
```

Prompt template (`lib/prompts/vision_v1.md`):
```
You are an NTI risk audit vision analyst. Analyse this photo submitted for a transport depot audit.

Pillar: {{pillar}}
Required item: {{required_item}}

Return strict JSON:
{
  "legible": boolean,   // is the photo clear enough to assess
  "shows_required_item": boolean,
  "tags": string[],     // observed features, e.g. "tyre_tread_worn", "oil_leak_visible", "signage_present"
  "risk_indicators": string[],  // observed risks, e.g. "tread_below_1.6mm"
  "confidence": number  // 0..1
}

Do not include prose outside the JSON.
```

Create `app/api/vision/analyse/route.ts` that calls `analysePhoto` and writes results to `submission_item.vision_tags` and `submission_item.vision_confidence`.

For MVP, run vision inline when the client uploads (single API call, wait for result). Show a "Analysing..." spinner on the client. Vision takes 2 to 5 seconds per photo.

**Acceptance test at hour 14.** Open the capture screen on a phone browser. Add three photos for one pillar. Watch each analysed with a spinner. Submit the audit. Confirm rows appear in `submission_item` with vision tags populated.

---

### Hours 14 to 22 — Triage engine (Dev B leads, Dev A helps)

This is the centrepiece and where most of the pitch hangs. Build it deliberately.

**Dev B: Triage API route.**

Create `app/api/triage/[submissionId]/route.ts`:

```typescript
// POST /api/triage/:submissionId
// Runs the triage pipeline: hard-gate rules -> LLM scoring -> tier routing.
// Writes triage_result row and returns { tier, reason, pillar_scores }.
```

Pipeline steps:

**Step 1. Trust signals.**
Create `lib/triage/trust.ts` with `computeTrustSignals(submissionId): TrustSignal`.
For MVP compute:
- `exif_present` (check the uploaded file had metadata, store during upload)
- `gps_consistent` (all photos within 500m of each other)
- `timestamps_fresh` (all captured within last 4 hours)
- `workshop_attested` (fixture flag on the submission)
- `trust_score` = weighted sum, clamped 0..1

Store in `trust_signal` table.

**Step 2. Hard-gate rules.**
Create `lib/triage/rules.ts`:
```typescript
export function applyHardGates(submission, items, trust): HardGateResult {
  // Returns { forcedTier: 1|2|3|null, reasons: string[] }
  // Rules:
  //  - Any mandatory item missing -> forced Tier 2
  //  - Any illegible photo -> forced Tier 2
  //  - trust_score < 0.4 -> forced Tier 2
  //  - trust_score < 0.2 -> forced Tier 3
  //  - Any explicit risk_indicator matching a "critical" list -> forced Tier 3
}
```

**Step 3. LLM scoring.**
Create `lib/triage/score.ts`:
```typescript
export async function scoreWithLLM(submission, items, standards): Promise<{
  pillar_scores: Record<Pillar, number>,
  overall_score: number,
  recommended_tier: 1|2|3,
  routed_reason: string
}> {
  // Call Groq with strict JSON schema prompt.
  // Include all vision tags, form answers, all NTI standard clauses inline (small enough).
}
```

Prompt template (`lib/prompts/triage_v1.md`):
```
You are NTI's AI risk audit triage engine. Score this submission per pillar and recommend a tier.

Operator: {{operator_name}}
Fleet size: {{fleet_size}}
Trust score: {{trust_score}}

Evidence:
{{formatted_items}}

NTI standard clauses (excerpts):
{{formatted_standards}}

Return strict JSON:
{
  "pillar_scores": {
    "people_capability": <1-5>,
    "asset_management": <1-5>,
    "emergency_incident": <1-5>,
    "site_safety_security": <1-5>
  },
  "overall_score": <1-5 decimal>,
  "recommended_tier": <1|2|3>,
  "routed_reason": "<one-sentence human-readable explanation>"
}

Tier rules:
- 1 (auto-clear to spot-check): overall_score <= 2.0 AND trust_score >= 0.7
- 2 (request video verification): overall_score 2.1-3.5 OR trust_score 0.4-0.7
- 3 (in-person visit): overall_score >= 3.5 OR any pillar_score = 5

Do not include prose outside the JSON.
```

**Step 4. Reconcile and persist.**
Create `lib/triage/reconcile.ts`:
```typescript
// Combines hard-gate forcedTier with LLM recommended_tier.
// Forced tier always wins over LLM recommendation if higher (never lower).
// Writes triage_result row with both results and the final tier.
```

**Step 5. Draft findings for escalated audits.**
If tier >= 2, immediately call `POST /api/findings/draft` which uses Groq to draft `finding` rows for each visible issue, all `status = 'draft'`.

**Dev A: Wire triage into the submit flow.**
After the operator submits, call `POST /api/triage/[submissionId]`. Show a "Reviewing your submission..." UI while it runs (roughly 3 to 8 seconds). On response, redirect the operator to a result page showing the tier and the routed_reason.

Result page paths:
- Tier 1: `app/(operator)/audit/[id]/cleared/page.tsx` — "Your audit has cleared. NTI may spot-check some evidence."
- Tier 2: `app/(operator)/audit/[id]/video-requested/page.tsx` — "NTI has requested a short video. Please film the following items..."
- Tier 3: `app/(operator)/audit/[id]/escalated/page.tsx` — "An NTI engineer will visit your site to complete this audit."

**Acceptance test at hour 22.** Submit three seeded audits, one at each tier. Confirm each routes correctly, writes `triage_result` with a readable `routed_reason`, and lands the operator on the right result page. Timing: end-to-end submission to result page under 10 seconds.

---

### Hours 22 to 28 — Two dashboards (Dev C leads, Dev B helps)

**Dev C: Engineer queue.**

Path: `app/(engineer)/queue/page.tsx`.

Layout:
- Top: metric row. "Audits this week: 12", "Auto-cleared: 8", "Video verified: 3", "In-person visits saved: 8", "Engineer hours saved: 24".
- Main table: one row per audit. Columns: Operator, Fleet size, Tier badge (green/amber/red), Overall score, Routed reason, Status, Action button ("Spot-check" / "Review video" / "Assign visit").
- Filter chips: All / Tier 1 / Tier 2 / Tier 3.
- Realtime: subscribe to `audit` table via Supabase Realtime so new submissions pop in live during the demo.

Path: `app/(engineer)/audit/[id]/review/page.tsx`.

Layout:
- Left column: audit meta, operator, tier, all evidence (photos in a grid).
- Right column: draft findings (severity, observation, recommendation, cited clause). Each editable inline.
- Trust signals panel: green/red checkmarks per signal.
- Bottom: "Sign Off" button (only enables when all findings reviewed).

Path: `app/(engineer)/portfolio/page.tsx`.

Layout:
- Severity heatmap by pillar (Recharts).
- Bar chart: audits by tier, this month.
- Table: top 10 operators by risk score.
- Big number: engineer hours saved this month.

**Dev C: Operator dashboard.**

Path: `app/(operator)/dashboard/page.tsx`.

Layout:
- Top card: policy summary (mileage, premium, next audit due date, big "Run Guided Audit" button).
- Middle: current audit status card (which tier, status, what's needed next).
- Bottom: past findings, remediation tracker, benchmark chart.

Path: `app/(operator)/audit/[id]/findings/page.tsx`.

Layout:
- List of signed findings with severity, evidence photo, recommendation, remediation status.
- Peer benchmark chart: "Your fleet is in the 60th percentile for Asset Management" (fixture data).

**Dev B (helper):**
- Backfill any missing API routes the dashboards need (list endpoints for findings, audits, benchmarks).
- Add fixture peer benchmark data to `lib/fixtures/benchmarks.ts`.

**Acceptance test at hour 28.** Login as engineer, see three seeded audits in the queue with correct tier badges. Click one, see evidence and draft findings, edit one field, click Sign Off. Login as operator, see policy card, active audit, past findings.

---

### Hours 28 to 32 — Polish, demo data, landing page

**Dev C (lead):**
- Landing page (`app/(marketing)/page.tsx`): hero with the one-liner, three-panel visual (phone capture, engineer dashboard, operator portal), business model teaser, team names, "Try the demo" CTAs. Copy paste from `nti-riskgate-plan.md` TL;DR.
- Empty states across all dashboards. Loading skeletons.
- Typography pass. Tailwind spacing pass. Dark mode toggle (nice to have, only if time).
- Update `supabase/seed.sql` with three named operators, three audits pre-loaded (one at each tier), realistic photos (use stock images tagged appropriately or take real depot-style photos yourselves).

**Dev A (lead):**
- Mobile capture screen polish. Big buttons, clear pillar navigation, satisfying "photo captured" animation.
- Loading and error states on the capture screen. Handle bad network gracefully.
- Test on an actual iPhone Safari and Android Chrome. Fix breakage.

**Dev B (lead):**
- Prompt tuning. Feed the vision model 10 test photos and the triage LLM 10 test submissions. Adjust prompts until routing feels sensible.
- Add rate-limit backoff for Groq (retry with exponential backoff on 429).
- Cache demo-data LLM outputs in `lib/fixtures/cached_triage.json` so the demo does not hit Groq live for the pre-seeded audits (protect against rate limit during pitch).

**Acceptance test at hour 32.** Full end-to-end demo works on stage. Landing page loads under 2 seconds. Capture works on a real phone. Triage runs and routes in under 10 seconds. All three tiers demonstrated. No console errors.

---

### Hours 32 to 36 — Rehearsal and slides

**Dev C (lead):**
- Pitch deck. Four slides: (1) the problem in one image, (2) the one-line pitch and three-panel product visual, (3) live demo, (4) business model + team + contact.
- Rehearse the pitch three times. Time it. Cut anything that pushes over 3 minutes.
- Record a 60-second screen capture of the demo as the fallback video.
- Prepare Q&A cheat sheet from `demo-script.md`.

**Dev A and Dev B:**
- Bug bash. Test every path on every role.
- Load test the demo: submit an audit while the engineer dashboard is open and confirm it appears live.
- Confirm all seeded LLM responses are cached and will not hit rate limits during the pitch.
- Confirm both demo phones and laptop are on the same WiFi and can reach the Vercel deployment.

**Acceptance test at hour 36 (or whenever you stop):** Three full rehearsals with a stopwatch. Fallback video works. All demo data seeded. All API keys in Vercel env vars. `main` branch deployed.

---

## 5. Full Supabase schema (`supabase/migrations/0001_init.sql`)

```sql
-- Enable RLS-friendly extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenants and user profiles
CREATE TABLE tenant (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('nti','operator','workshop')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE user_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  role TEXT NOT NULL CHECK (role IN ('operator_user','nti_engineer','nti_admin','workshop_user')),
  display_name TEXT
);

-- Operators (audited fleets) and their policies
CREATE TABLE operator (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  name TEXT NOT NULL,
  industry_code TEXT NOT NULL DEFAULT 'road_freight',
  fleet_size INT,
  region TEXT
);

CREATE TABLE policy (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID NOT NULL REFERENCES operator(id),
  premium_annual NUMERIC,
  odometer_total_km NUMERIC,
  next_audit_due DATE,
  last_audit_id UUID
);

-- Workshops (fixture only for MVP)
CREATE TABLE workshop (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  name TEXT NOT NULL,
  region TEXT,
  trust_weight NUMERIC DEFAULT 1.0
);

-- Audits move through tiers
CREATE TABLE audit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id UUID NOT NULL REFERENCES operator(id),
  tier INT NOT NULL DEFAULT 1 CHECK (tier BETWEEN 1 AND 3),
  status TEXT NOT NULL CHECK (status IN
    ('open','submitted','triaged','video_requested','escalated',
     'in_person_scheduled','signed','published')),
  engineer_id UUID REFERENCES user_profile(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  signed_at TIMESTAMPTZ,
  signed_by UUID REFERENCES user_profile(id),
  published_at TIMESTAMPTZ
);

-- A submission is one round of evidence
CREATE TABLE submission (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID NOT NULL REFERENCES audit(id),
  tier INT NOT NULL,
  submitted_by TEXT NOT NULL CHECK (submitted_by IN ('operator','workshop','engineer')),
  workshop_id UUID REFERENCES workshop(id),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  client_submission_id TEXT UNIQUE
);

-- One piece of evidence
CREATE TABLE submission_item (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submission(id),
  pillar TEXT NOT NULL CHECK (pillar IN
    ('people_capability','asset_management','emergency_incident','site_safety_security')),
  kind TEXT NOT NULL CHECK (kind IN ('photo','video','form_field')),
  storage_path TEXT,
  form_key TEXT, form_value TEXT,
  gps_lat NUMERIC, gps_lon NUMERIC,
  captured_at TIMESTAMPTZ,
  exif_json JSONB,
  vision_tags JSONB,
  vision_confidence NUMERIC
);

-- Trust signals per submission
CREATE TABLE trust_signal (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submission(id),
  exif_present BOOLEAN,
  gps_consistent BOOLEAN,
  timestamps_fresh BOOLEAN,
  workshop_attested BOOLEAN,
  trust_score NUMERIC
);

-- Triage decision
CREATE TABLE triage_result (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submission(id),
  pillar_scores JSONB NOT NULL,
  overall_score NUMERIC NOT NULL,
  recommended_tier INT NOT NULL CHECK (recommended_tier BETWEEN 1 AND 3),
  routed_reason TEXT NOT NULL,
  hard_gate_reasons TEXT[],
  model TEXT,
  prompt_version TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- NTI standards (no pgvector, plain text)
CREATE TABLE standard_clause (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenant(id),
  source TEXT NOT NULL,
  clause_ref TEXT NOT NULL,
  pillar TEXT NOT NULL,
  heading TEXT NOT NULL,
  body TEXT NOT NULL
);

-- Structured findings
CREATE TABLE finding (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID NOT NULL REFERENCES audit(id),
  pillar TEXT NOT NULL,
  observation_text TEXT NOT NULL,
  evidence_item_ids UUID[] NOT NULL DEFAULT '{}',
  standard_clause_ref TEXT,
  severity INT NOT NULL CHECK (severity BETWEEN 1 AND 5),
  recommendation_text TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN
    ('draft','engineer_edited','signed','remediated','accepted_risk')),
  created_by TEXT NOT NULL CHECK (created_by IN ('llm','engineer')),
  reviewed_by UUID REFERENCES user_profile(id),
  signed_at TIMESTAMPTZ,
  llm_model TEXT,
  llm_prompt_version TEXT
);
CREATE INDEX ON finding (audit_id, pillar);

-- Remediation tracking
CREATE TABLE remediation_action (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  finding_id UUID NOT NULL REFERENCES finding(id),
  owner_user UUID REFERENCES user_profile(id),
  target_date DATE,
  status TEXT NOT NULL CHECK (status IN ('open','in_progress','closed','overdue')),
  evidence_url TEXT,
  closed_at TIMESTAMPTZ
);

-- Enable RLS on every table
ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_signal ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE standard_clause ENABLE ROW LEVEL SECURITY;
ALTER TABLE finding ENABLE ROW LEVEL SECURITY;
ALTER TABLE remediation_action ENABLE ROW LEVEL SECURITY;

-- Simple policies: engineers see all under NTI tenant, operators see own
-- (Expand these in migration 0002 if time allows)
CREATE POLICY "engineers see all" ON audit FOR SELECT
  USING (
    (SELECT role FROM user_profile WHERE id = auth.uid()) IN ('nti_engineer','nti_admin')
  );

CREATE POLICY "operators see own" ON audit FOR SELECT
  USING (
    operator_id IN (
      SELECT o.id FROM operator o
      JOIN user_profile p ON p.tenant_id = o.tenant_id
      WHERE p.id = auth.uid()
    )
  );
```

---

## 6. Demo seed data (`supabase/seed.sql`)

```sql
-- One NTI tenant, three operator tenants, one workshop
INSERT INTO tenant (id, name, kind) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NTI', 'nti'),
  ('00000000-0000-0000-0000-000000000002', 'Acme Transport', 'operator'),
  ('00000000-0000-0000-0000-000000000003', 'Northern Freight', 'operator'),
  ('00000000-0000-0000-0000-000000000004', 'Highway Haulage', 'operator'),
  ('00000000-0000-0000-0000-000000000005', 'Brisbane Truck Workshop', 'workshop');

-- Three operators, three policies
INSERT INTO operator (id, tenant_id, name, industry_code, fleet_size, region) VALUES
  ('a1000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Acme Transport', 'road_freight', 45, 'QLD'),
  ('a1000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', 'Northern Freight', 'road_freight', 120, 'NT'),
  ('a1000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004', 'Highway Haulage', 'road_freight', 15, 'NSW');

INSERT INTO policy (operator_id, premium_annual, odometer_total_km, next_audit_due) VALUES
  ('a1000000-0000-0000-0000-000000000001', 285000, 2100000, '2026-08-15'),
  ('a1000000-0000-0000-0000-000000000002', 640000, 6800000, '2026-08-22'),
  ('a1000000-0000-0000-0000-000000000003', 92000, 780000, '2026-08-08');

-- Five NTI standard clauses (real language, redacted or paraphrased)
INSERT INTO standard_clause (tenant_id, source, clause_ref, pillar, heading, body) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NTI Audit Template v3.2', 'AM-4.2.1', 'asset_management', 'Tyre condition', 'All tyres must have minimum 1.6mm tread depth across the central three-quarters of the tyre width. Cuts or bulges are non-conformances requiring immediate action.'),
  ('00000000-0000-0000-0000-000000000001', 'NTI Audit Template v3.2', 'AM-3.1.4', 'asset_management', 'Brake system', 'Brake pads must have minimum 3mm friction material remaining. Air lines must show no visible corrosion or leaks.'),
  ('00000000-0000-0000-0000-000000000001', 'NTI Audit Template v3.2', 'EI-2.3.1', 'emergency_incident', 'Fire equipment', 'Fire extinguishers must be inspected within the past 12 months and mounted in accessible locations at all depot buildings.'),
  ('00000000-0000-0000-0000-000000000001', 'NTI Audit Template v3.2', 'SS-1.4.2', 'site_safety_security', 'Load restraint', 'Loads must be secured per NTC Load Restraint Guide 2018. Restraints must be inspected before each departure.'),
  ('00000000-0000-0000-0000-000000000001', 'NTI Audit Template v3.2', 'PC-2.1.3', 'people_capability', 'Driver fatigue management', 'Drivers must complete accredited fatigue management training every 24 months. Records must be maintained on file.');

-- Three audits pre-seeded, one at each tier
INSERT INTO audit (id, operator_id, tier, status) VALUES
  ('aa000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 1, 'signed'),
  ('aa000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000002', 2, 'video_requested'),
  ('aa000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000003', 3, 'escalated');

-- Pre-computed triage results for the three seeded audits (used to protect demo from rate limits)
-- Insert submission, submission_item, triage_result rows for each.
-- (Fill these in during hour 32 polish phase.)
```

---

## 7. Environment variables

`.env.local.example`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# LLM
GROQ_API_KEY=gsk_xxx
GEMINI_API_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=https://riskgate.vercel.app
```

Add all of these as Vercel environment variables for the `production` environment.

---

## 8. Key API routes reference

| Route | Method | Purpose |
|---|---|---|
| `/api/upload-url` | POST | Return Supabase Storage signed upload URL |
| `/api/submissions` | POST | Finalise submission, kick off triage |
| `/api/vision/analyse` | POST | Run Gemini vision on a photo |
| `/api/triage/[submissionId]` | POST | Full triage pipeline |
| `/api/findings/draft` | POST | Draft findings for escalated audits |
| `/api/audits/[id]/sign` | POST | Engineer sign-off |
| `/api/audits/[id]/request-video` | POST | Tier 2 video request |
| `/api/portal/benchmarks` | GET | Fixture peer benchmarks |
| `/api/admin/portfolio` | GET | Aggregated portfolio for engineer view |

Every route validates JWT via Supabase server client and enforces role. Non-mutating GETs on operator data only return rows for the caller's tenant.

---

## 9. Testing checklist (run before each rehearsal)

**Happy paths.**
- [ ] New operator can log in and see their dashboard.
- [ ] Operator can start an audit and reach the capture screen.
- [ ] Capture screen works on iPhone Safari and Android Chrome.
- [ ] Photos upload successfully with GPS captured.
- [ ] Vision analysis returns tags for a typical depot photo.
- [ ] Triage runs end to end in under 10 seconds.
- [ ] Tier 1 audit clears to spot-check queue.
- [ ] Tier 2 audit shows video-request page to operator, appears in engineer queue.
- [ ] Tier 3 audit escalates, appears in engineer queue with all evidence pre-loaded.
- [ ] Engineer can review, edit findings, sign off.
- [ ] Signed audit updates operator portal in realtime.

**Failure paths.**
- [ ] Missing mandatory photo forces Tier 2 (hard gate).
- [ ] Low trust score forces Tier 2 or 3.
- [ ] Groq rate limit gracefully falls back to cached demo response.
- [ ] Vision timeout does not crash the submit flow.
- [ ] Network drop during upload retries automatically.

**Demo-critical.**
- [ ] Three seeded audits render correctly in engineer queue.
- [ ] "Engineer hours saved" counter shows a believable number.
- [ ] Landing page is visually polished.
- [ ] Fallback demo video plays.

---

## 10. Rehearsal script (from `demo-script.md`)

Rehearse three times before pitching. Time each run with a stopwatch.

Target: 3 minutes 15 seconds (leaves 45 seconds for opening and closing).

**Roles:**
- Speaker: Dev C (drives narrative, holds nothing on stage but the mic).
- Phone handler: Dev A (holds phone, taps buttons on speaker's cue).
- Laptop handler: Dev B (switches tabs on speaker's cue).

**Key beats to nail:**
- The "three submissions in, one visit out" moment (this is the whole pitch).
- The trust-signals panel visible on the escalated audit (proves you thought about gaming).
- The engineer hours saved counter (concrete ROI number).

---

## 11. Fallback and contingency plans

**WiFi dies.** Play the 60-second backup screen recording. Keep talking over it.

**Groq rate-limited.** Cached responses for the three seeded audits will still work. Say "we're using our seed data because live rate limits during demos are the enemy" if asked.

**Gemini rate-limited.** Vision falls back to fixture tags stored in `lib/fixtures/vision.ts`. Same script.

**Vercel deploy broken.** Have `npm run dev` running on the demo laptop as fallback. Show localhost.

**Camera does not open on phone.** Fall back to laptop demo. Use laptop webcam to snap a "photo" of a printed depot image.

**Login broken.** Have all three demo users logged in already before you walk on stage. Do not log out.

---

## 12. Post-hackathon backlog (do not build during hackathon)

Listed so you can honestly answer "what's next" when judges ask.

- Real pgvector embeddings for standards library.
- Real perceptual hashing for duplicate detection.
- Telematics integration (start with Geotab, Motive).
- Live video calling for Tier 2 verification.
- Workshop network onboarding flow and payments.
- SSO integration with NTI's identity provider.
- Native mobile via React Native (only if operator adoption stalls on web).
- Fine-grained RBAC beyond the four roles.
- Multi-region deployment for data residency.
- Underwriter-facing data licensing product.

---

## 13. Definition of "done" for the hackathon

You are shippable when:

1. Vercel deployment URL loads on any device on any network.
2. The three demo users can log in with magic link.
3. A new audit can be submitted end to end from a phone, and routes correctly.
4. Three pre-seeded audits render in the engineer queue with correct tier badges.
5. Engineer can sign off an escalated audit and the operator portal reflects it.
6. Fallback video exists and plays.
7. Pitch deck is 4 slides and rehearsed under 3 minutes.
8. Team knows the answers to all 8 Q&A questions in `demo-script.md`.

Ship it.
