# Demo Script

Pitch flow, timings and fallbacks for the NTI Risk Engineer Copilot hackathon pitch. Rehearse this at least three times before judging.

**Total target time:** 3 minutes pitch + 2 minutes Q&A (adjust to actual hackathon rules).

---

## Setup before you walk on stage

- Laptop plugged in, screen mirrored to the venue display.
- Phone on the same WiFi as the laptop, browser open to `yourapp.vercel.app/capture`, already logged in as demo engineer.
- Laptop has three browser tabs pre-opened: `/audits/[demo-id]/review`, `/portal/[demo-customer-id]`, `/admin`.
- Demo data already seeded (one customer "Acme Transport, Brisbane Depot", one active audit).
- Volume on. Notifications off.
- Backup: a pre-recorded 30-second screen recording of the live demo, in case the network dies.

---

## Pitch structure (3 minutes)

### 0:00 to 0:20 — Opening hook

**Say:** "NTI has three risk engineers auditing transport fleets across all of Australia. Every audit is in person. Every report is written by hand. Every finding gets trapped in a PDF nobody reads twice."

**Show:** Slide 1. One image of a risk engineer at a truck depot with a clipboard. Title: "One PDF, one time, then nothing."

---

### 0:20 to 0:40 — The one-line pitch

**Say:** "Every other team in this room will automate the audit report. We turn every audit NTI has ever done into a live risk data product."

**Show:** Slide 2. Three-panel image: phone (capture), laptop (review + portal), dashboard (NTI admin). Title: "One product, three surfaces, one data spine."

---

### 0:40 to 2:10 — Live demo (90 seconds)

**0:40 — Hold up the phone.** Say "Here's the risk engineer on-site. Acme Transport, Brisbane Depot."

**0:45 — Tap the Asset Management pillar, tap record.** Speak clearly: "Front left tyre on rig 12 is worn below the legal tread limit. Recommend immediate replacement."

**0:55 — Snap a photo of anything nearby.** Say "Photos, GPS, timestamps all captured."

**1:00 — Tap Complete Walkaround.** Put the phone down.

**1:02 — Pick up the laptop.** Show the `/audits/[demo-id]/review` tab. The transcript and drafted finding are already there (courtesy of realtime subscription and Groq's speed).

**1:15 — Point at the finding.** Say "The LLM cross-referenced our voice note against NTI's standards, drafted a full finding with severity and recommendation, and cited the exact clause. But it's a draft. The engineer is always in the loop."

**1:25 — Click Sign Off.** Say "One click. Amplify, not replace."

**1:30 — Switch to the `/portal` tab.** Say "Now the customer logs in. They see their findings, their severity heatmap, and here's the moment we care about."

**1:45 — Point at the peer benchmark chart.** Say "They see how they rank against other fleets of similar size in similar regions. This is why they pay for the portal every year, not just when they get audited."

**1:55 — Switch to the `/admin` tab.** Say "And NTI leadership sees every audit rolled up. Trends by industry. Engineer hours saved. This is what turns NTI's audit function from a cost centre into a data business."

**2:08 — Close the laptop.**

---

### 2:10 to 2:40 — Business model

**Say:** "Two revenue lines from one build. Per-seat SaaS to NTI so three engineers deliver like thirty. Per-customer subscription for the benchmarking portal. Third line waiting behind the moat, anonymised risk telemetry sold to underwriters. Every new customer we add makes the peer benchmark more valuable for every existing customer. That's a data-network moat, and it only exists because we structured the findings from day one."

**Show:** Slide 3. Three revenue lines with rough numbers. Data-network moat diagram.

---

### 2:40 to 3:00 — Close

**Say:** "We spoke to [NTI contact name]. They told us they're stretched thin across too many initiatives to build this internally. That's exactly why we ship it as a turnkey product. Zero integration burden. Two weeks to onboard NTI. Same product ships to marine surveyors, mining audits, aviation ground handling. We're not building a workflow tool. We're building the data spine for niche high-expertise audit."

**Show:** Slide 4. Team names + roles + one contact email. Title: "NTI Risk Engineer Copilot."

---

## Q&A anticipation

Prep answers for these before pitching.

**Q: "How is this different from InspectMind?"**
A: "InspectMind's main product is AI plan check for construction drawings. Their Field Reports side-product is close to our capture piece but stops at the report and lives in construction. We're commercial motor risk audit end to end, with a customer-facing portal, peer benchmarks and a portfolio view for NTI. Same first mile, completely different destination."

**Q: "What about Denki? They just raised for AI audits."**
A: "Denki automates back-office financial audits (SOX, BSA/AML) and lives inside AuditBoard and Workiva. We do physical field risk audits at transport depots. Same 'structured audit data' pattern, completely different vertical and completely different customer."

**Q: "Isn't Panta doing this? They're AI-native commercial insurance."**
A: "Panta automates the broker back-office, placing policies faster. We work upstream of the policy, on the risk engineering side. If anything they're a future partner not a competitor. Better underwriting inputs from us feed better broker automation from them."

**Q: "What about Kebra, they're also voice-first field capture?"**
A: "Kebra runs field service jobs. Fix the leak, log the parts, upsell the follow-up. We run field audits. Score the risk, benchmark against peers, feed the underwriter. Same UX pattern, opposite end of the value chain."

**Q: "How does the LLM know NTI's standards?"**
A: "For the demo we load NTI's standard clauses in the prompt. In production this is a proper RAG pipeline over NTI's full standards library with pgvector, tenant-scoped so nothing crosses customers."

**Q: "Where is the peer benchmark data from?"**
A: Straight up: "The peer cohort is fixture data for today's demo. The schema and query are production-ready. Real cohorts form as NTI onboards customers, and each new customer makes the benchmark more valuable for the ones already in."

**Q: "What if the LLM gets a finding wrong?"**
A: "Every finding is `status = draft` until an engineer signs it. Human sign-off is enforced in schema, not just UI. We built this specifically because NTI put 'amplify not replace' on the brief."

**Q: "What stops NTI from building this themselves?"**
A: "They told us they can't. NTI is stretched across too many initiatives to resource internal build. Our value is speed to product plus the reusability across other niche audit firms."

**Q: "Who is the customer, NTI or the fleet operator?"**
A: "Both. NTI pays for engineer seats. Fleet operators pay for the ongoing portal and benchmarks. NTI keeps the customer relationship year-round instead of just at audit time."

**Q: "Where's the moat?"**
A: "Structured findings compound across customers. Every new audit firm using the platform adds to peer benchmarks that every existing customer sees. Classic data-network effect. That's why we structured findings from day one instead of just producing PDFs."

**Q: "Is this a real venture or a consulting project for NTI?"**
A: "NTI is the beachhead because they have the sharpest version of the pain and two of our judges are from NTI. The same product ships to marine surveyors, mining audits, aviation ground handling, any niche audit vertical where three or four experts can't scale. That's a venture. NTI is the wedge."

---

## Fallback plan (if something breaks)

**If WiFi is down at the venue.**
Play the 30-second backup screen recording of the live capture demo. Keep talking over it. The pitch structure works even if the live moment fails.

**If Groq is rate-limited during the demo.**
Have three pre-generated findings cached in the demo data. Trigger the "generate" action and it returns the cached one. Judges see the same outcome.

**If the phone browser can't access the camera or mic.**
Fall back to a laptop-only demo. Explain that "in the field the engineer uses their phone, we're showing you the same interface on a laptop for clarity". Loses the two-device wow but preserves the pitch.

**If a demo tab fails to load.**
Skip it and keep talking. Do not troubleshoot on stage. Move to the next tab. Come back to it in Q&A if asked.

---

## Team roles for the pitch

- **One speaker.** One voice on stage keeps the timing tight. Others handle the demo props.
- **Phone handler.** Holds the phone, taps record, hands it off. Also holds the backup video queued up.
- **Laptop handler.** Switches tabs on the speaker's cue.

Rehearse the tab-switch timing three times minimum. The two most-lost seconds in any hackathon pitch are between "let me switch to..." and the next tab loading.
