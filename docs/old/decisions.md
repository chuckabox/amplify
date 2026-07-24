# Decisions Log

Running record of strategic and technical decisions for the NTI Risk Engineer Copilot hackathon build. Read this before making a new choice that touches an existing one. Append, do not rewrite history.

---

## Hackathon context

- **Hackathon organiser:** QUT Entrepreneurship
- **Client brief:** NTI Risk Engineering
- **Judges:** 4 total, 2 from NTI, 2 from QUT Entrepreneurship
- **Team size:** 3
- **Build time:** 24 to 36 hours
- **Competing teams on the same NTI brief:** one team of 6, one team of 3
- **Sponsor tech required:** none

---

## Product decisions

### D1. Positioning is data spine, not capture-to-report

**Decision.** Headline the pitch on "we turn every audit NTI has ever done into a live risk data product". Capture is the demo moment but not the story.

**Why.** Other NTI teams almost certainly attack "manual reporting" (the obvious AI-shaped bullet) and build capture-to-report tools. We lose that fight on manpower. Attacking "insights stay siloed" (bullet 3) differentiates and hits both judge groups.

**Consequence.** Customer portal and NTI admin dashboard get equal or more demo time than capture. The pitch opener is the data-spine one-liner, not the mobile app.

---

### D2. NTI is the beachhead, not the entire market

**Decision.** Frame NTI as launch customer. Pitch expansion into marine surveyors, mining site auditors, aviation ground handling.

**Why.** NTI judges want their problem solved. QUT judges want a venture with a market beyond one customer. Both satisfied with one sentence.

**Consequence.** Validation slide has two rows. Row one is NTI conversations. Row two is one 15-minute chat with an adjacent audit firm.

---

### D3. "Amplify not replace" is a hard product constraint

**Decision.** Every LLM output is `status = 'draft'` until an engineer signs it. Human sign-off gate is enforced in schema, visible in UI, mentioned in pitch.

**Why.** NTI put that exact phrase on the brief. Any team pitching "AI replaces the engineer" loses NTI judges instantly.

**Consequence.** Demo must show the sign-off click, not just claim it. Audit trail visible.

---

### D4. Turnkey product, zero NTI-side integration for MVP

**Decision.** No SSO, no ingestion from NTI systems, no change to their tooling. Onboard with a folder of NTI standards PDFs and a shared login.

**Why.** In our NTI conversation the rep confirmed NTI is stretched across many initiatives and cannot resource internal build. Our pitch line becomes "you told us you cannot build this internally right now. We ship it as a product, not a project."

**Consequence.** MVP does not touch enterprise auth, integrations, or on-prem deployment. Those go on the "what's next" slide.

---

### D5. Target variant is V3 (full three-surface product)

**Decision.** Build capture + engineer review + customer portal with peer benchmarks + NTI admin dashboard. V2 (drop admin) is the fallback if hours slip.

**Why.** V3 scored 8.4 on the honest hackathon-idea evaluation. V2 scored 8.0. V4 (add remote pre-audit) and V6 (native mobile) both dominated by V3, do not build.

**Consequence.** Cut list in priority order if we run out of time: NTI admin dashboard first, then peer benchmarks, then customer portal. Keep engineer capture + review + sign-off no matter what.

---

## Tech decisions

### T1. Web-only, no native mobile

**Decision.** Build every surface (capture, engineer, portal, admin) in a single Next.js app. No Expo, no React Native, no app store.

**Why.** Browser `MediaRecorder` and `<input type="file" capture="environment">` give a native-feeling capture experience on any modern phone browser. React Native would cost 5+ hours of setup for no meaningful demo benefit.

**Consequence.** Capture page is styled at phone dimensions so it looks like a mobile app when opened on a phone or in a phone-shaped browser window.

---

### T2. Zero-cost stack

**Decision.** Vercel + Supabase + Groq + browser SpeechRecognition. Zero dollars spent.

**Why.** Team does not want to spend money. All chosen services have generous free tiers that easily cover a hackathon demo.

**Consequence.** LLM is Groq's Llama 3.3 70B, not Anthropic Claude. Transcription is on-device where possible, Groq Whisper as iOS fallback. No Anthropic, no OpenAI, no S3, no Fly.io.

---

### T3. No dedicated backend service

**Decision.** No FastAPI, no Redis, no Docker, no worker queue. All server code lives in Next.js API routes on Vercel.

**Why.** Every hour spent on backend infra is an hour not spent on the demo. Supabase JS SDK handles CRUD directly from the browser. Only API routes needed are LLM calls (need to hide the Groq key).

**Consequence.** LLM calls run inline in an API route triggered from the client. If they exceed a few seconds, show a "processing" UI state. Production version gets a proper queue later.

---

### T4. RAG shortcut: standards as JSON, no vector DB

**Decision.** Load 10 to 15 NTI standard clauses as a JSON file in the repo. Include all of them in every LLM prompt. Skip embeddings and pgvector for the MVP.

**Why.** Ten short clauses fit in Llama 3.3 70B's context easily. Setting up pgvector, ingestion, chunking and embedding costs hours for zero demo benefit. Production version does proper RAG.

**Consequence.** Pitch must clearly say "for the demo we included all clauses in the prompt, in production this becomes a retrieval step against the full NTI standards library".

---

### T5. Multi-device via Supabase realtime, not localhost tricks

**Decision.** Phone and laptop both hit the same Vercel URL and subscribe to the same Supabase project. Realtime subscription pushes new captures and findings live.

**Why.** No ngrok, no local networking, no WebSocket code to write. Supabase realtime works out of the box.

**Consequence.** Demo shows two devices in sync via a hosted DB. Judges see a live "new finding appeared" moment without asking how.

---

### T6. Fixture peer benchmark data

**Decision.** Peer benchmark chart uses hardcoded fixture data. The schema and query pattern are production-ready, but the "peer cohort" is fake for the demo.

**Why.** No time to synthesise realistic multi-customer data. Judges care about the story and the interaction, not statistical validity.

**Consequence.** If asked, say plainly: "peer cohort is fixture data for the demo, the underlying schema and cohort query are production-ready". Do not pretend it is real data.

---

## Rejected options (recorded so we do not revisit them)

- **Native mobile via Expo.** Rejected T1. Cost 4 feasibility points on the scoring, no wow benefit.
- **Remote pre-audit triage using dashcam or telematics.** Rejected D5 (V4 variant). Full second AI pipeline, not feasible in 32 hours.
- **Anthropic Claude API.** Rejected T2. Costs money, and Groq's Llama 3.3 70B is more than adequate for hackathon-scale prompts.
- **FastAPI + Fly.io + Redis + Docker.** Rejected T3. Zero deployment overhead is better than "correct" architecture for this scope.
- **pgvector + full RAG pipeline.** Rejected T4. Ten clauses fit in context.

---

## Competitive landscape (as of July 2026)

Based on research into YC batches W25 through S26 plus adjacent players. Nobody is doing our exact combination. Each piece exists in isolation somewhere.

### Direct-ish competitors, ranked by closeness

**Denki (YC F25).** $4.1M seed raised March 2026. Automates 99% of internal audits, financial audit vertical (SOX 404, BSA/AML). Integrates with AuditBoard, Workiva, ERPs. Targets $290B audit compliance market.
*Our line:* "Denki does back-office financial audits. We do physical field risk audits. Same 'structured audit data' pattern, completely different vertical."

**InspectMind AI (YC W24).** $2.1M revenue, 14 people. Two products: AI Plan Check for construction drawings (main), Field Reports for site inspections ($100/user/month).
*Our line:* "InspectMind stops at construction plan check plus generic field reports. We do commercial motor risk audit with a customer-facing portal and cross-audit benchmarks. Different vertical, deeper stack."

**Kebra (YC S26).** Voice-first field service operating layer for HVAC, plumbing, electricians. Building a "Company Brain" from every job.
*Our line:* "Kebra runs field service jobs (fix the leak, log the parts). We run field audits (score the risk, benchmark against peers). Same voice-first UX, opposite end of the value chain."

**Panta (YC W26).** AI commercial insurance broker. Automates 95% of broker back-office. Runs OpenClaw agents on Mac Minis.
*Our line:* "Panta automates the broker side of commercial insurance. We do the risk engineering side, upstream of the policy. Complementary, not competing."

### Adjacent players (for context, not likely to be raised by judges)

- **TruckDocsAI** (not YC, launched June 2026). DOT compliance docs for owner-operators. Compliance paperwork, not risk audits.
- **Carma (YC).** Fleet ops for Fortune 500 fleets, $5.5M seed. Ops, not audit.
- **Supadock (YC).** AI workers for logistics ops (driver ID, warehouse entry). Trucking-adjacent, wrong function.
- **Fleetline (YC).** Load planning for trucking fleets.
- **Ridecell.** Auto-leasing AI with telematics/insurance integration.
- **Risklytics (YC W26).** AI property risk scoring for insurers (property/CAT, not fleet).
- **Verdex (YC W26).** Satellite-based insurance verification.
- **Field1st** (not YC). AI construction inspection.

### Market tailwind

Two trend data points to cite on the moat slide:

- **46% of SaaS M&A in Q2 2025 was concentrated in vertical SaaS.** Consolidation is happening in the exact segment we're building in.
- **"Domain data is the single most valuable asset in 2026"** (L40, SaaS Mag). Our structured-findings data spine is literally this argument in product form.

### Our one-sentence differentiator (memorise this)

"Nobody is fusing field capture, structured audit data and a customer benchmarking portal in a single vertical stack. Denki does financial audits, InspectMind does construction plan check, Panta automates the broker side. We do commercial motor risk audit end to end, from voice capture on the depot floor to peer benchmarks in the customer portal to underwriter-ready risk telemetry."

---

## Open questions to resolve during build

- Which two of the three NTI risk engineers can we get on a 15-minute call before pitch day?
- Which adjacent audit firm (marine, mining, aviation) will give us a 15-minute call for the QUT market slide?
- Can we get a redacted NTI audit report and the audit template to base the fixture standards on?
- What are the other two NTI teams actually building? If either heads for the data-spine angle, pivot to the remote pre-audit triage angle (bullet 1) as the differentiator.

---

## How to update this file

Add a new numbered entry (D-series for product, T-series for tech). Do not rewrite past entries, even if a decision is later reversed. Instead add a new entry that supersedes it and reference the old ID.
