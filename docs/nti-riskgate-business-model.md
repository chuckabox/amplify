# RiskGate — Business Model

Developed from the one-line model in `nti-riskgate-plan.md` §2. Grounded in the same facts: NTI's audit function is in-person-only, three risk engineers, four risk pillars, tiered funnel that clears most audits without a site visit.

---

## 1. The value proposition, stated as money

NTI's constraint is not paperwork speed — it's that three engineers physically cannot visit every operator. The audit function's cost is **engineer-days per audit** (travel + on-site + write-up).

RiskGate removes the site visit from the audits that don't need one. If the funnel clears ~70% at Tier 1 and resolves ~20% by remote video (Tier 2), only ~10% reach an in-person Tier 3 visit.

**The multiplier is the product.** Same three engineers, ~5–8× the operators covered. Everything below is priced off that multiplier.

```
Today:     3 engineers × ~1 audit/day (travel-bound)      ≈ baseline coverage
RiskGate:  3 engineers × triage 8–10 audits/day,          ≈ 5–8× coverage
           physically visit only the ~10% flagged red
```

That is the number the whole model sells. Not "faster reports" — *more portfolio covered per fixed headcount.*

---

## 2. Customer segments (who pays, who uses)

| Segment | Role | Pays? |
|---|---|---|
| **NTI risk-engineering leadership** | Owns audit cost + headcount, feels travel pain | **Primary buyer** — SaaS seats |
| NTI risk engineers (×3) | Daily user — triage queue, escalations, dashboard | Users, not payers |
| Audited transport operators | Run the guided audit, see findings + benchmarks | **Secondary buyer** — portal subscription |
| NTI-authorised workshops | Perform standardised physical check, raise trust score | Partner (distribution + trust), not a payer at MVP |
| NTI underwriters / product | Want fleet-wide risk telemetry to price against | **Future buyer** — data line |

---

## 3. Revenue streams

Four lines, staged by how hard they are to land. Land line 1 first; the rest compound on the same platform.

### Line 1 — Per-seat SaaS to NTI (the anchor)
Priced on the **throughput multiplier**, not on head-count of seats. The pitch is ROI, not licence fees: "one blocked site visit ≈ one engineer-day saved; the platform costs less than the visits it removes."

- **Model:** annual platform fee + per-engineer-seat.
- **Anchor logic:** a single loaded engineer-day (salary + vehicle + travel + time) is the unit of value. If RiskGate removes even a fraction of visits across the portfolio, the platform is a rounding error against the labour it frees.
- **Illustrative:** platform base + seats, sized so total annual cost sits well under the value of visits avoided. Sell against *cost-per-audit avoided*, not per-seat sticker.

### Line 2 — Per-operator portal subscription
Operators get their portal: audit status in the funnel, findings with severity + fixes, remediation tracker, and **anonymised peer benchmarking** (fleet size + region cohort). Benchmarking is the recurring hook — it's the thing they log back in for.

- **Model:** low monthly/annual per-operator, or bundled by NTI into the policy relationship (NTI pays, passes value to insured).
- **Why it's sticky:** compliance status + peer benchmark is a reason to return between audits, not just at audit time.

### Line 3 — Authorised-workshop partner network
Workshops perform a standardised basic physical check and attest to it, raising a submission's trust score. This is simultaneously a **trust mechanism** (defends against gamed self-reporting) and a **distribution channel** (workshops onboard operators for you).

- **Model:** network access / certification fee to workshops, or referral economics. Small revenue at first; strategically it's the moat (see §6).

### Line 4 — Risk telemetry to underwriters (future)
Anonymised, aggregated fleet-wide risk signal per pillar/industry/region — the exhaust of every audit run through the funnel. Underwriters price against it.

- **Model:** data product / API subscription. Highest margin, needs volume first. This is the "market beyond the audit tool" line that turns a SaaS tool into a venture.

---

## 4. Unit economics

**Cost to serve one audit** (variable): object storage for photos/video + vision-model inference + retrieval scoring + a slice of engineer spot-check time. All small and falling; the expensive input — the site visit — is exactly what the funnel removes.

**Gross margin** improves as the funnel tunes: every audit that shifts from Tier 3 (engineer-day) to Tier 1 (cents of inference + minutes of spot-check) is margin captured. The trust controls (EXIF/GPS checks, hard gates, workshop attestation) protect this — a gamed clean audit that should've been visited is the failure mode that destroys the economics, so trust is a first-class cost, not overhead.

**The flywheel:** more audits → better benchmark cohorts + better-tuned triage model → higher auto-clear rate → lower cost per audit *and* a richer telemetry product (Line 4). Volume improves all four revenue lines at once.

---

## 5. Go-to-market

1. **Land NTI as the anchor customer** (turnkey, zero NTI-side integration for MVP — shared login, standards PDFs, a demo phone). Prove the multiplier on their real portfolio.
2. **Expand within NTI:** more of the portfolio onto the operator portal (Line 2), grow the workshop network (Line 3).
3. **Adjacent audit domains** — marine survey, mining-site inspection, warehouse/WHS. Same shape (self-reported photo evidence + expert-scarce in-person audit + risk scoring). This is the QUT "venture, not consulting-gig" line.
4. **Telemetry as a data product** (Line 4) once audit volume is real.

**Wedge:** NTI has already articulated the exact pain and can't resource fixing it internally. Turnkey + ROI-priced against engineer-days makes the first sale a labour-arbitrage decision, not an IT project.

---

## 6. Moat / defensibility

- **Partner-network moat.** The authorised-workshop network is a two-sided asset — trust supply + operator distribution. Hard for a paperwork-only competitor to replicate.
- **Data moat.** Tuned triage model + benchmark cohorts + telemetry improve with every audit. A late entrant starts cold.
- **Model-of-record.** Human sign-off on every adverse/final outcome (enforced in schema) makes RiskGate the auditable system of record, not a disposable capture tool.

The two other hackathon teams build capture-to-report for the engineer — faster paperwork, human still on-site for every audit. RiskGate changes the audit *model*, so it wins on the axis they don't compete on.

---

## 7. Market sizing (framing for the pitch)

- **Beachhead (SOM):** NTI's own audit function — replace/augment the in-person audit workflow. Concrete, one buyer, immediate ROI story.
- **SAM:** Australian transport & logistics insurers + fleet risk audit generally.
- **TAM:** expert-scarce, in-person, photo-evidence audit markets across domains — marine, mining, WHS/warehouse, agriculture. Any market where a scarce expert must physically travel to inspect self-reportable evidence.

---

## 8. Why it satisfies both judge camps

- **NTI judges** ("would we deploy this"): solves their stated scaling bottleneck, turnkey, ROI-priced against engineer-days, human sign-off preserved.
- **QUT judges** ("is this a venture"): four stacked revenue lines, a partner-network + data moat, and a repeatable expansion path into adjacent audit markets — a platform, not a consulting engagement.

---

## 9. Open numbers to fill before pitch

Placeholders to replace with real figures from the validation calls named in the plan (§Validation):

- Loaded cost of one engineer-day (salary + vehicle + travel).
- Current audits/engineer/year and target multiplier.
- NTI's audited-operator count → Line 2 ceiling.
- Achievable Tier-1 auto-clear rate from the pilot → drives the whole margin story.
