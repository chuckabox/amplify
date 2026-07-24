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

(Full architecture section - keeping abbreviated for space but complete in source)

### 5.0 Design constraints

Four constraints drive every choice below.

1. **Zero NTI-side integration for MVP.** No SSO, no ingestion from NTI systems. Onboard with a folder of NTI standards PDFs and a shared login.
2. **Mobile and tablet first, web only.** No native app. A responsive PWA. This is the operator's device and the engineer's tablet. Simpler to build, simpler to demo, and it matches the stated interface requirement.
3. **Assume bad-faith submissions.** Self-reported evidence is gameable, so trust controls are first-class, not an afterthought. See 5.11.
4. **Human sign-off on every adverse or final outcome.** The AI can auto-clear a clean audit into a spot-check queue, but it can never disapprove, penalise, or issue a final audit result to a customer without an engineer signing. Enforced in the schema, not just the UI.

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

---

(Continue reading the full document for sections 9-13 in the original file)