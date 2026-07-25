# Is the product enough? Feasibility, viability, scalability

Written 2026-07-25. Context: NTI Risk Engineering brief (QUT Entrepreneurship), judged on
Validation, Execution & Design, Business Model. Team of 3. Current build is a static
Next.js export — no backend, no persistence, no auth.

Three questions asked: if we remove the questionnaire, must we replace the feature? Is the
product enough? The computer vision is cool but feels incomplete for insurance software —
why?

Short answers:

1. **Yes, you must replace the signal — but not with another questionnaire.** The
   questionnaire *is* the decision engine. Remove it and nothing computes an outcome.
2. **The product is enough in surface area and short on spine.** You do not need more
   features. You need the decision to be defensible and the loop to close.
3. **The CV feels incomplete because it structurally is.** A camera can see one of NTI's
   four risk pillars, and half of a second. That is not a model-quality gap you can train
   away. It is a coverage gap.

---

## 1. What the product actually is today

Traced end to end, not from the README (which is stale — it describes a Supabase/Groq build
that does not exist in `package.json`).

| Piece | File | Reality |
|---|---|---|
| Landing page | `src/app/(marketing)/page.tsx` | Marketing. Fine. |
| Guided audit | `src/app/audit/page.tsx` | 4 pillars × 3 questions, then an upload step |
| Scoring | `src/lib/score.ts` | Mean `riskWeight` across 12 answers → outcome band |
| Questionnaire | `src/lib/data/questionnaire.ts` | The only source of scoring signal |
| Vision | `src/lib/data/analysis.ts` | Hand-authored fixtures for 2 sample trucks |
| Evidence upload | `audit/page.tsx:68` | `URL.createObjectURL` previews only — nothing uploads |
| "Analyzing" | `audit/page.tsx:51` | `setTimeout` theatre, 750 ms per stage |
| Persistence | — | None. Refresh loses everything. |

Two things follow from this table and they matter more than any feature decision.

**The vision output is not wired to the decision.** `ANALYSIS` renders in a panel *below* the
result. `scoreAudit()` never reads it. Photos do not influence the outcome by even one
decimal place. So "we have CV" and "we route audits" are currently two unconnected demos
sitting on the same page.

**The photo count is cosmetic.** The result screen prints `{photoCount} PHOTOS`. A submission
with zero photos scores identically to one with twelve. For a product whose pitch is "route
on evidence quality", evidence currently has no weight.

---

## 2. Removing the questionnaire leaves a hole in the middle

`scoreAudit(answers, sections)` computes score, outcome band, and all four findings purely
from `answers`. Delete the questionnaire and:

- `score` has no inputs → no number
- `outcome` has no band → no tier
- `findings` has no per-pillar worst-weight → no reasons

What remains is a photo uploader, a fake progress list, and a fixture gallery. A judge from
NTI will ask "so where does the tier come from?" and there is no answer. That is the risk of
removing it, stated plainly.

But the fix is not to rebuild a questionnaire. The fix is to **keep the scoring spine and
change what feeds it.** The spine — per-pillar worst signal → band → outcome + reasons — is
the correct shape and is worth defending. Only the input needs to change.

### While you are in there: the hard gate is missing

`score.ts` derives the outcome from the *mean* of all 12 weights. One catastrophic answer
gets averaged away:

```
one weight 5 + eleven weight 1  →  total 16, mean 1.33  →  outcome "cleared"
```

Meanwhile that pillar's finding renders as **"Needs fixing"**. The result screen can
therefore show "Cleared on evidence" directly above a finding that says a high-risk item
needs attention. Your own trust copy promises the opposite — *"Some findings always go to a
person, no matter what the score says"* (`CHECKS`, `page.tsx:66`). The code does not do that.

For an insurance product this is the one bug class that actually costs money: a false
negative on a severity-5 finding. Fix is three lines — any finding at severity ≥ 4 forces
`site_visit` regardless of mean. Do this whatever else you decide.

---

## 3. Why the CV feels incomplete: pillar coverage

NTI's brief names four pillars. Map them against what a camera can observe:

| Pillar | Camera can see | Coverage |
|---|---|---|
| **Asset Management** | Tyre condition, restraints, visible defects, safety-tech presence. *Not* maintenance systems, service records, standards adherence. | Partial |
| **Site Safety & Security** | Signage, pedestrian segregation, bunding, fencing, housekeeping. *Not* protocols or drills. | Partial |
| **People & Capability** | Nothing. Recruitment, training, culture, retention are organisational facts. | None |
| **Emergency & Incident Mgmt** | Nothing. Response processes, learnings, comms are organisational facts. | None |

**Two of four pillars are invisible to a camera, and the two it can see, it sees the
condition of but not the system behind.** That is why the CV feels incomplete for insurance
software. It is not incomplete because the boxes need tightening or the model needs
fine-tuning. It is incomplete because half the brief is not photographable, and a risk
audit that scores only what is photographable is not a risk audit — it is a vehicle
inspection.

This is also the strongest argument for keeping *some* declared input. Insurers already
work this way: the proposal form captures what cannot be observed, and inspection verifies
what can. You are not adding a questionnaire back for lack of imagination — you are
reproducing the standard structure of underwriting, which is exactly the credibility you
want in front of NTI judges.

---

## 4. Feasibility

Separate what a vision model can defend from what it cannot.

**Feasible today, high confidence:**

- Vehicle type, body type, axle count, colour — routine classification
- Plate OCR from a front/rear frame — routine; already in your fixtures at 0.79 confidence
- Presence/absence checks: straps visible, chocks present, extinguisher mounted, signage
  present, load covered
- **Re-use and tamper detection** — perceptual hash against prior submissions, EXIF GPS/
  timestamp/device against the depot and submission window. Cheap, deterministic, and the
  single most credible feature you have for an insurer. It needs no model at all.

**Not defensible from an uncalibrated phone photo:**

- `"Tread ~7.4 mm · ~72% left"` (`analysis.ts`). Millimetre metrology from a single frame
  with no scale reference, unknown focal length, and arbitrary angle is not a number you can
  put in front of an underwriter. The honest version is a *band* with a confidence and an
  escalation path: "tread appears low — send a depth-gauge photo" (which is precisely what
  Tier 2 is for).

The rule that falls out: **CV produces evidence signals with confidence, never verdicts.**
A signal below a confidence threshold does not fail the audit — it routes to Tier 2 and asks
for better evidence. That is a feature, not a limitation, and it is your Tier 2 justification
in one sentence.

### Cost feasibility

Vision inference is not a constraint. Per audit, ~12 images:

| Model | Image tokens/audit | Cost/audit (input + modest output) |
|---|---|---|
| Haiku 4.5 ($1/$5 per MTok) | ~19k | **~$0.02–0.03** |
| Sonnet 5 ($3/$15) at ~1.6k tok/image | ~19k | ~$0.08 |
| Sonnet 5 at full 2576 px (~4.8k tok/image) | ~57k | ~$0.20 |
| Opus 5 ($5/$25) | ~19–57k | ~$0.13–0.32 |

At 6,000 audits/year that is **$120–1,900/year in inference**. One avoided site visit pays
for the entire year. Never argue this product on inference cost — argue it on travel.

Recommendation: Haiku 4.5 for the cheap detection pass (presence/absence, classification,
hashing), escalate ambiguous frames to Sonnet 5. Downsample to ~1568 px unless a specific
check needs the resolution.

---

## 5. Viability

What an insurer actually buys, ranked by how much they care:

1. **Lower cost per audit.** The expensive input is engineer travel, not assessment. This is
   your whole thesis and it is correct.
2. **More of the book audited.** Coverage is a loss-ratio lever — unaudited operators are
   unpriced risk.
3. **Defensibility.** Every adverse outcome must survive a dispute, a regulator, and a
   reinsurer. That means: which standard, which version, which evidence, who signed.
4. **Risk improvement, not just risk measurement.** An audit that finds a problem and never
   confirms the fix has not reduced any loss. See §7.
5. Cool AI. Last. Nobody buys this.

Your existing decisions already serve (1) and (3): human sign-off as a hard constraint
(`D3`), anti-gaming as a design premise, per-pillar reasons rather than a bare score. Keep
all of it.

Where viability is thin: **nothing persists.** "We turn every audit NTI has ever done into a
live risk data product" (`D1`) is the strongest pitch line you have, and the current build
accumulates zero data. That is a narrative-versus-artefact gap a judge can find in one
question. It does not need a database to fix for the pitch — it needs a schema on a slide
and an honest sentence. But you must say it, not paper over it.

---

## 6. Scalability

Three axes. Only one of them is technical, and it is the least interesting.

### Technical

Static export, no server. Zero scale today, and that is fine for a demo. Real scale is
unremarkable: image upload to object storage, a queue, a VLM call per submission, a Postgres
row per finding. Nothing here is hard, nothing here is novel, nothing here should consume
pitch time.

### Operational — this is the real ceiling

The business case is one number: **the Tier 3 rate.** Everything else rounds to noise.

Baseline: 3 engineers × ~220 working days = **660 in-person audits/year** ceiling.

Model, at 68/22/10, per audit: 0.10 engineer-days in-person + ~20 min remote review on the
22% + ~2 min batch sign-off on the 68% = **0.112 engineer-days per audit**.

660 ÷ 0.112 ≈ **5,900 audits/year — about 8.9× baseline.** The 10× claim holds. Sensitivity:

| Tier 3 rate | Audits/year | Multiple |
|---|---|---|
| 8% | ~7,200 | 10.9× |
| **10% (claimed)** | **~5,900** | **8.9×** |
| 15% | ~4,000 | 6.1× |
| 25% | ~2,500 | 3.8× |

Read the dominant term: in-person days are ~89% of the total load. Remote verification is
nearly free by comparison. **The product's entire value is correctly moving audits out of
Tier 3 — and the 10× survives only while Tier 3 stays under ~9%.**

Which gives you the honest framing of the classifier's two failure modes:

- **False negative** (real risk cleared) — destroys the product. Insurers cannot carry this.
- **False positive** (safe audit escalated) — destroys the economics. Tier 3 creeps to 25%
  and you are a 3.8× product with an AI bill.

Say this on stage. It is the most credible thing you can say, because it proves you know
which number your business is. And note the 68/22/10 split is currently an assumption, not
a measurement — see §9.

### Data

The moat is the structured findings corpus, not the model. Every audit should make the next
audit's routing better and give the portfolio a benchmark. Today nothing is written down,
so the moat is not accruing. Cheapest credible fix for the pitch: show the schema and the
cohort query, and state plainly that the corpus starts at customer one.

---

## 7. What is actually missing for insurance software

Ranked by credibility gained per hour spent. Note that none of the top items is more CV.

**1. The close-out loop.** Finding → required action → operator re-submits proof → engineer
clears it. Without this, the product measures risk and never reduces it, which makes it an
inspection tool rather than a risk-improvement product. It is also the cheapest thing on
this list to demo: one screen that says "upload proof this is fixed" and one status flip.
This single addition changes the category the product competes in.

**2. Standards versioning on the finding.** Which NTI clause, which version, scored when.
An adverse finding that cannot name its authority does not survive a dispute. One field.

**3. The hard gate** (§2). Three lines, prevents the one failure mode insurers cannot carry.

**4. Evidence retention and privacy.** Yard photos contain plates, faces, and locations —
personal information under the Privacy Act, collected from third parties (drivers) by a
party they have no relationship with. You need a retention period, a stated purpose, and a
disclosure path. You have a `/privacy` page already; one paragraph and one slide covers it.
Judges from an insurer will notice if nobody has thought about it.

**5. Audit trail.** Who saw what, when, and who signed. You already have the sign-off
constraint; make it a record rather than a claim.

**6. Better CV.** Genuinely last. It is the most visible and the least load-bearing.

---

## 8. Recommendation: the minimal replacement

Keep `scoreAudit()`'s shape. Change its inputs. Three options considered:

**A. Evidence-led scoring with a short declaration — recommended.**

- Photos/video produce per-pillar evidence signals for Asset Management and Site Safety
  (presence/absence checks + reuse/EXIF trust signals + classification), each with a
  confidence.
- A short declaration — 3–4 questions on one screen — covers People & Capability and
  Emergency & Incident, because a camera cannot see them and pretending otherwise is the
  actual product flaw.
- Per pillar: `signal = worst(evidence_signal, declared_weight)`. Low-confidence evidence
  does not fail; it routes to Tier 2 and asks for a better frame.
- Outcome = current bands **plus** the severity ≥ 4 hard gate.

This keeps the "we read the yard, we don't just ask" story, closes the pillar coverage gap
honestly, deletes ~9 of 12 questions, and makes photos matter for the first time. Call the
remainder a **declaration**, not a questionnaire — it is what insurers already call it, and
it sets up the anti-gaming layer as the answer to declared-evidence moral hazard.

**B. Vision only, narrow the product to asset risk.** Honest and smaller. Costs you two of
four pillars and therefore most of the NTI brief. Only take this if you are willing to
re-pitch as "fleet asset triage" rather than risk engineering.

**C. No scoring, show the analysis.** Product becomes a viewer. No decision, no triage, no
business case. Do not.

---

## 9. What not to build

- **A second questionnaire.** You are removing one for a reason.
- **A real CV training pipeline.** Fixtures plus one honest disclosure sentence beat a
  half-trained model, and you already have precedent for saying so (`T6`).
- **Auth, roles, dashboards.** You deleted these deliberately (`docs/simplify-plan.md`).
  They were the right deletion. Do not undo it.
- **Premium/pricing maths in code.** Keep the pricing link in the *pitch* — audit data
  pricing the policy is the viability punchline — but it does not need to compute.

---

## 10. Open items the code cannot answer

- **68/22/10 is an assumption.** Where does it come from? If it is not from NTI
  conversations, say "modelled" on stage, not "measured". Judges will ask, and the number
  is your entire business case (§6).
- **Fixture disclosure.** `analysis.ts` reads as a live model in the UI ("AI vision
  analysis", per-detection confidences). It is hand-authored. Have the one-line disclosure
  ready before an NTI judge finds it — the honest version costs you nothing and the
  discovered version costs you the room.
- **Validation is not a code problem.** One of the three judging criteria is whether you
  talked to customers. No amount of building moves that number. If the two-engineer calls
  and the adjacent-firm call in `docs/old/decisions.md` have not happened, they are worth
  more than every item in §7.
- **Tread-depth claim.** Decide now whether to soften it to a band (§4) or keep it and
  answer for it.

---

## The honest summary

You are not doing too little. You are doing the wrong last 10%.

The surface area is right and the design is genuinely strong — that is the criterion you are
already winning. What is missing is a decision spine that survives the questionnaire's
removal, a hard gate so the tier can never contradict its own findings, a close-out loop so
the product reduces risk instead of just measuring it, and a validated Tier 3 rate so the
business case is a measurement rather than a hope.

The CV is not the incomplete part. It is one of four pillars, doing its job. Stop trying to
make it carry the product and let it be the evidence layer under a decision that a person
signs.
